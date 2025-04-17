"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = exports.assignVehicleToDriver = exports.getFreeVehiclesByOwner = exports.removeDriverById = exports.getDriversByOwner = exports.getVehiclesByOwner = exports.manageVehicle = exports.removeVehicle = exports.addVehicle = exports.getOwnerById = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const getOwnerById = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = await prisma.owner.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (!owner) {
            res.status(404).json({ error: 'Owner not found' });
        }
        res.status(200).json(owner);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getOwnerById = getOwnerById;
// Add Vehicle Controller
const addVehicle = async (req, res) => {
    try {
        const { ownerId, chassisNo, engineNo, regdNo, fuelType, insuranceCompany, insurancePolicyNo, insuranceValidUpto, puccNo, puccValidUpto, insuranceDocument, pucDocument } = req.body;
        // Check if the Owner exists
        const owner = await prisma.owner.findUnique({
            where: { id: ownerId },
        });
        if (!owner) {
            res.status(404).json({ error: 'Owner not found' });
            return;
        }
        // Create the Vehicle
        const vehicle = await prisma.vehicle.create({
            data: {
                chassisNo,
                engineNo,
                regdNo,
                fuelType,
                insuranceCompany,
                insurancePolicyNo,
                insuranceValidUpto: new Date(insuranceValidUpto),
                puccNo,
                insuranceDocument,
                pucDocument,
                puccValidUpto: new Date(puccValidUpto),
                owner: {
                    connect: { id: ownerId },
                },
            },
        });
        res.status(201).json({ message: 'Vehicle added successfully', vehicle });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add vehicle' });
    }
};
exports.addVehicle = addVehicle;
// Remove Vehicle Controller
const removeVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        // Delete the Vehicle
        await prisma.vehicle.delete({
            where: { id: parseInt(vehicleId, 10) },
        });
        res.status(200).json({ message: 'Vehicle removed successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove vehicle' });
    }
};
exports.removeVehicle = removeVehicle;
// Manage Vehicle Controller
const manageVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const { chassisNo, engineNo, regdNo, fuelType, insuranceCompany, insurancePolicyNo, insuranceValidUpto, puccNo, puccValidUpto } = req.body;
        // Update the Vehicle
        const updatedVehicle = await prisma.vehicle.update({
            where: { id: parseInt(vehicleId, 10) },
            data: {
                chassisNo,
                engineNo,
                regdNo,
                fuelType,
                insuranceCompany,
                insurancePolicyNo,
                insuranceValidUpto: new Date(insuranceValidUpto),
                puccNo,
                puccValidUpto: new Date(puccValidUpto),
            },
        });
        res.status(200).json({ message: 'Vehicle updated successfully', updatedVehicle });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
};
exports.manageVehicle = manageVehicle;
const getVehiclesByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params; // Assuming ownerId is passed as a route parameter
        // Fetch vehicles for the given owner
        const vehicles = await prisma.vehicle.findMany({
            where: { ownerId: parseInt(ownerId, 10) },
            include: {
                owner: true, // Include owner details if needed
            },
        });
        if (!vehicles || vehicles.length === 0) {
            res.status(404).json({ error: 'No vehicles found for this owner' });
            return;
        }
        res.status(200).json({ message: 'Vehicles fetched successfully', vehicles });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
};
exports.getVehiclesByOwner = getVehiclesByOwner;
const getDriversByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params; // Assuming ownerId is passed as a route parameter
        // Fetch drivers for the given owner
        const drivers = await prisma.driver.findMany({
            where: { ownerId: parseInt(ownerId, 10) },
        });
        if (!drivers || drivers.length === 0) {
            res.status(200).json({ message: 'No drivers found for this owner' });
            return;
        }
        res.status(200).json({ message: 'Drivers fetched successfully', drivers });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch drivers' });
    }
};
exports.getDriversByOwner = getDriversByOwner;
const removeDriverById = async (req, res) => {
    try {
        const { driverId } = req.params;
        // Delete the driver
        await prisma.driver.delete({
            where: { id: parseInt(driverId, 10) },
        });
        res.status(200).json({ message: 'Driver removed successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove driver' });
    }
};
exports.removeDriverById = removeDriverById;
const getFreeVehiclesByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        // Fetch vehicles with status "free"
        const vehicles = await prisma.vehicle.findMany({
            where: {
                ownerId: parseInt(ownerId, 10),
                status: "free",
            },
        });
        if (!vehicles || vehicles.length === 0) {
            res.status(404).json({ error: 'No free vehicles found for this owner' });
            return;
        }
        res.status(200).json({ message: 'Free vehicles fetched successfully', vehicles });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch free vehicles' });
    }
};
exports.getFreeVehiclesByOwner = getFreeVehiclesByOwner;
const assignVehicleToDriver = async (req, res) => {
    try {
        const { driverId, vehicleId } = req.body;
        // Check if the vehicle exists and is free
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: parseInt(vehicleId, 10) },
        });
        if (!vehicle || vehicle.status !== "free") {
            res.status(400).json({ error: 'Vehicle is not available for assignment' });
            return;
        }
        // Check if the driver exists
        const driver = await prisma.driver.findUnique({
            where: { id: parseInt(driverId, 10) },
        });
        if (!driver) {
            res.status(404).json({ error: 'Driver not found' });
            return;
        }
        // Use a transaction to ensure both updates succeed or fail together
        await prisma.$transaction([
            prisma.driver.update({
                where: { id: parseInt(driverId, 10) },
                data: {
                    vehicleClass: vehicle.regdNo, // Update the driver's vehicle class
                },
            }),
            prisma.vehicle.update({
                where: { id: parseInt(vehicleId, 10) },
                data: {
                    status: "engaged",
                    driverId: parseInt(driverId, 10), // Link the vehicle to the driver
                },
            }),
        ]);
        res.status(200).json({ message: 'Vehicle assigned to driver successfully' });
    }
    catch (error) {
        console.error('Error assigning vehicle to driver:', error);
        res.status(500).json({ error: 'Failed to assign vehicle to driver' });
    }
};
exports.assignVehicleToDriver = assignVehicleToDriver;
const getNotifications = async (req, res) => {
    try {
        const { userId, role } = req.query;
        if (!userId || !role) {
            res.status(400).json({ error: 'Missing userId or role' });
            return;
        }
        let notifications;
        if (role === 'owner') {
            notifications = await prisma.notificationLog.findMany({
                where: { ownerId: parseInt(userId, 10) },
                include: {
                    vehicle: true,
                    driver: true,
                },
                orderBy: { sentAt: 'desc' },
            });
        }
        else if (role === 'driver') {
            notifications = await prisma.notificationLog.findMany({
                where: { driverId: parseInt(userId, 10) },
                include: {
                    vehicle: true,
                    owner: true,
                },
                orderBy: { sentAt: 'desc' },
            });
        }
        else {
            res.status(400).json({ error: 'Invalid role' });
            return;
        }
        // Disable caching
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json({ message: 'Notifications fetched successfully', notifications });
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};
exports.getNotifications = getNotifications;
