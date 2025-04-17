import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, CreditCard, UserCircle } from 'lucide-react';

function OwnerSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // Added confirmPassword field
    adhaarNo: '',
    planId: 1,
  });

  const [message, setMessage] = useState('');
  const [plans] = useState([
    { id: 1, name: 'Bronze', price: 1, features: ['Basic Fleet Management', '24/7 Support', 'Up to 10 Vehicles'] },
    { id: 2, name: 'Silver', price: 2, features: ['Advanced Analytics', 'Priority Support', 'Up to 50 Vehicles'] },
    { id: 3, name: 'Gold', price: 5, features: ['Premium Features', 'Dedicated Account Manager', 'Unlimited Vehicles'] },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'planId' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    // Proceed with the signup process
    if (!(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = handlePayment;
      script.onerror = () => setMessage('Failed to load Razorpay script');
      document.body.appendChild(script);
    } else {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('https://fleet-manager-oq44.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          adhaarNo: formData.adhaarNo,
          planId: formData.planId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Failed to initiate payment');
        return;
      }

      const options = {
        key: 'rzp_test_hwRiIgq0aEllU9',
        amount: data.amount * 100,
        currency: data.currency,
        name: 'Fleet Manager',
        description: 'Plan Subscription',
        order_id: data.orderId,
        handler: async (paymentResponse: any) => {
          const verifyResponse = await fetch('http://localhost:7000/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              paymentId: paymentResponse.razorpay_payment_id,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (!verifyResponse.ok) {
            setMessage(verifyData.error || 'Payment verification failed');
            return;
          }
          localStorage.setItem('ownerId', verifyData.ownerId);
          setMessage(verifyData.message || 'Signup successful!');
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: '#1E3A8A', // Blue theme
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during payment');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #1E3A8A, #3B82F6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '900px',
          padding: '40px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1E3A8A' }}>Fleet Manager</h1>
            <p style={{ color: '#64748B', marginTop: '8px' }}>
              Create your account and start managing your fleet today
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              marginLeft: '-20px',
              marginRight: '40px',
            }}
          >
            {[
              { icon: UserCircle, name: 'name', type: 'text', placeholder: 'Full Name', value: formData.name },
              { icon: Mail, name: 'email', type: 'email', placeholder: 'Email Address', value: formData.email },
              { icon: Lock, name: 'password', type: 'password', placeholder: 'Password', value: formData.password },
              {
                icon: Lock,
                name: 'confirmPassword',
                type: 'password',
                placeholder: 'Confirm Password',
                value: formData.confirmPassword,
              },
              { icon: CreditCard, name: 'adhaarNo', type: 'text', placeholder: 'Aadhaar Number', value: formData.adhaarNo },
            ].map((field, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <field.icon
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B',
                  }}
                  size={20}
                />
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 48px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '14px',
                    transition: 'all 0.3s',
                  }}
                />
              </div>
            ))}

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#1E3A8A',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
            >
              Create Account
            </motion.button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '16px',
                marginTop: '16px',
                backgroundColor: '#EFF6FF',
                borderRadius: '8px',
                color: '#1E3A8A',
                fontSize: '14px',
              }}
            >
              {message}
            </motion.div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1E3A8A' }}>Select Your Plan</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {plans.map((plan) => (
              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={plan.id}
                style={{
                  display: 'block',
                  padding: '20px',
                  border: `2px solid ${
                    formData.planId === plan.id ? '#1E3A8A' : '#E2E8F0'
                  }`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: formData.planId === plan.id ? '#EFF6FF' : '#ffffff',
                  transition: 'all 0.3s',
                }}
              >
                <input
                  type="radio"
                  name="planId"
                  value={plan.id}
                  checked={formData.planId === plan.id}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E3A8A' }}>{plan.name}</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1E3A8A' }}>₹{plan.price}</span>
                </div>
                <ul style={{ marginTop: '8px', paddingLeft: '16px', listStyleType: 'none' }}>
                  {plan.features.map((feature, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', color: '#64748B', fontSize: '14px' }}>
                      <Building2 size={16} style={{ marginRight: '8px', color: '#64748B' }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.label>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OwnerSignup;