import { useDemo } from '../../state/DemoContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, FileText, User } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { motion } from 'framer-motion';

export function CandidateHome() {
  const { state } = useDemo();
  const navigate = useNavigate();

  const myThreads = state.threads.filter((t) => t.status !== 'onboarded');
  const priorityThread = myThreads.find((t) => t.nextAction.assignee === 'candidate');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="max-w-[1000px] mx-auto px-6 lg:px-12 py-8 pb-16 flex flex-col gap-8"
    >
      {/* Header Status */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-[13px] font-bold text-[#0071E3] uppercase tracking-wider block">CANDIDATE DASHBOARD</span>
        <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#0F172A] tracking-tight">
          就職活動の状況
        </h1>
        <p className="text-[16px] text-[#64748B] font-semibold mt-1">
          {myThreads.length > 0
            ? `${myThreads.length}件の企業と面接・条件確認を進めています`
            : '安心して日本で働ける仕事を探しましょう'}
        </p>
      </div>

      {/* Next Action Callout */}
      {priorityThread && (
        <div className="apple-card p-7 border-l-4 border-l-[#B45309] bg-amber-500/5">
          <span className="text-[13px] font-extrabold text-[#B45309] block mb-1">次にやること</span>
          <h2 className="text-[20px] font-extrabold text-[#0F172A] mb-3">
            {priorityThread.nextAction.description}
          </h2>
          <Button variant="primary" size="md" onClick={() => navigate(priorityThread.nextAction.ctaRoute.replace('/company/', '/candidate/'))}>
            {priorityThread.nextAction.ctaLabel}
            <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {/* Active Threads */}
      {myThreads.length > 0 && (
        <section className="apple-card p-7 flex flex-col gap-5">
          <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">やり取り進行中の企業</h2>
          <div className="flex flex-col gap-3">
            {myThreads.map((t) => {
              const statusLabels: Record<string, string> = {
                contact_created: '話し始めた',
                waiting_reply: '返事を待っている',
                interview_scheduling: '面接の日を決めている',
                offer: '内定が提示された',
                onboarding: '入社の準備をしている',
              };
              return (
                <button
                  key={t.id}
                  onClick={() => navigate(`/candidate/messages/${t.id}`)}
                  className="flex items-center justify-between p-4.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-left transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-bold text-[#0F172A] truncate">{t.companyName}</p>
                    <p className="text-[13.5px] text-[#64748B] font-semibold mt-0.5">{t.jobTitle}</p>
                    <span className="inline-block text-[12px] font-bold px-2 py-0.5 rounded bg-slate-200 text-[#0F172A] mt-2">
                      ステータス: {statusLabels[t.status]}
                    </span>
                  </div>
                  <ArrowRight size={18} className="text-[#0071E3] shrink-0" />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick Menu */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/candidate/jobs')}
          className="apple-card p-5 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0071E3] flex items-center justify-center font-bold shrink-0">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-[#0F172A]">仕事を探す</p>
            <p className="text-[12.5px] text-[#64748B] font-semibold">求人一覧を見る</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/candidate/messages')}
          className="apple-card p-5 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0071E3] flex items-center justify-center font-bold shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-[#0F172A]">やり取り</p>
            <p className="text-[12.5px] text-[#64748B] font-semibold">メッセージ一覧</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/candidate/profile')}
          className="apple-card p-5 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0071E3] flex items-center justify-center font-bold shrink-0">
            <User size={20} />
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-[#0F172A]">プロフィール</p>
            <p className="text-[12.5px] text-[#64748B] font-semibold">情報を確認・編集</p>
          </div>
        </button>
      </section>

      {/* Entry Flow Step Journey */}
      <section className="apple-card p-7 flex flex-col gap-4">
        <h2 className="text-[18px] font-extrabold text-[#0F172A]">入社までのロードマップ</h2>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2 pt-1">
          {['仕事を探す', '応募する', '会社と話す', '面接を受ける', '採用確定', 'ビザ準備', '日本へ渡航'].map((step, i) => (
            <div key={step} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center gap-1">
              <span className="w-6 h-6 rounded-full bg-[#0071E3] text-white flex items-center justify-center text-[11px] font-extrabold">
                {i + 1}
              </span>
              <p className="text-[12px] font-bold text-[#0F172A]">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
