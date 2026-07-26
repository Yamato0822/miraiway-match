import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/DemoContext';
import { computeMatchCompass } from '../../lib/matchCompass';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { CandidateAvatar, FlagIcon } from '../../components/common/CandidateAvatar';
import { useState } from 'react';
import { ArrowLeft, Check, AlertTriangle, Clock, Award, Heart, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const [showScoutModal, setShowScoutModal] = useState(false);
  const [scoutMessage, setScoutMessage] = useState('プロフィールを拝見し、ぜひ一度お話ししたいと思いました。');
  const candidate = state.candidates.find((c) => c.id === id);
  if (!candidate) {
    return (
      <div className="max-w-[960px] mx-auto px-6 py-16 text-center">
        <p className="text-[16px] font-semibold text-[#64748B]">候補者が見つかりませんでした</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/company/candidates')}>
          一覧に戻る
        </Button>
      </div>
    );
  }

  const defaultJob = state.jobs[0];
  const matchSummary = defaultJob ? computeMatchCompass(candidate, defaultJob) : null;
  const isFavorite = state.favorites.candidateIds.includes(candidate.id);
  const existingThread = state.threads.find((t) => t.candidateId === candidate.id);

  const handleScout = () => {
    if (!defaultJob) return;
    dispatch({
      type: 'SCOUT_CANDIDATE',
      candidateId: candidate.id,
      jobId: defaultJob.id,
      message: scoutMessage,
    });
    setShowScoutModal(false);
    dispatch({
      type: 'SHOW_MODAL',
      modal: {
        type: 'matching_success',
        props: { candidateId: candidate.id },
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="max-w-[1000px] mx-auto px-6 lg:px-12 py-8 pb-16 flex flex-col gap-6"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[14px] font-bold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer w-fit"
      >
        <ArrowLeft size={16} /> 一覧に戻る
      </button>

      {/* Profile Hero Header */}
      <section className="apple-card overflow-hidden">
        <div className="relative h-[220px] md:h-[280px] bg-slate-100 flex items-center justify-center">
          <CandidateAvatar
            src={candidate.photoUrl}
            name={candidate.name}
            candidateId={candidate.id}
            size="lg"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl"
          />
          {candidate.videoDuration && (
            <span className="absolute bottom-4 left-4 text-[12.5px] font-bold px-3 py-1.5 rounded-lg bg-[#0F172A] text-white shadow">
              ▶ 動画 {candidate.videoDuration}
            </span>
          )}
          <span className="absolute top-4 left-4 text-[12.5px] font-bold px-3 py-1 rounded-full bg-white text-[#0071E3] border border-slate-200 shadow-sm flex items-center gap-1">
            <Check size={14} strokeWidth={3} /> MiraiWay事前検証済み
          </span>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0071E3] bg-slate-100 px-3 py-1 rounded-lg">
                <FlagIcon className="w-4 h-3" />
                スリランカ · {candidate.field} ({candidate.subField})
              </span>
              <span className="text-[13px] text-[#64748B] font-semibold">
                希望勤務地: {candidate.desiredLocations.join('・')}
              </span>
            </div>
            <h1 className="text-[26px] md:text-[32px] font-extrabold text-[#0F172A] leading-tight tracking-tight keep-words">
              {candidate.storyHeadline}
            </h1>
            <p className="text-[15px] text-[#64748B] font-semibold mt-1">
              {candidate.name}（{candidate.nameEn}）· {candidate.age}歳 · 日本語 {candidate.japaneseLevel} ({candidate.studyHours}h学習)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                dispatch({ type: 'TOGGLE_FAVORITE_CANDIDATE', candidateId: candidate.id });
                if (!isFavorite) {
                  dispatch({
                    type: 'SHOW_MODAL',
                    modal: {
                      type: 'favorite_action',
                      props: { candidateId: candidate.id },
                    },
                  });
                }
              }}
            >
              <Heart size={18} fill={isFavorite ? '#0F172A' : 'none'} className={isFavorite ? 'text-[#0F172A]' : 'text-[#64748B]'} />
              気になる
            </Button>
            {existingThread ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/company/messages/${existingThread.id}`)}
              >
                やり取りを見る
              </Button>
            ) : (
              <Button variant="primary" size="md" onClick={() => setShowScoutModal(true)}>
                <Send size={16} />
                スカウトを送信
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Match Compass */}
      {matchSummary && (
        <section className="apple-card p-6 md:p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">条件の適合（Match Compass）</h2>
            <span className="text-[13px] font-bold px-3 py-1 rounded-full bg-slate-100 text-[#0071E3] border border-slate-200">
              一致 {matchSummary.matched.length}件
            </span>
            {matchSummary.needsCheck.length > 0 && (
              <span className="text-[13px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-[#B45309] border border-amber-500/30">
                要確認 {matchSummary.needsCheck.length}件
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[...matchSummary.matched, ...matchSummary.needsCheck, ...matchSummary.notMatched].map((item) => (
              <div
                key={item.field}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-[#F8FAFC]"
              >
                {item.status === 'matched' ? (
                  <Check size={18} className="text-[#0071E3] shrink-0" strokeWidth={3} />
                ) : (
                  <AlertTriangle size={18} className="text-[#B45309] shrink-0" />
                )}
                <div>
                  <p className="text-[14px] font-bold text-[#0F172A]">{item.label}</p>
                  <p className="text-[13px] text-[#64748B] font-medium">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Aspiration & Self Intro */}
      <section className="apple-card p-6 md:p-8 flex flex-col gap-4">
        <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">本人が日本で実現したいこと</h2>
        <p className="text-[16px] text-[#0F172A] leading-relaxed font-semibold">{candidate.workAspiration}</p>
        <p className="text-[15px] text-[#64748B] leading-relaxed font-medium mt-2">{candidate.selfIntro}</p>
      </section>

      {/* Learning Timeline */}
      <section className="apple-card p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
            学習・準備の累積プロセス
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[14px] font-bold text-[#0071E3] bg-slate-100 px-3 py-1 rounded-lg">
              <Clock size={15} className="inline mr-1" />
              {candidate.studyHours}時間 学習
            </span>
          </div>
        </div>

        <div className="relative pl-6 border-l-2 border-slate-200 ml-2 space-y-6">
          {candidate.learningTimeline.map((entry, i) => (
            <div key={`${entry.month}-${i}`} className="relative pl-4">
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#0071E3] ring-4 ring-white" />
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-bold text-[#64748B]">{entry.month}</span>
                <span className="text-[13px] font-bold text-[#0071E3]">{entry.hours}h学習</span>
              </div>
              <p className="text-[15px] font-bold text-[#0F172A] mt-0.5">{entry.topic}</p>
              {entry.milestone && (
                <span className="inline-flex items-center gap-1 text-[12px] font-bold mt-1 px-2.5 py-0.5 rounded bg-slate-100 text-[#0F172A]">
                  <Award size={13} /> {entry.milestone}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* MiraiWay Note */}
      <section className="apple-card p-6 md:p-8 bg-slate-50 border border-slate-200">
        <h2 className="text-[18px] font-bold text-[#0071E3] mb-2">MiraiWay 面接担当者からの補足</h2>
        <p className="text-[15px] text-[#0F172A] leading-relaxed font-medium">{candidate.miraiwayNote}</p>
      </section>

      {/* Scout Modal */}
      <Modal
        open={showScoutModal}
        onClose={() => setShowScoutModal(false)}
        title="スカウトを送る"
      >
        <div>
          <p className="text-[15px] text-[#0F172A] mb-1 font-bold">
            {candidate.name}さんにスカウトを送ります
          </p>
          <p className="text-[13px] text-[#64748B] mb-4">
            送信すると、やり取り画面が作成され、候補者に通知されます。
          </p>
          <label className="text-[13px] font-bold text-[#64748B] block mb-1.5">
            最初のメッセージ
          </label>
          <textarea
            value={scoutMessage}
            onChange={(e) => setScoutMessage(e.target.value)}
            className="w-full h-32 px-3.5 py-2.5 text-[14px] font-semibold rounded-xl border border-slate-200 resize-none shadow-sm focus:outline-none focus:border-[#0071E3]"
          />
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" onClick={() => setShowScoutModal(false)}>
              戻る
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleScout}>
              スカウトを送る
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
