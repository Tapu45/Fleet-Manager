import React, { useEffect, useState } from 'react';
import { getNotifications } from '../utils/api';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId'); // Store user ID in localStorage
  const role = localStorage.getItem('role'); // Store user role (owner or driver) in localStorage

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId || !role) {
        setError('User ID or role is missing. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getNotifications(parseInt(userId, 10), role);
        setNotifications(response.notifications);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, role]);

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification: any) => (
            <li key={notification.id}>
              <p>
                <strong>Message:</strong> {notification.message} <br />
                <strong>Vehicle:</strong> {notification.vehicle.regdNo} <br />
                {role === 'owner' && notification.driver && (
                  <>
                    <strong>Driver:</strong> {notification.driver.name} <br />
                  </>
                )}
                {role === 'driver' && notification.owner && (
                  <>
                    <strong>Owner:</strong> {notification.owner.name} <br />
                  </>
                )}
                <strong>Sent At:</strong> {new Date(notification.sentAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;