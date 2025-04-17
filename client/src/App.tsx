import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context'; // Import the AuthProvider
import Sidebar from './sidebar';
import OwnerSignup from './page/auth/OwnerSignUp';
import DriverSignup from './page/auth/DriverSignUp';
import AddVehiclePage from './page/owner/addVehicle';
import ManageDriverPage from './page/owner/manageDriver';
import OwnerLogin from './page/auth/Ownerlogin';
import Notifications from './page/Notification';
import DriverAssignedVehiclePage from './page/driver/DriverAssignedVehiclePage';
import LandingPage from './page/LandingPage'; // Import the Landing Page
import DriverDashboard from './page/DriverDashboard'; // Import the Driver Dashboard
import OwnerDashboard from './page/OwnerDashboard'; // Import the Owner Dashboard
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex' }}>
          <Sidebar /> {/* Sidebar Component */}
          <div
            style={{
              flex: 1,
              marginLeft: '280px', // Add margin to account for the Sidebar's width
              padding: '24px', // Add padding for better spacing
              backgroundColor: '#F9FAFB', // Optional: Add a light background for contrast
              minHeight: '100vh', // Ensure the main content spans the full height
            }}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} /> {/* Default Landing Page */}
              <Route path="/owner-dashboard" element={<OwnerDashboard />} />
              <Route path="/driver-dashboard" element={<DriverDashboard />} /> 
              <Route path="/owner-signup" element={<OwnerSignup />} />
              <Route path="/driver-signup" element={<DriverSignup />} />
              <Route path="/add-vehicle" element={<AddVehiclePage />} />
              <Route path="/manage-driver" element={<ManageDriverPage />} />
              <Route path="/login" element={<OwnerLogin />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/driver-assigned-vehicle-page" element={<DriverAssignedVehiclePage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;