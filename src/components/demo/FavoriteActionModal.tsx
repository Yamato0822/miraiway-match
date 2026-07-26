import { useDemo } from '../../state/DemoContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CandidateAvatar, FlagIcon } from '../common/CandidateAvatar';
import { Heart, Send, FileText, X, ArrowRight } from 'lucide-react';

export function FavoriteActionModal() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const isOpen = state.ui.modal?.type === 'favorite_action';
  const props = state.ui.modal?.props || {};

  const candidateId = props.candidateId || 'c1';
  const candidate = state.candidates.find((c) => c.id === candidateId) || state.candidates[0];

  const handleClose = () => dispatch({ type: 'DISMISS_MODAL' });

  const handleSendScout = () => {
    handleClose();
    const defaultJob = state.jobs[0];
    if (defaultJob) {
      dispatch({
        type: 'SCOUT_CANDIDATE',
        candidateId: candidate.id,
        jobId: defaultJob.id,
        message: 'プロフィールを拝見し、ぜひ一度お話ししたいと思いました。',
      });
      dispatch({
        type: 'SHOW_MODAL',
        modal: {
          type: 'matching_success',
          props: { candidateId: candidate.id },
        },
      });
    }
  };

  const handleGoToDetail = () => {
    handleClose();
    navigate(`/company/candidates/${candidate.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          {/* Glassmorphic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="relative max-w-[500px] w-full bg-white rounded-3xl p-7 md:p-8 shadow-2xl border border-slate-200 z-20 flex flex-col gap-6 text-left"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header Row with Popping Heart Animation */}
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: [0.5, 1.3, 0.95, 1], rotate: [ -20, 10, -5, 0 ] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-12 h-12 rounded-2xl bg-slate-100 text-[#0071E3] flex items-center justify-center shrink-0 border border-slate-200 shadow-sm"
              >
                <Heart size={24} fill="#0071E3" className="text-[#0071E3]" />
              </motion.div>

              <div>
                <span className="text-[12.5px] font-extrabold text-[#0071E3] uppercase tracking-wider block">
                  FAVORITED
                </span>
                <h3 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight leading-snug">
                  「気になる」に保存しました！
                </h3>
              </div>
            </div>

            {/* Candidate Summary Strip */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
              <CandidateAvatar src={candidate.photoUrl} name={candidate.name} candidateId={candidate.id} size="md" className="w-12 h-12 rounded-xl" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-[15px] font-extrabold text-[#0F172A] truncate">{candidate.name}</h4>
                  <span className="text-[11.5px] font-bold px-2 py-0.5 rounded bg-white text-[#0071E3] border border-slate-200 inline-flex items-center gap-1">
                    <FlagIcon className="w-3.5 h-2.5" />
                    {candidate.field}
                  </span>
                </div>
                <p className="text-[13px] text-[#64748B] font-semibold mt-0.5 truncate">
                  日本語 {candidate.japaneseLevel} ({candidate.studyHours}h) · {candidate.desiredLocations.join('・')}
                </p>
              </div>
            </div>

            {/* Subtitle Prompt */}
            <p className="text-[14.5px] text-[#64748B] font-semibold -mt-2">
              次のアクションを行いますか？今すぐメッセージを送るか、質問を準備できます。
            </p>

            {/* Action Choices (3 Rich Choices) */}
            <div className="flex flex-col gap-3">
              {/* Option 1: Send Scout */}
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendScout}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left flex items-center justify-between cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0071E3] text-white flex items-center justify-center shrink-0">
                    <Send size={18} />
                  </div>
                  <div>
                    <span className="text-[15px] font-extrabold text-[#0F172A] block">今すぐスカウトを送る</span>
                    <span className="text-[12.5px] text-[#64748B] font-medium">直接メッセージを送って選考（マッチング）に進む</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-[#0071E3] group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Option 2: Prepare Questions */}
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoToDetail}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left flex items-center justify-between cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F172A] flex items-center justify-center shrink-0 border border-slate-200">
                    <FileText size={18} />
                  </div>
                  <div>
                    <span className="text-[15px] font-extrabold text-[#0F172A] block">詳細プロフィール・質問準備</span>
                    <span className="text-[12.5px] text-[#64748B] font-medium">面談所感や職歴を確認して質問を整理する</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-[#64748B] group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Option 3: Save Only */}
              <button
                onClick={handleClose}
                className="p-3 text-[14px] font-bold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer text-center mt-1"
              >
                保存のみにして後で検討する
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
