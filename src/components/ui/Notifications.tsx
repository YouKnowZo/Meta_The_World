import { useEffect } from 'react';
import { useGameStore } from '../../store';
import { CheckCircle, Info, AlertTriangle, X as XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Notifications() {
  const notifications = useGameStore((state) => state.notifications);
  const removeNotification = useGameStore((state) => state.removeNotification);

  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'warning':
      case 'error':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-500 text-white';
      case 'info':
        return 'from-blue-500 to-cyan-500 text-white';
      case 'warning':
        return 'from-yellow-500 to-orange-500 text-white';
      case 'error':
        return 'from-red-500 to-rose-500 text-white';
      default:
        return 'from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[60] space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="pointer-events-auto"
          >
            <div
              className={`bg-gradient-to-r ${getColors(
                notification.type
              )} rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-md border border-white/20`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <h4 className="font-bold mb-1">{notification.title}</h4>
                  <p className="text-sm opacity-90">{notification.message}</p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="hover:bg-white/20 p-1 rounded-lg transition-all"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
