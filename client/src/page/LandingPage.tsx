import React from 'react';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'center',
        padding: '40px',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{
          maxWidth: '800px',
          padding: '40px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          style={{ marginBottom: '30px' }}
        >
          <Truck size={64} strokeWidth={1.5} />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '24px',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
          }}
        >
          Welcome to Personalized Vehicle Management System
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            fontSize: '20px',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          Manage your vehicles and drivers efficiently with our easy-to-use platform.
          Experience seamless fleet management with real-time tracking and comprehensive analytics.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;