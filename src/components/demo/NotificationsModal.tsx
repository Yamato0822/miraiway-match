import { useDemo } from '../../state/DemoContext';
import { Modal } from '../common/Modal';
import { useNavigate } from 'react-router-dom';
import { Bell, Mail, Calendar, Award, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const typeIcons = {
  scout: Mail,
  application: Mail,
  message: MessageSquare,
  interview: Calendar,
  offer: Award,
  system: Bell,
};

export function NotificationsModal() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const isOpen = state.ui.modal?.type === 'notifications';

  const relevantNotifications = state.notifications
    .filter((n) => n.forRole === state.currentRole)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleClose = () => dispatch({ type: 'DISMISS_MODAL' });

  const handleClick = (notifId: string, route: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', notificationId: notifId });
    handleClose();
    navigate(route);
  };

  return (
    <Modal open={isOpen} onClose={handleClose} title="通知一覧" maxWidth="460px">
      {relevantNotifications.length === 0 ? (
        <p className="text-[14.5px] font-semibold text-center text-[#64748B] py-8">
          新しい通知はありません
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
          <AnimatePresence>
            {relevantNotifications.map((notif, idx) => {
              const Icon = typeIcons[notif.type] || Bell;
              return (
                <motion.button
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, type: 'spring', damping: 25, stiffness: 350 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleClick(notif.id, notif.route)}
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl text-left transition-colors cursor-pointer w-full border ${
                    notif.read
                      ? 'bg-white border-slate-100 text-[#0F172A]'
                      : 'bg-gradient-to-r from-blue-50/70 to-white border-blue-200/80 text-[#0F172A]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.read ? 'bg-slate-100 text-[#64748B]' : 'bg-[#0071E3] text-white'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[14.5px] font-bold text-[#0F172A] leading-snug">
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0071E3] shrink-0 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[13px] text-[#64748B] mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </Modal>
  );
}
