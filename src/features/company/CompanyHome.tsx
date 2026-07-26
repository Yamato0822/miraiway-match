import { useState } from 'react';
import { useDemo } from '../../state/DemoContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, MessageSquare, Building2, Clock, Check } from 'lucide-react';
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="max-w-[1120px] mx-auto px-6 lg:px-12 py-10 flex flex-col gap-10"
    >
      {/* Editorial Hero Greeting (Strict 4 Colors: #FFFFFF, #0F172A, #64748B, #0071E3) */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#0F172A] text-[12.5px] font-bold mb-3 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#0071E3]" />
            採用管理ワークスペース
          </div>
          <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#0F172A] leading-tight tracking-tight keep-words">
            こんにちは、{state.companyProfile.name} さん
          </h1>
          <p className="text-[16px] text-[#64748B] mt-2 leading-relaxed">
            スリランカの高度人材とともに進む選考。現在 <strong className="text-[#0F172A] font-bold">{activeThreads.length}件</strong> が進行中です。
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

      {/* Metrics Row — Strictly 4 Colors */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '進行中の選考', value: activeThreads.length, sub: '全対象', accent: 'bg-[#0071E3]' },
          { label: '面接調整中', value: activeThreads.filter((t) => t.status === 'interview_scheduling').length, sub: '日程確定待ち', accent: 'bg-[#0071E3]' },
          { label: '要自社対応', value: activeThreads.filter((t) => t.nextAction.assignee === 'company').length, sub: '要アクション', accent: 'bg-[#B45309]' },
          { label: '内定・入社準備', value: activeThreads.filter((t) => t.status === 'offer' || t.status === 'onboarding').length, sub: '手続き中', accent: 'bg-[#0071E3]' },
        ].map((m, idx) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, type: 'spring', damping: 25, stiffness: 350 }}
            whileHover={{ y: -3 }}
            className="apple-card relative overflow-hidden p-6 flex flex-col justify-between"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${m.accent}`} />
            <span className="text-[14px] font-bold text-[#64748B]">{m.label}</span>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-[36px] font-extrabold text-[#0F172A] leading-none tracking-tight">{m.value}</span>
              <span className="text-[13px] text-[#64748B] font-semibold">{m.sub}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Priority Action — Strict 4 Colors */}
      {priorityThread && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', damping: 25, stiffness: 350 }}
          className="apple-card p-6 md:p-8 bg-gradient-to-r from-amber-500/10 via-white to-white border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#B45309]/10 text-[#B45309] flex items-center justify-center shrink-0 font-bold">
              <Clock size={22} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[12.5px] font-bold text-[#B45309] bg-amber-100 px-2.5 py-0.5 rounded-md">
                  要アクション
                </span>
                {priorityThread.nextAction.estimatedTime && (
                  <span className="text-[13px] text-[#64748B]">
                    所要時間 約{priorityThread.nextAction.estimatedTime}
                  </span>
                )}
              </div>
              <h2 className="text-[22px] font-bold text-[#0F172A] leading-snug">
                {priorityThread.nextAction.description}
              </h2>
              <p className="text-[15px] text-[#64748B] mt-1">
                対象: <strong className="text-[#0F172A] font-semibold">{priorityThread.candidateName}</strong>（{priorityThread.jobTitle}）
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(priorityThread.nextAction.ctaRoute)}
            className="shrink-0 w-full md:w-auto"
          >
            {priorityThread.nextAction.ctaLabel}
            <ArrowRight size={18} />
          </Button>
        </motion.section>
      )}

      {/* Active Pipeline */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-[#0F172A] tracking-tight">進行中の選考一覧</h2>
            <p className="text-[14px] text-[#64748B] mt-0.5">次に行うアクションが明確なリスト</p>
          </div>
          <button
            onClick={() => navigate('/company/messages')}
            className="text-[15px] font-bold text-[#0071E3] hover:underline flex items-center gap-1 cursor-pointer"
          >
            一覧を表示 <ArrowRight size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
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

      {/* Feature Cards Grid (Apple Grid) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-[22px] font-bold text-[#0F172A] tracking-tight">ワークスペース機能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + idx * 0.06, type: 'spring', damping: 25, stiffness: 350 }}
                whileHover={{ y: -3 }}
                onClick={() => navigate(item.route)}
                className="apple-card p-7 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#0F172A] flex items-center justify-center mb-6">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-[19px] font-bold text-[#0F172A]">{item.title}</h3>
                  <p className="text-[15px] text-[#64748B] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-1.5 text-[15px] font-bold text-[#0071E3] group-hover:translate-x-1 transition-transform">
                  {item.cta} <ArrowRight size={16} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* MiraiWay Support Footer */}
      <section className="apple-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-[18px] font-bold text-[#0F172A]">
            MiraiWay 専門伴走サポート
          </h3>
          <p className="text-[15px] text-[#64748B] mt-1">
            面接通訳、在留資格申請手続き、現地対応、入社後の定着フォローまで専門チームが対応します。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['面接通訳', '在留資格申請', '現地対応', '定着フォロー'].map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-[#0F172A] text-[13px] font-bold">
              <Check size={15} className="text-[#0071E3]" />
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
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHovered ? 1.035 : 1,
        borderColor: isHovered ? 'rgba(0, 113, 227, 0.5)' : 'rgba(15, 23, 42, 0.06)',
      }}
      transition={{
        delay: 0.2 + idx * 0.04,
        type: 'spring',
        damping: 30,
        stiffness: 160,
        mass: 1.1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onNavigate}
      className={`apple-card p-6 md:p-7 cursor-pointer flex flex-col gap-4 relative overflow-hidden transition-shadow duration-500 ${
        isHovered
          ? 'shadow-[0_20px_45px_-12px_rgba(0,113,227,0.15),0_12px_24px_-6px_rgba(15,23,42,0.12)] z-30 bg-white ring-1 ring-[#0071E3]/20'
          : 'z-1'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CandidateAvatar
            src={candidateObj?.photoUrl}
            name={thread.candidateName}
            candidateId={thread.candidateId}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-bold text-[#0F172A]">
                {thread.candidateName}
              </h3>
              <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-[#0F172A] inline-flex items-center gap-1">
                <FlagIcon className="w-3.5 h-2.5" />
                {statusLabel}
              </span>
            </div>
            <p className="text-[14px] text-[#64748B] mt-0.5 font-medium">
              {thread.jobTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-left md:text-right">
            <span className="text-[13px] text-[#64748B] block">次にやること</span>
            <span className="text-[15px] font-bold text-[#0F172A]">{thread.nextAction.label}</span>
            {daysSince > 2 && (
              <span className="text-[13px] font-bold text-[#B45309] block mt-0.5">{daysSince}日間 未更新</span>
            )}
          </div>
          <ArrowRight size={18} className="text-[#64748B]" />
        </div>
      </div>

      {/* Expanded Hover Details Drawer */}
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
              mass: 1.2,
            }}
            className="overflow-hidden flex flex-col gap-3.5 pt-5 border-t border-slate-200 bg-slate-50/60 -mx-7 px-7 pb-4 -mb-3 rounded-b-2xl"
          >
            {candidateObj && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex flex-wrap items-center gap-4 text-[13.5px] text-[#64748B] font-medium bg-white p-3 rounded-xl border border-slate-200 shadow-sm"
              >
                <span>希望勤務地: <strong className="text-[#0F172A]">{candidateObj.desiredLocations.join('・')}</strong></span>
                <span>日本語: <strong className="text-[#0071E3] font-bold">{candidateObj.japaneseLevel}</strong> ({candidateObj.studyHours}h学習)</span>
                <span>就業可能: <strong className="text-[#0F172A]">{candidateObj.startTiming}</strong></span>
              </motion.div>
            )}

            {lastMsg && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.4 }}
                className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm"
              >
                <span className="text-[12.5px] font-bold text-[#0071E3] block mb-1">最新メッセージやり取り</span>
                <p className="text-[14px] text-[#0F172A] truncate">
                  <strong className="text-[#64748B]">{lastMsg.senderName}: </strong>
                  {lastMsg.content}
                </p>
              </motion.div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[13px] font-bold text-[#0071E3]">
                マウスホバーで選考の詳細を展開中
              </span>

              <Button
                variant="primary"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate();
                }}
              >
                {thread.nextAction.ctaLabel} へ進む
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
