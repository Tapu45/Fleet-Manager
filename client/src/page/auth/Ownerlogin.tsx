import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Import the centralized Axios instance
import { useAuth } from '../../context';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      // Save token and user details in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('role', data.user.role);

      login(data.user.role);

      // Redirect based on role
      if (data.user.role === 'owner') {
        navigate('/owner-dashboard'); // Redirect to the Owner Dashboard
      } else if (data.user.role === 'driver') {
        navigate('/driver-dashboard'); // Redirect to the Driver Dashboard
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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
          maxWidth: '400px',
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
          Login
        </h1>
        {error && (
          <p
            style={{
              color: 'red',
              backgroundColor: '#FFE4E6',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E3A8A' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E3A8A' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;