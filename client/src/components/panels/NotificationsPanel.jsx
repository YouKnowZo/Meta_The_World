import { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import axios from 'axios';

export default function NotificationsPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const res = await axios.get('/api/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      await axios.put('/api/notifications/read', { notificationIds });
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend_request': return '👤';
      case 'friend_accepted': return '✅';
      case 'property_sold': return '🏠';
      case 'match': return '💕';
      case 'quest_complete': return '🎯';
      case 'achievement': return '🏆';
      case 'level_up': return '⬆️';
      default: return '🔔';
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Bell className="w-8 h-8" />
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>
        {notifications.filter(n => !n.read).length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-gray-800/50 border rounded-lg p-4 ${
                notification.read ? 'border-gray-700' : 'border-purple-500/50 bg-purple-600/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{notification.title}</div>
                  <div className="text-white/70 text-sm">{notification.message}</div>
                  <div className="text-white/50 text-xs mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead([notification._id])}
                      className="text-green-400 hover:text-green-300"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="text-red-400 hover:text-red-300"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
