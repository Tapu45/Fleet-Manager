import React, { useEffect, useState } from 'react';
import { getDriversByOwner, getFreeVehiclesByOwner, assignVehicleToDriver } from '../../utils/api';

const ManageDriverPage: React.FC = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState<{ id: number; regdNo: string; fuelType: string }[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ownerId = localStorage.getItem('userId');

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await getDriversByOwner(parseInt(ownerId || '0', 10));
      if (response.data.drivers.length === 0) {
        setError('No drivers available for this owner');
        setDrivers([]);
      } else {
        setDrivers(response.data.drivers);
        setError('');
      }
    } catch (err: any) {
      setError('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const fetchFreeVehicles = async () => {
    try {
      setLoading(true);
      const response = await getFreeVehiclesByOwner(parseInt(ownerId || '0', 10));
      setVehicles(response.data.vehicles);
    } catch (err) {
      setError('Failed to fetch free vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignVehicle = async (vehicleId: number) => {
    try {
      setLoading(true);
      if (selectedDriver !== null) {
        await assignVehicleToDriver({ driverId: selectedDriver, vehicleId });
      } else {
        setError('No driver selected');
      }
      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== vehicleId));
      setSelectedDriver(null);
      alert('Vehicle assigned successfully');
    } catch (err) {
      setError('Failed to assign vehicle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        color: '#1E3A8A',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          padding: '40px',
        }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          Manage Drivers
        </h1>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

        <div style={{ display: 'flex', gap: '40px' }}>
          {/* Drivers List */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Drivers</h2>
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
              {drivers.map((driver: any) => (
                <li
                  key={driver.id}
                  style={{
                    backgroundColor: '#EFF6FF',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <p style={{ margin: '0 0 10px' }}>
                    <strong>Name:</strong> {driver.name}
                  </p>
                  <p style={{ margin: '0 0 10px' }}>
                    <strong>Email:</strong> {driver.email}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedDriver(driver.id);
                      fetchFreeVehicles();
                    }}
                    style={{
                      backgroundColor: '#3B82F6',
                      color: '#ffffff',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3B82F6')}
                  >
                    Assign Vehicle
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicles List */}
          {selectedDriver && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Available Vehicles</h2>
              <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                {vehicles.map((vehicle: any) => (
                  <li
                    key={vehicle.id}
                    style={{
                      backgroundColor: '#EFF6FF',
                      padding: '20px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <p style={{ margin: '0 0 10px' }}>
                      <strong>Registration No:</strong> {vehicle.regdNo}
                    </p>
                    <p style={{ margin: '0 0 10px' }}>
                      <strong>Fuel Type:</strong> {vehicle.fuelType}
                    </p>
                    <button
                      onClick={() => handleAssignVehicle(vehicle.id)}
                      style={{
                        backgroundColor: '#3B82F6',
                        color: '#ffffff',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3B82F6')}
                    >
                      Assign This Vehicle
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDriverPage;