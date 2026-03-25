import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Notification() {
  const { notification } = useApp();

  const icons = {
    success: <CheckCircle size={16} />,
    error: <AlertCircle size={16} />,
    info: <Info size={16} />,
  };

  const styles = {
    success: 'bg-black text-white',
    error: 'bg-red-900 text-white',
    info: 'bg-zinc-800 text-white',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`flex items-center gap-3 px-5 py-4 text-sm tracking-wide shadow-2xl ${styles[notification.type]} min-w-[280px]`}
          >
            {icons[notification.type]}
            <span className="flex-1">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
