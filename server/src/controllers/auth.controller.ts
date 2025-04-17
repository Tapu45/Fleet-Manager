import { PrismaClient } from '../../generated/prisma';
import bcrypt from 'bcryptjs';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '', // Add your Razorpay Key ID in .env
  key_secret: process.env.RAZORPAY_KEY_SECRET || '', // Add your Razorpay Key Secret in .env
});

import { triggerVehicleAlerts } from '../../utils/alert';

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if the user is an owner
    const owner = await prisma.owner.findUnique({
      where: { email },
    });

    if (owner) {
      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, owner.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: owner.id, email: owner.email, role: 'owner' },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1d' }
      );

      // Trigger vehicle alerts after successful login
      await triggerVehicleAlerts();

      // Respond with the token and owner details
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: owner.id,
          name: owner.name,
          email: owner.email,
          role: 'owner',
        },
      });
    }

    // Check if the user is a driver
    const driver = await prisma.driver.findUnique({
      where: { email },
    });

    if (driver) {
      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, driver.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: driver.id, email: driver.email, role: 'driver' },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1d' }
      );

      // Respond with the token and driver details
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: driver.id,
          name: driver.name,
          email: driver.email,
          role: 'driver',
        },
      });
    }

    // If no user is found
    return res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Helper function to validate Aadhaar number
const isValidAadhaar = (adhaarNo: string): boolean => {
  const aadhaarRegex = /^\d{12}$/; // Aadhaar must be exactly 12 digits
  return aadhaarRegex.test(adhaarNo);
};

// Owner Signup Controller
export const ownerSignup = async (req: any, res: any) => {
  try {
    const { name, email, password, adhaarNo, planId, paymentId } = req.body;

    // Step 1: If `paymentId` is not provided, generate a Razorpay order
    if (!paymentId) {
      // Validate input for order generation
      if (!planId) {
        return res.status(400).json({ error: 'Plan ID is required to initiate payment' });
      }

      // Check if the plan exists
      const plan = await prisma.plan.findUnique({
        where: {  id: parseInt(req.body.planId, 10),  },
      });

      if (!plan) {
        return res.status(404).json({ error: 'Selected plan does not exist' });
      }

      // Create a Razorpay order
      const order = await razorpay.orders.create({
        amount: Math.round(plan.price * 100), // Convert price to paise
        currency: 'INR',
        receipt: crypto.randomBytes(10).toString('hex'), // Generate a random receipt ID
      });

      // Respond with the Razorpay order details
      return res.status(201).json({
        message: 'Payment initiated. Please complete the payment using the QR code.',
        orderId: order.id,
        amount: plan.price,
        currency: 'INR',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${order.id}&size=200x200`, // Generate QR code URL
      });
    }

    // Step 2: If `paymentId` is provided, verify the payment and register the user
    // Validate input for user registration
    if (!name || !email || !password || !adhaarNo || !planId) {
      return res.status(400).json({ error: 'All fields are required for user registration' });
    }

    // Validate Aadhaar number format
    if (!isValidAadhaar(adhaarNo)) {
      return res.status(400).json({ error: 'Invalid Aadhaar number format' });
    }

    // Check if the email or Aadhaar number already exists
    const existingOwner = await prisma.owner.findFirst({
      where: {
        OR: [{ email }, { adhaar: adhaarNo }],
      },
    });

    if (existingOwner) {
      return res.status(400).json({ error: 'Email or Aadhaar number already exists' });
    }

    // Verify the payment with Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    if (!payment || payment.status !== 'captured') {
      return res.status(400).json({ error: 'Payment verification failed. Please try again.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new owner
    const newOwner = await prisma.owner.create({
      data: {
        name,
        email,
        password: hashedPassword,
        adhaar: adhaarNo,
        planId: parseInt(planId, 10), // Ensure planId is an integer
      },
    });

    // Respond with success
    res.status(201).json({ message: 'Owner registered successfully', ownerId: newOwner.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Driver Signup Controller
export const driverSignup = async (req: any, res: any) => {
  try {
    const { name, email, ownerEmail, password, licenseNo, licenseValidUpto, vehicleClass, adhaar } = req.body;

    // Step 1: Validate input
    if (!name || !email || !ownerEmail || !password || !licenseNo || !licenseValidUpto || !vehicleClass || !adhaar) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Step 2: Validate Aadhaar number format
    if (!isValidAadhaar(adhaar)) {
      return res.status(400).json({ error: 'Invalid Aadhaar number format' });
    }

    // Step 3: Check if the email or Aadhaar number already exists
    const existingDriver = await prisma.driver.findFirst({
      where: {
        OR: [{ email }, { adhaar }],
      },
    });

    if (existingDriver) {
      return res.status(400).json({ error: 'Email or Aadhaar number already exists' });
    }

    // Step 4: Check if the owner exists
    const owner = await prisma.owner.findUnique({
      where: { email: ownerEmail },
    });

    if (!owner) {
      return res.status(404).json({ error: 'Owner with the provided email does not exist' });
    }

    // Step 5: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 6: Create a new driver
    const newDriver = await prisma.driver.create({
      data: {
        name,
        email,
        password: hashedPassword,
        licenseNo,
        licenseValidUpto: new Date(licenseValidUpto),
        vehicleClass,
        adhaar,
        ownerId: owner.id, // Link the driver to the owner
      },
    });

    // Step 7: Respond with success
    res.status(201).json({ message: 'Driver registered successfully', driver: newDriver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Removed duplicate login function to resolve redeclaration error