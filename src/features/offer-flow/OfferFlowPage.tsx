import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/DemoContext';
import { Button } from '../../components/common/Button';
import { CandidateAvatar } from '../../components/common/CandidateAvatar';
import { ArrowLeft, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function OfferFlowPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const thread = state.threads.find((t) => t.id === threadId);
  if (!thread) return <div className="p-16 text-center font-bold text-[#64748B]">データが見つかりません</div>;

  const candidateObj = state.candidates.find((c) => c.id === thread.candidateId);
  const completedCount = thread.offerSteps.filter((s) => s.status === 'completed').length;
  const totalCount = thread.offerSteps.length;
  const currentStep = thread.offerSteps.find((s) => s.status === 'current');

  const handleComplete = (stepId: string) => {
    dispatch({ type: 'COMPLETE_OFFER_STEP', threadId: thread.id, stepId });
    dispatch({ type: 'SHOW_TOAST', toast: { message: 'ステップが完了しました', type: 'success' } });
  };

  const allDone = thread.status === 'onboarded' || thread.offerSteps.every((s) => s.status === 'completed');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="max-w-[1000px] mx-auto px-6 lg:px-12 py-8 pb-16 flex flex-col gap-6"
    >
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[14px] font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer w-fit">
        <ArrowLeft size={16} /> 戻る
      </button>

      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
        <CandidateAvatar src={candidateObj?.photoUrl} name={thread.candidateName} candidateId={thread.candidateId} size="lg" />
        <div>
          <span className="text-[13px] font-bold text-[#0071E3] uppercase tracking-wider block">ONBOARDING & VISA JOURNEY</span>
          <h1 className="text-[28px] md:text-[32px] font-extrabold text-[#0F172A] tracking-tight">
            内定・在留資格申請手続き — {thread.candidateName} さん
          </h1>
          <p className="text-[15px] text-[#64748B] font-semibold mt-0.5">{thread.jobTitle}</p>
        </div>
      </div>

      {/* Progress Summary Box (Strict 4 Colors) */}
      <section className="apple-card p-7 flex flex-col gap-4">
        {allDone ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Check size={20} className="text-[#0071E3]" strokeWidth={3} />
              <h2 className="text-[22px] font-extrabold text-[#0F172A]">入社準備・申請手続きが完了しました！</h2>
            </div>
            <p className="text-[15px] text-[#64748B] font-semibold">
              ここからは MiraiWay 定着伴走サポートが始まります。次回の面談確認：1か月後
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <p className="text-[20px] font-extrabold text-[#0F172A]">
                入社手続き完了まで あと <strong className="text-[#0071E3]">{totalCount - completedCount}ステップ</strong>
              </p>
              <span className="text-[13px] font-bold text-[#0071E3] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {completedCount} / {totalCount} 完了
              </span>
            </div>

            {currentStep && (
              <p className="text-[14.5px] font-semibold text-[#64748B]">
                次に行うアクション：<strong className="text-[#0F172A]">{currentStep.companyTask || currentStep.candidateTask}</strong>
              </p>
            )}

            {/* Gauge bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden mt-4">
              <div
                className="h-full bg-[#0071E3] rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Journey Thread (Timeline) */}
      <section className="apple-card p-7 flex flex-col gap-6">
        <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">手続きタイムライン</h2>

        <div className="relative pl-8 space-y-6">
          <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-slate-200" />

          {thread.offerSteps.map((step) => {
            const isExpanded = expandedStep === step.id || step.status === 'current';
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';

            return (
              <div key={step.id} className="relative pl-4">
                {/* Status Dot */}
                <div
                  className={`absolute -left-[27px] top-1 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ring-4 ring-white shadow-sm ${
                    isCompleted
                      ? 'bg-[#0071E3] text-white'
                      : isCurrent
                      ? 'bg-[#B45309] text-white'
                      : 'bg-white border-2 border-slate-300 text-[#64748B]'
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : ''}
                </div>

                <div
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <h3
                      className={`text-[16px] font-bold ${
                        isCompleted ? 'text-[#64748B] line-through' : 'text-[#0F172A]'
                      }`}
                    >
                      {step.name}
                    </h3>
                    <span
                      className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-slate-100 text-[#64748B]'
                          : isCurrent
                          ? 'bg-amber-500/10 text-[#B45309] border border-amber-500/30'
                          : 'bg-slate-100 text-[#64748B]'
                      }`}
                    >
                      {isCompleted ? '完了' : isCurrent ? '進行中' : step.estimatedDays}
                    </span>
                  </div>

                  <button className="text-[#64748B]">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {/* Expanded Action Panel */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13.5px]">
                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <span className="font-bold text-[#64748B] block mb-1">企業のアクション</span>
                        <p className="font-semibold text-[#0F172A]">{step.companyTask}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <span className="font-bold text-[#64748B] block mb-1">候補者のアクション</span>
                        <p className="font-semibold text-[#0F172A]">{step.candidateTask}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <span className="font-bold text-[#0071E3] block mb-1">MiraiWay伴走サポート</span>
                        <p className="font-semibold text-[#0F172A]">{step.miraiwaySupport}</p>
                      </div>
                    </div>

                    {step.requiredDocs.length > 0 && (
                      <div>
                        <span className="text-[12.5px] font-bold text-[#64748B] block mb-1.5">必要準備書類</span>
                        <div className="flex flex-wrap gap-1.5">
                          {step.requiredDocs.map((d) => (
                            <span key={d} className="px-2.5 py-1 rounded bg-white text-[#0F172A] text-[12.5px] font-bold border border-slate-200 shadow-sm">
                              📄 {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {isCurrent && (
                      <Button variant="primary" size="md" className="w-fit" onClick={() => handleComplete(step.id)}>
                        このステップを完了にする
                      </Button>
                    )}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
