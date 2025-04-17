import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './context';
import {
  LogOut,
  Car,
  Users,
  Bell,
  UserPlus,
  LogIn,
  Home,
  Truck,
} from 'lucide-react';

// Define animation variants
const sidebarVariants = {
  hidden: { x: -250 },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const NavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ to, icon, children }) => (
  <motion.div variants={itemVariants}>
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: '16px',
        padding: '12px 16px',
        borderRadius: '8px',
        transition: 'background-color 0.2s',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {icon}
      {children}
    </Link>
  </motion.div>
);

const Sidebar: React.FC = () => {
  const { isLoggedIn, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function from the context
    localStorage.clear(); // Clear any stored user data
    navigate('/'); // Redirect to the landing page
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      style={{
        width: '280px',
        height: '100vh', // Full height of the viewport
        position: 'fixed', // Makes the sidebar sticky
        top: 0, // Aligns it to the top of the viewport
        left: 0, // Aligns it to the left of the viewport
        backgroundColor: '#1E3A8A',
        background: 'linear-gradient(180deg, #1E3A8A 0%, #1E40AF 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 25px rgba(0, 0, 0, 0.1)',
        zIndex: 1000, // Ensures the sidebar stays above other elements
      }}
    >
      {/* Sidebar Header */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '40px',
          padding: '24px',
        }}
      >
        <Truck size={32} strokeWidth={1.5} />
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
          }}
        >
          Vehicle Manager
        </h2>
      </motion.div>

      {/* Navigation Links */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
          padding: '0 24px',
        }}
      >
        {!isLoggedIn ? (
          <>
            <NavLink to="/owner-signup" icon={<UserPlus size={20} />}>
              Owner Signup
            </NavLink>
            <NavLink to="/driver-signup" icon={<UserPlus size={20} />}>
              Driver Signup
            </NavLink>
            <NavLink to="/login" icon={<LogIn size={20} />}>
              Login
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to={role === 'owner' ? '/owner-dashboard' : '/driver-dashboard'} icon={<Home size={20} />}>
              Dashboard
            </NavLink>
            {role === 'owner' && (
              <>
                <NavLink to="/add-vehicle" icon={<Car size={20} />}>
                  Add Vehicle
                </NavLink>
                <NavLink to="/manage-driver" icon={<Users size={20} />}>
                  Manage Driver
                </NavLink>
              </>
            )}
            {role === 'driver' && (
              <NavLink to="/driver-assigned-vehicle-page" icon={<Car size={20} />}>
                Assigned Vehicle
              </NavLink>
            )}
            <NavLink to="/notifications" icon={<Bell size={20} />}>
              Notifications
            </NavLink>
          </>
        )}
      </nav>

      {/* Logout Button */}
      {isLoggedIn && (
        <motion.button
          variants={itemVariants}
          onClick={handleLogout} // Use the handleLogout function
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#ffffff',
            backgroundColor: 'rgba(239, 68, 68, 0.9)',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            margin: '24px',
          }}
          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 1)' }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={20} />
          Logout
        </motion.button>
      )}
    </motion.div>
  );
};

export default Sidebar;