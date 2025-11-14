import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import axios from 'axios';
import NotificationsPanel from './panels/NotificationsPanel';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const res = await axios.get('/api/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed top-4 right-4 z-50 p-4 rounded-lg backdrop-blur-md border-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all relative"
        title="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto bg-black/50 backdrop-blur-sm w-full h-full flex items-center justify-center p-4">
            <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto border border-purple-500/50 relative">
              <NotificationsPanel onClose={() => setShowPanel(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
