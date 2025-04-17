import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: 'https://fleet-manager-oq44.onrender.com/api', // Base URL for your API
  timeout: 5000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
});

// Add a request interceptor (optional)
api.interceptors.request.use(
  (config) => {
    // You can add authorization tokens or other headers here
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// API function for owner signup
export const ownerSignup = async (ownerData: {
  name: string;
  email: string;
  password: string;
  adhaarNo: string;
  planId: number;
}) => {
  return api.post('/auth/signup', ownerData);
};

// API function for driver signup
export const driverSignup = async (driverData: {
  name: string;
  email: string;
  ownerEmail: string;
  password: string;
  licenseNo: string;
  licenseValidUpto: string;
  vehicleClass: string;
  adhaar: string;
}) => {
  return api.post('/auth/driver/signup', driverData);
};

// API function to add a vehicle
export const addVehicle = async (vehicleData: {
  ownerId: number;
  chassisNo: string;
  engineNo: string;
  regdNo: string;
  fuelType: string;
  insuranceCompany: string;
  insurancePolicyNo: string;
  insuranceValidUpto: string;
  puccNo: string;
  puccValidUpto: string;
}) => {
  return api.post('/owners/vehicles', vehicleData);
};

// API function to update a vehicle
export const manageVehicle = async (vehicleId: number, vehicleData: {
  chassisNo: string;
  engineNo: string;
  regdNo: string;
  fuelType: string;
  insuranceCompany: string;
  insurancePolicyNo: string;
  insuranceValidUpto: string;
  puccNo: string;
  puccValidUpto: string;
}) => {
  return api.put(`/vehicles/${vehicleId}`, vehicleData);
};

// API function to remove a vehicle
export const removeVehicle = async (vehicleId: number) => {
  return api.delete(`/owners/vehicles/${vehicleId}`);
};

// API function to fetch vehicles by owner
export const getVehiclesByOwner = async (ownerId: number) => {
  return api.get(`/owners/${ownerId}/vehicles`);
};

// API function to fetch drivers by owner
export const getDriversByOwner = async (ownerId: number) => {
  return api.get(`/owners/${ownerId}/drivers`);
};

// API function to remove a driver by ID
export const removeDriverById = async (driverId: number) => {
  return api.delete(`/owners/drivers/${driverId}`);
};

export const getAssignedVehicle = async (driverId: number) => {
  return api.get(`/drivers/${driverId}/vehicle`);
};

// API function for owner login
export const ownerLogin = async (loginData: { email: string; password: string }) => {
  return api.post('/auth/login', loginData);
};

// API function to fetch free vehicles by owner
export const getFreeVehiclesByOwner = async (ownerId: number) => {
  return api.get(`/owners/${ownerId}/free-vehicles`);
};

// API function to assign a vehicle to a driver
export const assignVehicleToDriver = async (data: { driverId: number; vehicleId: number }) => {
  return api.post('/owners/assign-vehicle', data);
};

export const getAssignmentHistory = async (ownerId: number) => {
  const response = await fetch(`/api/owners/${ownerId}/assignment-history`);
  return response.json();
};

export const getNotifications = async (userId: number, role: string) => {
  try {
    const response = await api.get('/owners/notifications', {
      params: { userId, role }, // Pass userId and role as query parameters
    });
    return response.data; // Return the response data
  } catch (error: any) {
    console.error('Error fetching notifications:', error.response || error.message);
    throw new Error(error.response?.data?.error || 'Failed to fetch notifications');
  }
};

export const freeVehicle = (vehicleId: number) => {
  return api.patch(`/drivers/vehicle/${vehicleId}/free`);
};

export default api;