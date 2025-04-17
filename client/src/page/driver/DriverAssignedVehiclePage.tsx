import React, { useEffect, useState } from 'react';
import { getAssignedVehicle, freeVehicle } from '../../utils/api';

const DriverAssignedVehiclePage: React.FC = () => {
  const [vehicle, setVehicle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setMessage] = useState<string | null>(null);
  const driverId = localStorage.getItem('userId'); // Assuming driverId is stored in localStorage

  useEffect(() => {
    const fetchAssignedVehicle = async () => {
      try {
        if (!driverId) {
          setError('Driver ID is missing');
          return;
        }
        const response = await getAssignedVehicle(parseInt(driverId, 10));
        setVehicle(response.data.vehicle);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch assigned vehicle');
      }
    };

    fetchAssignedVehicle();
  }, [driverId]);

  const handleFreeVehicle = async () => {
    try {
      if (!vehicle) return;
      const response = await freeVehicle(vehicle.id); // Call the API to free the vehicle
      setMessage(response.data.message || 'Vehicle status updated successfully');
      setVehicle(null); // Clear the vehicle details after freeing it
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to free the vehicle');
    }
  };

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #1E3A8A, #3B82F6)',
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        {error}
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #1E3A8A, #3B82F6)',
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        Loading...
      </div>
    );
  }

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
          maxWidth: '600px',
          padding: '40px',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1E3A8A',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Assigned Vehicle Details
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <strong>Chassis No:</strong> {vehicle.chassisNo}
          </div>
          <div>
            <strong>Engine No:</strong> {vehicle.engineNo}
          </div>
          <div>
            <strong>Registration No:</strong> {vehicle.regdNo}
          </div>
          <div>
            <strong>Fuel Type:</strong> {vehicle.fuelType}
          </div>
          <div>
            <strong>Insurance Company:</strong> {vehicle.insuranceCompany}
          </div>
          <div>
            <strong>Insurance Policy No:</strong> {vehicle.insurancePolicyNo}
          </div>
          <div>
            <strong>Insurance Valid Upto:</strong> {new Date(vehicle.insuranceValidUpto).toLocaleDateString()}
          </div>
          <div>
            <strong>PUCC No:</strong> {vehicle.puccNo}
          </div>
          <div>
            <strong>PUCC Valid Upto:</strong> {new Date(vehicle.puccValidUpto).toLocaleDateString()}
          </div>
          <div>
            <strong>Status:</strong> {vehicle.status}
          </div>
          <div>
            <strong>Owner Name:</strong> {vehicle.owner.name}
          </div>
          <div>
            <strong>Owner Email:</strong> {vehicle.owner.email}
          </div>
          <div>
            <strong>Insurance Document:</strong>{' '}
            {vehicle.insuranceDocument ? (
              <a
                href={vehicle.insuranceDocument}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3B82F6', textDecoration: 'underline' }}
              >
                View Document
              </a>
            ) : (
              'Not Uploaded'
            )}
          </div>
          <div>
            <strong>PUCC Document:</strong>{' '}
            {vehicle.pucDocument ? (
              <a
                href={vehicle.pucDocument}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3B82F6', textDecoration: 'underline' }}
              >
                View Document
              </a>
            ) : (
              'Not Uploaded'
            )}

<button
          onClick={handleFreeVehicle}
          style={{
            marginTop: '20px',
            width: '100%',
            backgroundColor: '#DC2626',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          Free Vehicle
        </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAssignedVehiclePage;