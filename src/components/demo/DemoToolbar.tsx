import { useDemo } from '../../state/DemoContext';
import { Play, MessageSquarePlus, BellRing, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { FeedbackModal } from './FeedbackModal';
import { ScenarioPanel } from './ScenarioPanel';
import { MatchingSuccessModal } from './MatchingSuccessModal';
import { FavoriteActionModal } from './FavoriteActionModal';

export function DemoToolbar() {
  const { state, dispatch } = useDemo();

  const handleSimulateNotification = () => {
    const isCompany = state.currentRole === 'company';
    const notifId = `n-demo-${Date.now()}`;

    const newNotification = isCompany
      ? {
          id: notifId,
          type: 'interview' as const,
          title: '面接候補日が提出されました',
          description: 'K.D. サミンダさんよりご希望の面接日時が3候補到着しました。',
          route: '/company/messages/t1',
          read: false,
          timestamp: new Date().toISOString(),
          forRole: 'company' as const,
        }
      : {
          id: notifId,
          type: 'scout' as const,
          title: '株式会社サンライズ建設よりスカウトが届きました',
          description: '「型枠職人としてのお力をお借りしたいです」',
          route: '/candidate/messages/t1',
          read: false,
          timestamp: new Date().toISOString(),
          forRole: 'candidate' as const,
        };

    dispatch({ type: 'ADD_NOTIFICATION', notification: newNotification });
    dispatch({
      type: 'SHOW_TOAST',
      toast: {
        message: `🔔 新しい通知を受信しました: 「${newNotification.title}」`,
        type: 'info',
        action: { label: '通知を見る', route: newNotification.route },
      },
    });
  };

  const handleTriggerMatchingAnimation = () => {
    dispatch({
      type: 'SHOW_MODAL',
      modal: {
        type: 'matching_success',
        props: { candidateId: 'c1' },
      },
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="fixed top-20 right-6 z-40 hidden md:flex items-center gap-1.5 p-1 rounded-2xl shadow-lg border border-slate-900/[0.08] bg-white/90 backdrop-blur-md"
      >
        <button
          onClick={handleTriggerMatchingAnimation}
          className="flex items-center gap-1.5 text-[12.5px] font-bold px-3 py-1.5 rounded-xl bg-[#0071E3] text-white hover:bg-[#0077ED] transition-colors cursor-pointer shadow-sm"
          title="マッチング成功アニメーションを再生"
        >
          <Sparkles size={14} />
          <span>マッチング演出</span>
        </button>

        <button
          onClick={handleSimulateNotification}
          className="flex items-center gap-1.5 text-[12.5px] font-bold px-3 py-1.5 rounded-xl text-[#0071E3] hover:bg-slate-100 transition-colors cursor-pointer"
          title="通知の受信デモを実行"
        >
          <BellRing size={14} className="animate-bounce" />
          <span>通知デモ</span>
        </button>

        <button
          onClick={() => dispatch({ type: 'SHOW_MODAL', modal: { type: 'scenarios', props: {} } })}
          className="flex items-center gap-1 text-[12.5px] font-bold px-3 py-1.5 rounded-xl text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Play size={12} /> シナリオ
        </button>

        <button
          onClick={() => dispatch({ type: 'SHOW_MODAL', modal: { type: 'feedback', props: {} } })}
          className="flex items-center gap-1 text-[12.5px] font-bold px-3 py-1.5 rounded-xl text-[#B45309] hover:bg-amber-50 transition-colors cursor-pointer"
        >
          <MessageSquarePlus size={12} /> FB記録
        </button>
      </motion.div>

      <FeedbackModal />
      <ScenarioPanel />
      <MatchingSuccessModal />
      <FavoriteActionModal />
    </>
  );
}
