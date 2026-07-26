import { useDemo } from '../../state/DemoContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CandidateAvatar, FlagIcon } from '../common/CandidateAvatar';
import { Button } from '../common/Button';
import { Sparkles, Calendar, MessageSquare, ArrowRight, X, ShieldCheck } from 'lucide-react';

export function MatchingSuccessModal() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const isOpen = state.ui.modal?.type === 'matching_success';
  const props = state.ui.modal?.props || {};

  const candidateId = props.candidateId || 'c1';
  const candidate = state.candidates.find((c) => c.id === candidateId) || state.candidates[0];
  const company = state.companyProfile;

  const handleClose = () => dispatch({ type: 'DISMISS_MODAL' });

  const handleGoToMessages = () => {
    handleClose();
    const thread = state.threads.find((t) => t.candidateId === candidate.id);
    if (thread) {
      navigate(`/company/messages/${thread.id}`);
    } else {
      navigate('/company/messages');
    }
  };

  const handleGoToInterview = () => {
    handleClose();
    const thread = state.threads.find((t) => t.candidateId === candidate.id);
    if (thread) {
      navigate(`/company/interviews/${thread.id}`);
    } else {
      navigate('/company/messages');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          {/* Glassmorphic Backdrop with Radial Glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-xl"
          />

          {/* Golden Floating Star Particles (Idea 5) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[
              { x: '20%', y: '25%', delay: 0.1 },
              { x: '80%', y: '30%', delay: 0.3 },
              { x: '15%', y: '75%', delay: 0.2 },
              { x: '85%', y: '70%', delay: 0.4 },
              { x: '50%', y: '15%', delay: 0.25 },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, y: 10 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8], y: -30 }}
                transition={{ duration: 2, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                style={{ left: p.x, top: p.y }}
                className="absolute text-[#B45309]"
              >
                <Sparkles size={20} />
              </motion.div>
            ))}
          </div>

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 180, mass: 1.1 }}
            className="relative max-w-[560px] w-full bg-white rounded-3xl p-7 md:p-9 shadow-[0_25px_60px_-15px_rgba(0,113,227,0.3)] border border-slate-200 z-20 flex flex-col gap-6 text-center overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', damping: 22, stiffness: 300 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-[#0071E3] font-extrabold text-[13px] border border-slate-200 mx-auto"
            >
              <Sparkles size={15} />
              MATCHED · 相互条件が一致しました
            </motion.div>

            {/* Title */}
            <div>
              <h2 className="text-[26px] md:text-[30px] font-extrabold text-[#0F172A] tracking-tight leading-snug">
                マッチング成立！
              </h2>
              <p className="text-[15px] text-[#64748B] font-semibold mt-1">
                {company.name} と {candidate.name} さんの選考がスタートします
              </p>
            </div>

            {/* Idea 3 & 4: Card Snap & Bridging Ceylon to Japan */}
            <div className="relative my-2 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-6">
              {/* Bridging Arch (Idea 4) */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <FlagIcon className="w-5 h-3.5" />
                  <span className="text-[13px] font-bold text-[#0F172A]">スリランカ</span>
                </div>
                <div className="flex-1 flex items-center justify-center px-4">
                  <div className="w-full h-0.5 bg-gradient-to-r from-[#0071E3] via-[#B45309] to-[#0071E3] relative flex items-center justify-center">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[#0071E3] shadow-2xs">
                      架け橋接続
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#0F172A]">日本 🇯🇵</span>
                </div>
              </div>

              {/* Snapped Cards (Idea 3) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Candidate Card */}
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 25, stiffness: 200 }}
                  className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col items-center text-center shadow-sm"
                >
                  <CandidateAvatar src={candidate.photoUrl} name={candidate.name} candidateId={candidate.id} size="lg" className="w-16 h-16 rounded-2xl mb-2" />
                  <span className="text-[15px] font-bold text-[#0F172A] truncate w-full">{candidate.name}</span>
                  <span className="text-[12px] font-semibold text-[#0071E3] mt-0.5">日本語 {candidate.japaneseLevel} ({candidate.studyHours}h)</span>
                </motion.div>

                {/* Company Card */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 25, stiffness: 200 }}
                  className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col items-center text-center shadow-sm justify-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-[#0071E3] flex items-center justify-center font-extrabold text-[20px] mb-2 border border-slate-200">
                    {company.name.charAt(0)}
                  </div>
                  <span className="text-[15px] font-bold text-[#0F172A] truncate w-full">{company.name}</span>
                  <span className="text-[12px] font-semibold text-[#64748B] mt-0.5">手取り目安: ¥17.5万〜</span>
                </motion.div>
              </div>

              {/* MiraiWay Support Tag */}
              <div className="inline-flex items-center justify-center gap-1.5 text-[12.5px] font-bold text-[#0071E3] bg-white px-3 py-1 rounded-lg border border-slate-200 mx-auto">
                <ShieldCheck size={14} />
                MiraiWay シンハラ語面面接通訳サポートが同席します
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleGoToMessages}
                className="flex-1"
              >
                <MessageSquare size={18} />
                やり取りを開く
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleGoToInterview}
                className="flex-1"
              >
                <Calendar size={18} />
                面接日程の調整へ
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
