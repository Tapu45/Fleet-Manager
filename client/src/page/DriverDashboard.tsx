import React from 'react';

const DriverDashboard: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #1E3A8A, #3B82F6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '600px',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1E3A8A',
            marginBottom: '20px',
          }}
        >
          Welcome, Driver!
        </h1>
        <p style={{ fontSize: '16px', color: '#4B5563' }}>
          Thank you for being a part of our Fleet Manager platform. As a driver, you can view your assigned vehicles, track important documents, and stay updated with notifications. We are here to make your driving experience smooth and organized.
        </p>
      </div>
    </div>
  );
};

export default DriverDashboard;