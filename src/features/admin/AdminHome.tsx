import { useDemo } from '../../state/DemoContext';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, Users, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { motion } from 'framer-motion';

export function AdminHome() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();

  // Stalled cases
  const stalledThreads = state.threads.filter((t) => {
    const days = Math.floor((Date.now() - new Date(t.lastActivityAt).getTime()) / 86400000);
    return days >= 3 && t.status !== 'onboarded';
  });

  const interpreterWaiting = state.threads.filter((t) => t.interpreterRequest?.status === 'pending');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="max-w-[1000px] mx-auto px-6 lg:px-12 py-8 pb-16 flex flex-col gap-8"
    >
      <div className="pb-4 border-b border-slate-200">
        <span className="text-[13px] font-bold text-[#0071E3] uppercase tracking-wider block">OPERATIONS DASHBOARD</span>
        <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#0F172A] tracking-tight">
          運営事務局 ホーム
        </h1>
        <p className="text-[16px] text-[#64748B] font-semibold mt-1">
          停滞案件のフォロー・通訳の面接同席調整・候補者公開の統括ワークスペース
        </p>
      </div>

      {/* Priority: Stalled cases */}
      <section className="apple-card p-7 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-[#B45309]" />
          <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">
            3日以上停滞している案件（{stalledThreads.length}件）
          </h2>
        </div>

        {stalledThreads.length === 0 ? (
          <p className="text-[14.5px] font-semibold text-[#64748B] py-2">現在停滞している案件はありません</p>
        ) : (
          <div className="flex flex-col gap-3">
            {stalledThreads.map((t) => {
              const days = Math.floor((Date.now() - new Date(t.lastActivityAt).getTime()) / 86400000);
              const reason = t.nextAction.assignee === 'company'
                ? '企業の対応待ち'
                : t.nextAction.assignee === 'candidate'
                  ? '候補者の返信待ち'
                  : '運営の対応待ち';
              return (
                <div
                  key={t.id}
                  className="p-4.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[16px] font-bold text-[#0F172A]">
                        {t.candidateName} × {t.companyName}
                      </h3>
                      <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-amber-500/10 text-[#B45309] border border-amber-500/30">
                        {days}日停滞
                      </span>
                    </div>
                    <p className="text-[13.5px] font-medium text-[#64748B] mt-1">
                      {t.jobTitle} · <strong className="text-[#0F172A]">要要因: {reason}</strong>
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/threads`)}>
                    詳細を確認
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Interpreter waiting */}
      <section className="apple-card p-7 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-[#0071E3]" />
          <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">
            通訳面接同席のリクエスト調整待ち（{interpreterWaiting.length}件）
          </h2>
        </div>

        {interpreterWaiting.length === 0 ? (
          <p className="text-[14.5px] font-semibold text-[#64748B] py-2">調整待ちの通訳リクエストはありません</p>
        ) : (
          interpreterWaiting.map((t) => (
            <div key={t.id} className="p-4.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4">
              <div>
                <p className="text-[16px] font-bold text-[#0F172A]">
                  {t.candidateName} × {t.companyName}
                </p>
                <p className="text-[13.5px] text-[#64748B] font-semibold">
                  {t.interpreterRequest?.plan === 'standard' ? '通常面接 30分通訳' : '条件確認面接 60分通訳'}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/admin/interpreter')}>
                通訳枠を確認
              </Button>
            </div>
          ))
        )}
      </section>

      {/* Candidate publishing */}
      <section className="apple-card p-7 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-[#0071E3]" />
          <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">スリランカ候補者の公開状態</h2>
        </div>

        <div className="flex flex-col gap-2">
          {state.candidates.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0071E3] text-white flex items-center justify-center font-extrabold text-[14px]">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#0F172A]">{c.name}</p>
                  <p className="text-[13px] text-[#64748B] font-semibold">{c.field}</p>
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CANDIDATE_PUBLISHED', candidateId: c.id })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold cursor-pointer transition-colors ${
                  c.published ? 'bg-slate-100 text-[#0071E3] border border-slate-200' : 'bg-white text-[#64748B] border border-slate-200'
                }`}
                aria-pressed={c.published}
              >
                {c.published ? <><Eye size={14} /> 公開中</> : <><EyeOff size={14} /> 非公開</>}
              </button>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
