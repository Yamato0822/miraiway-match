import { useState } from 'react';
import { useDemo } from '../../state/DemoContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, MessageSquare, Building2, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/common/Button';
import { CandidateAvatar, FlagIcon } from '../../components/common/CandidateAvatar';

export function CompanyHome() {
  const { state } = useDemo();
  const navigate = useNavigate();

  const activeThreads = state.threads.filter((t) => t.status !== 'onboarded');
  const priorityThread = activeThreads.find((t) => t.nextAction.assignee === 'company');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="max-w-[1140px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-24 flex flex-col gap-8"
    >
      {/* Wantedly-style Flat Header Greeting */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-100 text-[#111827] text-[12px] font-bold mb-2 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#0071E3]" />
            採用管理ワークスペース
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-extrabold text-[#111827] leading-tight tracking-tight">
            こんにちは、{state.companyProfile.name} さん
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#6B7280] font-semibold mt-1.5 leading-relaxed">
            スリランカの高度人材とともに進む選考。現在 <strong className="text-[#111827] font-extrabold">{activeThreads.length}件</strong> が進行中です。
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/company/candidates')}
          className="shrink-0"
        >
          <Users size={18} />
          候補者を探す
        </Button>
      </section>

      {/* Metrics Row — Wantedly Flat Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '進行中の選考', value: activeThreads.length, sub: '全対象', color: 'text-[#111827]' },
          { label: '面接調整中', value: activeThreads.filter((t) => t.status === 'interview_scheduling').length, sub: '日程確定待ち', color: 'text-[#111827]' },
          { label: '要自社対応', value: activeThreads.filter((t) => t.nextAction.assignee === 'company').length, sub: '要アクション', color: 'text-[#B45309]' },
          { label: '内定・入社準備', value: activeThreads.filter((t) => t.status === 'offer' || t.status === 'onboarding').length, sub: '手続き中', color: 'text-[#0071E3]' },
        ].map((m, idx) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, type: 'spring', damping: 25, stiffness: 350 }}
            className="wantedly-card p-5 flex flex-col justify-between"
          >
            <span className="text-[13.5px] font-bold text-[#6B7280]">{m.label}</span>
            <div className="flex items-baseline justify-between mt-4">
              <span className={`text-[32px] sm:text-[36px] font-extrabold ${m.color} leading-none tracking-tight`}>{m.value}</span>
              <span className="text-[12.5px] text-[#6B7280] font-bold">{m.sub}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Priority Action — Wantedly Flat Highlight Banner */}
      {priorityThread && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', damping: 25, stiffness: 350 }}
          className="p-6 sm:p-7 rounded-2xl bg-amber-500/5 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#B45309]/10 text-[#B45309] flex items-center justify-center shrink-0 font-bold border border-[#B45309]/20">
              <Clock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-[12px] font-extrabold text-[#B45309] bg-amber-500/15 px-2.5 py-0.5 rounded-md">
                  要アクション
                </span>
                {priorityThread.nextAction.estimatedTime && (
                  <span className="text-[12.5px] text-[#6B7280] font-semibold">
                    所要時間 約{priorityThread.nextAction.estimatedTime}
                  </span>
                )}
              </div>
              <h2 className="text-[20px] sm:text-[22px] font-extrabold text-[#111827] leading-snug tracking-tight">
                {priorityThread.nextAction.description}
              </h2>
              <p className="text-[14px] text-[#6B7280] font-semibold mt-1">
                対象: <strong className="text-[#111827] font-bold">{priorityThread.candidateName}</strong>（{priorityThread.jobTitle}）
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(priorityThread.nextAction.ctaRoute)}
            className="shrink-0 w-full md:w-auto shadow-sm"
          >
            {priorityThread.nextAction.ctaLabel}
            <ArrowRight size={17} />
          </Button>
        </motion.section>
      )}

      {/* Active Pipeline Stream */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-1">
          <div>
            <h2 className="text-[20px] font-extrabold text-[#111827] tracking-tight">進行中の選考一覧</h2>
            <p className="text-[13.5px] text-[#6B7280] font-semibold mt-0.5">次に行うアクションが明確なリスト</p>
          </div>
          <button
            onClick={() => navigate('/company/messages')}
            className="text-[14px] font-bold text-[#0071E3] hover:underline flex items-center gap-1 cursor-pointer"
          >
            一覧を表示 <ArrowRight size={15} />
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          {activeThreads.map((thread, idx) => {
            const statusLabels: Record<string, string> = {
              contact_created: '接点作成',
              waiting_reply: '返信待ち',
              interview_scheduling: '面接調整中',
              offer: '内定確定',
              onboarding: '入社準備中',
            };
            const daysSince = Math.floor((Date.now() - new Date(thread.lastActivityAt).getTime()) / 86400000);
            const candidateObj = state.candidates.find((c) => c.id === thread.candidateId);
            const lastMsg = thread.messages[thread.messages.length - 1];

            return (
              <PipelineCardRow
                key={thread.id}
                thread={thread}
                candidateObj={candidateObj}
                lastMsg={lastMsg}
                statusLabel={statusLabels[thread.status] || thread.status}
                daysSince={daysSince}
                idx={idx}
                onNavigate={() => navigate(`/company/messages/${thread.id}`)}
              />
            );
          })}
        </div>
      </section>

      {/* Feature Cards Grid (Wantedly Flat Feature Cards) */}
      <section className="flex flex-col gap-4 pt-2">
        <h2 className="text-[20px] font-extrabold text-[#111827] tracking-tight">ワークスペース機能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: '候補者を探す',
              desc: '本人の意思・学びの累積・希望条件から発見する人材フィード。',
              cta: 'フィードを開く',
              icon: Users,
              route: '/company/candidates',
            },
            {
              title: 'やり取り・面接',
              desc: '対話、面接候補日決定、通訳同席リクエストの進行。',
              cta: 'やり取り一覧',
              icon: MessageSquare,
              route: '/company/messages',
            },
            {
              title: '自社ページ編集',
              desc: '給与・手取り・控除・寮など、求職者が求める現実情報の編集。',
              cta: '編集画面を開く',
              icon: Building2,
              route: '/company/page',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.05, type: 'spring', damping: 25, stiffness: 350 }}
                onClick={() => navigate(item.route)}
                className="wantedly-card p-6 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#0071E3] flex items-center justify-center mb-5 font-bold border border-slate-200">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-[18px] font-extrabold text-[#111827] group-hover:text-[#0071E3] transition-colors">{item.title}</h3>
                  <p className="text-[14px] text-[#6B7280] font-semibold mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-[14px] font-extrabold text-[#0071E3] group-hover:translate-x-1 transition-transform">
                  {item.cta} <ArrowRight size={15} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* MiraiWay Support Footer */}
      <section className="wantedly-card p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-50/60">
        <div>
          <h3 className="text-[17px] font-extrabold text-[#111827]">
            MiraiWay 専門伴走サポート
          </h3>
          <p className="text-[14px] text-[#6B7280] font-semibold mt-1 leading-relaxed">
            面接通訳、在留資格申請手続き、現地対応、入社後の定着フォローまで専門チームが対応します。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['面接通訳', '在留資格申請', '現地対応', '定着フォロー'].map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[#111827] text-[13px] font-extrabold shadow-2xs">
              <ShieldCheck size={14} className="text-[#0071E3]" />
              {s}
            </span>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

/* ===== PipelineCardRow Component ===== */
function PipelineCardRow({
  thread,
  candidateObj,
  lastMsg,
  statusLabel,
  daysSince,
  idx,
  onNavigate,
}: {
  thread: any;
  candidateObj: any;
  lastMsg: any;
  statusLabel: string;
  daysSince: number;
  idx: number;
  onNavigate: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.15 + idx * 0.04,
        type: 'spring',
        damping: 30,
        stiffness: 160,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onNavigate}
      className="wantedly-card p-5 sm:p-6 cursor-pointer flex flex-col gap-3.5 group relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <CandidateAvatar
            src={candidateObj?.photoUrl}
            name={thread.candidateName}
            candidateId={thread.candidateId}
            size="md"
            className="w-11 h-11 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[17px] font-extrabold text-[#111827] group-hover:text-[#0071E3] transition-colors">
                {thread.candidateName}
              </h3>
              <span className="text-[11.5px] font-extrabold px-2.5 py-0.5 rounded-md tag-green inline-flex items-center gap-1">
                <FlagIcon className="w-3.5 h-2.5" />
                {statusLabel}
              </span>
            </div>
            <p className="text-[13.5px] text-[#6B7280] font-semibold mt-0.5">
              {thread.jobTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <span className="text-[12px] text-[#6B7280] font-bold block">次にやること</span>
            <span className="text-[14.5px] font-extrabold text-[#111827]">{thread.nextAction.label}</span>
            {daysSince > 2 && (
              <span className="text-[12px] font-extrabold text-[#B45309] block mt-0.5">{daysSince}日間 未更新</span>
            )}
          </div>
          <ArrowRight size={17} className="text-[#0071E3] shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Expanded Details Drawer on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              type: 'spring',
              damping: 32,
              stiffness: 150,
            }}
            className="overflow-hidden flex flex-col gap-3 pt-4 border-t border-slate-200 bg-slate-50/70 -mx-6 px-6 pb-2 -mb-2 rounded-b-xl"
          >
            {candidateObj && (
              <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#4B5563] font-semibold bg-white p-3 rounded-lg border border-slate-200">
                <span>希望勤務地: <strong className="text-[#111827]">{candidateObj.desiredLocations.join('・')}</strong></span>
                <span>日本語: <strong className="text-[#0071E3] font-bold">{candidateObj.japaneseLevel}</strong> ({candidateObj.studyHours}h学習)</span>
                <span>就業可能: <strong className="text-[#111827]">{candidateObj.startTiming}</strong></span>
              </div>
            )}

            {lastMsg && (
              <div className="p-3 rounded-lg bg-white border border-slate-200">
                <span className="text-[12px] font-bold text-[#0071E3] block mb-0.5">最新メッセージ</span>
                <p className="text-[13.5px] text-[#111827] font-medium truncate">
                  <strong className="text-[#6B7280]">{lastMsg.senderName}: </strong>
                  {lastMsg.content}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
