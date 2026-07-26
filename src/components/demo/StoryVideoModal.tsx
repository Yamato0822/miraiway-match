import { motion, AnimatePresence } from 'framer-motion';
import { CandidateAvatar, FlagIcon } from '../common/CandidateAvatar';
import { Button } from '../common/Button';
import { X, Play, Pause, Volume2, Send, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useState } from 'react';
import { useDemo } from '../../state/DemoContext';
import type { Candidate } from '../../types';

type Props = {
  candidate: Candidate | null;
  onClose: () => void;
  onNavigateDetail: (id: string) => void;
};

export function StoryVideoModal({ candidate, onClose, onNavigateDetail }: Props) {
  const { state, dispatch } = useDemo();
  const [isPlaying, setIsPlaying] = useState(true);

  if (!candidate) return null;

  const isFavorite = state.favorites.candidateIds.includes(candidate.id);

  const handleSendScout = () => {
    onClose();
    const defaultJob = state.jobs[0];
    if (defaultJob) {
      dispatch({
        type: 'SCOUT_CANDIDATE',
        candidateId: candidate.id,
        jobId: defaultJob.id,
        message: 'プロフィールとストーリー動画を拝見し、ぜひ一度お話ししたいと思いました。',
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
        {/* Glassmorphic Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F172A]/75 backdrop-blur-xl"
        />

        {/* Story Modal Container */}
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="relative max-w-[440px] w-full bg-white rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,113,227,0.35)] border border-slate-200 z-20 flex flex-col"
        >
          {/* Top Video Header Progress Line */}
          <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
            <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: isPlaying ? '100%' : '50%' }}
                transition={{ duration: 15, ease: 'linear' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>

          {/* Close & Favorite Floating Controls */}
          <div className="absolute top-6 right-4 z-30 flex items-center gap-2">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_FAVORITE_CANDIDATE', candidateId: candidate.id })}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-md cursor-pointer"
            >
              <Heart size={18} fill={isFavorite ? '#FFFFFF' : 'none'} className="text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-md cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Video Player Box */}
          <div className="relative h-[380px] bg-slate-900 flex items-center justify-center overflow-hidden">
            {/* Background Candidate Image */}
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              className="w-full h-full object-cover brightness-[0.88]"
            />

            {/* Dark Gradient Overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

            {/* Candidate Header Tag */}
            <div className="absolute top-7 left-4 z-20 flex items-center gap-2.5">
              <CandidateAvatar src={candidate.photoUrl} name={candidate.name} candidateId={candidate.id} size="sm" className="w-10 h-10 rounded-full ring-2 ring-white" />
              <div>
                <div className="flex items-center gap-1.5 text-white font-extrabold text-[15px]">
                  <span>{candidate.name}</span>
                  <FlagIcon className="w-4 h-3" />
                </div>
                <span className="text-[12px] text-white/80 font-medium">{candidate.field} · 日本語 {candidate.japaneseLevel}</span>
              </div>
            </div>

            {/* Center Play/Pause Simulated Pulse */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="relative z-20 w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg border border-white/30"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>

            {/* Bottom Audio Status Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white/90 text-[12.5px] font-semibold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <span className="flex items-center gap-1.5">
                <Volume2 size={15} />
                面談自己紹介動画 ({candidate.videoDuration || '0:45'})
              </span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-[#0071E3] text-white">
                シンハラ語/日本語
              </span>
            </div>
          </div>

          {/* Story Body & Quote */}
          <div className="p-6 flex flex-col gap-4 bg-white">
            <h3 className="text-[19px] font-extrabold text-[#0F172A] leading-snug">
              「{candidate.storyHeadline}」
            </h3>

            <p className="text-[14px] text-[#64748B] font-medium leading-relaxed">
              {candidate.shortStory}
            </p>

            {/* Key Verified Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-[#0F172A] font-bold text-[12.5px]">
                学習時間: {candidate.studyHours}時間
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-[#0F172A] font-bold text-[12.5px]">
                就業可能: 1か月以内
              </span>
              {candidate.academiaCompleted && (
                <span className="px-2.5 py-1 rounded-md bg-[#0071E3]/10 text-[#0071E3] font-bold text-[12.5px] flex items-center gap-1">
                  <ShieldCheck size={13} /> アカデミア修了
                </span>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => {
                  onClose();
                  onNavigateDetail(candidate.id);
                }}
              >
                詳細を見る <ArrowRight size={15} />
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={handleSendScout}
              >
                <Send size={15} />
                スカウトを送る
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
