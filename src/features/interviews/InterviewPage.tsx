import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/DemoContext';
import { Button } from '../../components/common/Button';
import { CandidateAvatar } from '../../components/common/CandidateAvatar';
import { ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function InterviewPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const role = state.currentRole;
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'detailed'>('standard');

  const thread = state.threads.find((t) => t.id === threadId);
  if (!thread) return <div className="p-16 text-center font-bold text-[#64748B]">スレッドが見つかりません</div>;

  const candidateObj = state.candidates.find((c) => c.id === thread.candidateId);

  const handleConfirmSlot = (slotId: string) => {
    dispatch({ type: 'CONFIRM_INTERVIEW_SLOT', threadId: thread.id, slotId });
    dispatch({ type: 'SET_THREAD_STATUS', threadId: thread.id, status: 'interview_scheduling' });
    dispatch({ type: 'SHOW_TOAST', toast: { message: '面接日時が確定しました', type: 'success' } });
  };

  const handleRequestInterpreter = () => {
    dispatch({ type: 'REQUEST_INTERPRETER', threadId: thread.id, plan: selectedPlan });
    dispatch({ type: 'SHOW_TOAST', toast: { message: '通訳同席をリクエストしました', type: 'success' } });
  };

  const handleAdvanceToOffer = () => {
    dispatch({ type: 'SET_THREAD_STATUS', threadId: thread.id, status: 'offer' });
    dispatch({
      type: 'SET_NEXT_ACTION',
      threadId: thread.id,
      nextAction: {
        label: '入社準備を開始',
        assignee: 'company',
        description: `${thread.candidateName}さんの内定手続きを進めてください`,
        ctaLabel: '入社準備へ',
        ctaRoute: `/${role}/offer-flow/${thread.id}`,
        estimatedTime: '10分',
      },
    });
    dispatch({ type: 'SHOW_TOAST', toast: { message: 'ステータスを「内定」に進めました', type: 'success' } });
    navigate(`/${role}/offer-flow/${thread.id}`);
  };

  const confirmedSlot = thread.interviewSlots.find((s) => s.confirmed);
  const bestSlot = thread.interviewSlots.find((s) => s.companyAvailable && s.candidateAvailable && (state.interpreterAvailability[s.id] ?? s.interpreterAvailable));

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
          <span className="text-[13px] font-bold text-[#0071E3] uppercase tracking-wider block">INTERVIEW SCHEDULING</span>
          <h1 className="text-[28px] md:text-[32px] font-extrabold text-[#0F172A] tracking-tight">
            面接調整 — {thread.candidateName} さん
          </h1>
          <p className="text-[15px] text-[#64748B] font-semibold mt-0.5">{thread.jobTitle}</p>
        </div>
      </div>

      {/* Confirmed Slot (Strict 4 Colors) */}
      {confirmedSlot && (
        <section className="apple-card p-7 bg-slate-50 border border-slate-200 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-bold">
              <Check size={18} strokeWidth={3} />
            </div>
            <h2 className="text-[20px] font-extrabold text-[#0F172A]">面接日時が確定しています</h2>
          </div>
          <p className="text-[20px] font-bold text-[#0F172A]">
            {confirmedSlot.dateJST} ({confirmedSlot.dayOfWeek}) {confirmedSlot.timeJST} JST / {confirmedSlot.timeIST} IST
          </p>
          {thread.interpreterRequest && (
            <p className="text-[14px] font-semibold text-[#64748B]">
              通訳同席：{thread.interpreterRequest.plan === 'standard' ? '通常面接 30分' : '条件確認面接 60分'}
              （{thread.interpreterRequest.status === 'confirmed' ? '確定済み' : '調整中'}）
            </p>
          )}
          <Button variant="primary" size="lg" className="w-fit mt-2" onClick={handleAdvanceToOffer}>
            面接完了 → 内定・入社手続きへ進む
          </Button>
        </section>
      )}

      {/* Best Candidate Slot Prompt */}
      {!confirmedSlot && bestSlot && (
        <section className="apple-card p-6 bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[13px] font-bold text-[#B45309] block mb-1">3人が空いている最適な推奨日時</span>
            <p className="text-[20px] font-extrabold text-[#0F172A]">
              {bestSlot.dateJST} ({bestSlot.dayOfWeek}) {bestSlot.timeJST} JST / {bestSlot.timeIST} IST
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => handleConfirmSlot(bestSlot.id)}>
            この時間に決定する
          </Button>
        </section>
      )}

      {/* All Slots Grid */}
      <section className="apple-card p-7 flex flex-col gap-5">
        <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">候補日時一覧</h2>
        <div className="flex flex-col gap-3">
          {thread.interviewSlots.map((slot) => {
            const interpreterOk = state.interpreterAvailability[slot.id] ?? slot.interpreterAvailable;
            const allOk = slot.companyAvailable && slot.candidateAvailable && interpreterOk;
            return (
              <div
                key={slot.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-xl border transition-colors ${
                  slot.confirmed ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <p className="text-[16px] font-bold text-[#0F172A]">
                    {slot.dateJST} ({slot.dayOfWeek})
                  </p>
                  <p className="text-[14px] text-[#64748B] font-semibold">
                    {role === 'candidate' ? `${slot.timeIST} IST / ${slot.timeJST} JST` : `${slot.timeJST} JST / ${slot.timeIST} IST`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <StatusBadge ok={slot.companyAvailable} label="企業" />
                    <StatusBadge ok={slot.candidateAvailable} label="候補者" />
                    <StatusBadge ok={interpreterOk} label="通訳" />
                  </div>
                  {!confirmedSlot && (
                    <Button
                      variant={allOk ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleConfirmSlot(slot.id)}
                    >
                      {slot.confirmed ? '確定済み' : '決定'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interpreter Request */}
      {!thread.interpreterRequest && (
        <section className="apple-card p-7 flex flex-col gap-5">
          <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">MiraiWay シンハラ語通訳同席をリクエスト</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { plan: 'standard' as const, label: '通常面接 30分', price: '¥8,000', desc: '会話の通訳と基本的な意思確認' },
              { plan: 'detailed' as const, label: '条件確認面接 60分', price: '¥15,000', desc: '給与・勤務条件・住居などの最終確認' },
            ].map(({ plan, label, price, desc }) => (
              <label
                key={plan}
                className={`p-5 rounded-xl border cursor-pointer transition-colors flex flex-col justify-between ${
                  selectedPlan === plan ? 'bg-slate-100 border-slate-300 ring-1 ring-[#0071E3]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[16px] font-bold text-[#0F172A]">{label}</span>
                  <span className="text-[16px] font-extrabold text-[#0071E3]">{price}</span>
                </div>
                <p className="text-[13.5px] text-[#64748B] font-medium">{desc}</p>
                <input
                  type="radio"
                  name="plan"
                  checked={selectedPlan === plan}
                  onChange={() => setSelectedPlan(plan)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
          <Button variant="primary" size="lg" className="w-fit mt-2" onClick={handleRequestInterpreter}>
            通訳同席をリクエストする
          </Button>
        </section>
      )}
    </motion.div>
  );
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`px-2.5 py-1 rounded text-[12px] font-bold ${
        ok ? 'bg-slate-100 text-[#0071E3] border border-slate-200' : 'bg-amber-500/10 text-[#B45309] border border-amber-500/30'
      }`}
    >
      {label}: {ok ? 'OK' : '調整中'}
    </span>
  );
}
