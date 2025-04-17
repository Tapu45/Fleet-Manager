import React, { useState } from 'react';
import { driverSignup } from '../../utils/api';

const DriverSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ownerEmail: '',
    password: '',
    confirmPassword: '', // Added confirmPassword field
    confirmOwnerEmail: '', // Added confirmOwnerEmail field
    licenseNo: '',
    licenseValidUpto: '',
    vehicleClass: '',
    adhaar: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    // Check if owner email and confirm owner email match
    if (formData.ownerEmail !== formData.confirmOwnerEmail) {
      setMessage('Owner emails do not match!');
      return;
    }

    try {
      const response = await driverSignup({
        name: formData.name,
        email: formData.email,
        ownerEmail: formData.ownerEmail,
        password: formData.password,
        licenseNo: formData.licenseNo,
        licenseValidUpto: formData.licenseValidUpto,
        vehicleClass: formData.vehicleClass,
        adhaar: formData.adhaar,
      });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Signup failed');
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
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '500px',
          padding: '40px',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1E3A8A',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Driver Signup
        </h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { name: 'name', type: 'text', placeholder: 'Name', value: formData.name },
            { name: 'email', type: 'email', placeholder: 'Email', value: formData.email },
            { name: 'ownerEmail', type: 'email', placeholder: 'Owner Email', value: formData.ownerEmail },
            { name: 'confirmOwnerEmail', type: 'email', placeholder: 'Confirm Owner Email', value: formData.confirmOwnerEmail }, // Confirm Owner Email
            { name: 'password', type: 'password', placeholder: 'Password', value: formData.password },
            { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password', value: formData.confirmPassword }, // Confirm Password
            { name: 'licenseNo', type: 'text', placeholder: 'License Number', value: formData.licenseNo },
            { name: 'licenseValidUpto', type: 'date', placeholder: 'License Valid Upto', value: formData.licenseValidUpto },
            { name: 'vehicleClass', type: 'text', placeholder: 'Vehicle Class', value: formData.vehicleClass },
            { name: 'adhaar', type: 'text', placeholder: 'Aadhaar Number', value: formData.adhaar },
          ].map((field, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1E3A8A',
                }}
              >
                {field.placeholder}:
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={field.value}
                onChange={handleChange}
                required
                style={{
                  padding: '12px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.3s',
                }}
              />
            </div>
          ))}
          <button
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
            Signup
          </button>
        </form>
        {message && (
          <p
            style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: message.includes('failed') ? '#FFE4E6' : '#EFF6FF',
              color: message.includes('failed') ? 'red' : '#1E3A8A',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '14px',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default DriverSignup;