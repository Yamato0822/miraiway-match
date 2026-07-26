import { useState, useMemo } from 'react';
import { useDemo } from '../../state/DemoContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, ArrowRight, Clock, Award, Languages, Calendar, Briefcase, MapPin, Check, ShieldCheck, FileText, ChevronDown, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { computeMatchCompass } from '../../lib/matchCompass';
import { Button } from '../../components/common/Button';
import { FlagIcon, CandidateAvatar } from '../../components/common/CandidateAvatar';
import type { Candidate, DiscoveryTab, SortOption } from '../../types';

const iconMap: Record<string, React.ElementType> = {
  Languages, Clock, Award, Calendar, Briefcase, MapPin,
};

import { StoryVideoModal } from '../../components/demo/StoryVideoModal';

export function CandidateDiscovery() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('recommended');
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedJapanese, setSelectedJapanese] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeStoryCandidate, setActiveStoryCandidate] = useState<Candidate | null>(null);

  const defaultJob = state.jobs[0];

  const filtered = useMemo(() => {
    let list = state.candidates.filter((c) => c.published);

    if (activeTab === 'favorites') {
      list = list.filter((c) => state.favorites.candidateIds.includes(c.id));
    }
    if (activeTab === 'newest') {
      list = list.filter((c) => c.isNew);
    }
    if (activeTab === 'academia') {
      list = list.filter((c) => c.academiaCompleted);
    }

    if (selectedField !== 'all') {
      list = list.filter((c) => c.field === selectedField);
    }
    if (selectedLocation !== 'all') {
      list = list.filter((c) => c.desiredLocations.includes(selectedLocation));
    }
    if (selectedJapanese !== 'all') {
      list = list.filter((c) => c.japaneseLevel === selectedJapanese);
    }
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(kw) ||
          c.storyHeadline.toLowerCase().includes(kw) ||
          c.field.toLowerCase().includes(kw)
      );
    }

    if (sortBy === 'match' && defaultJob) {
      list = [...list].sort((a, b) => {
        const ma = computeMatchCompass(a, defaultJob).matched.length;
        const mb = computeMatchCompass(b, defaultJob).matched.length;
        return mb - ma;
      });
    } else if (sortBy === 'study') {
      list = [...list].sort((a, b) => b.studyHours - a.studyHours);
    }

    return list;
  }, [state.candidates, state.favorites.candidateIds, activeTab, sortBy, selectedField, selectedLocation, selectedJapanese, searchKeyword, defaultJob]);

  const featuredCandidates = state.candidates
    .filter((c) => c.published && c.recommendationReasons.length >= 2)
    .slice(0, 6);

  const toggleFavorite = (id: string) => {
    const isFav = state.favorites.candidateIds.includes(id);
    dispatch({ type: 'TOGGLE_FAVORITE_CANDIDATE', candidateId: id });
    if (!isFav) {
      dispatch({
        type: 'SHOW_TOAST',
        toast: { message: '「気になる」に保存しました', type: 'info' },
      });
      dispatch({
        type: 'SHOW_MODAL',
        modal: {
          type: 'favorite_action',
          props: { candidateId: id },
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="max-w-[1120px] mx-auto px-6 lg:px-12 py-8 flex flex-col gap-8 pb-20"
    >
      {/* Refinement Idea 1: Hero Story Rings (丸型ストーリーアバターレール) */}
      <section className="flex flex-col gap-3 pb-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-[#0071E3] uppercase tracking-wider block">FEATURED STORIES</span>
          <span className="text-[13px] font-semibold text-[#64748B]">自己紹介動画つき注目の候補者</span>
        </div>

        <div className="flex items-center gap-5 overflow-x-auto hide-scrollbar pt-1 pb-2">
          {featuredCandidates.map((c) => (
            <motion.button
              key={c.id}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveStoryCandidate(c)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group text-center"
            >
              {/* Gradient Aura Ring around avatar */}
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#0071E3] via-[#B45309] to-[#0071E3] shadow-sm">
                <div className="p-0.5 bg-white rounded-full">
                  <CandidateAvatar src={c.photoUrl} name={c.name} candidateId={c.id} size="md" className="w-14 h-14 rounded-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#0071E3] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                  ▶
                </div>
              </div>
              <span className="text-[13px] font-extrabold text-[#0F172A] max-w-[76px] truncate leading-tight group-hover:text-[#0071E3] transition-colors">
                {c.name}
              </span>
              <span className="text-[11px] font-semibold text-[#64748B]">
                {c.field}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#0F172A] tracking-tight leading-snug">
            一緒に働く人を探す
          </h1>
          <p className="text-[15.5px] text-[#64748B] font-semibold mt-1">
            意思・日本語学習プロセス・適合条件から選択（カードホバーで詳細展開）
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[14px] font-semibold text-[#64748B]">
            該当 <strong className="text-[#0F172A] font-extrabold">{filtered.length}</strong> 名
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-[14px] font-bold px-3.5 py-2 rounded-xl bg-white text-[#0F172A] border border-slate-200 cursor-pointer shadow-2xs focus:outline-none"
            aria-label="並び替え"
          >
            <option value="match">条件一致順</option>
            <option value="newest">新着順</option>
            <option value="study">日本語学習時間順</option>
          </select>
        </div>
      </div>

      {/* Refinement Idea 2: Floating Top Filter Bar (フローティング・フィルターピル) */}
      <div className="apple-card p-3.5 flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="キーワード・職種・名前で検索..."
              className="w-full pl-9 pr-3 py-2 text-[14px] font-semibold rounded-xl bg-slate-50 text-[#0F172A] border border-slate-200/80 focus:outline-none focus:bg-white focus:border-[#0071E3] transition-colors"
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="text-[13.5px] font-bold px-3 py-2 rounded-xl bg-slate-50 text-[#0F172A] border border-slate-200 cursor-pointer focus:outline-none"
          >
            <option value="all">分野: すべて</option>
            <option value="建設">建設</option>
            <option value="介護">介護</option>
            <option value="製造">製造</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="text-[13.5px] font-bold px-3 py-2 rounded-xl bg-slate-50 text-[#0F172A] border border-slate-200 cursor-pointer focus:outline-none"
          >
            <option value="all">勤務地: すべて</option>
            <option value="東京">東京</option>
            <option value="神奈川">神奈川</option>
            <option value="埼玉">埼玉</option>
            <option value="千葉">千葉</option>
            <option value="大阪">大阪</option>
          </select>

          <select
            value={selectedJapanese}
            onChange={(e) => setSelectedJapanese(e.target.value)}
            className="text-[13.5px] font-bold px-3 py-2 rounded-xl bg-slate-50 text-[#0F172A] border border-slate-200 cursor-pointer focus:outline-none"
          >
            <option value="all">日本語: すべて</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="N2">N2</option>
          </select>

          {(selectedField !== 'all' || selectedLocation !== 'all' || selectedJapanese !== 'all' || searchKeyword) && (
            <button
              onClick={() => {
                setSelectedField('all');
                setSelectedLocation('all');
                setSelectedJapanese('all');
                setSearchKeyword('');
              }}
              className="text-[12.5px] font-bold text-[#0071E3] hover:underline px-2 cursor-pointer"
            >
              リセット
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-8 overflow-x-auto hide-scrollbar border-b border-slate-200 -mt-2 relative">
        {[
          { key: 'recommended', label: 'あなたへのおすすめ' },
          { key: 'newest', label: '新着' },
          { key: 'academia', label: 'アカデミア修了' },
          { key: 'favorites', label: `気になる (${state.favorites.candidateIds.length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as DiscoveryTab)}
            className={`relative pb-3.5 text-[15px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === key ? 'text-[#0071E3]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {label}
            {activeTab === key && (
              <motion.div
                layoutId="discoveryActiveTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0071E3]"
                transition={{ type: 'spring', damping: 26, stiffness: 350 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Grid: Feed + Refinement Idea 4 (Integrated Pipeline Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Candidate Feed (2 columns on lg) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {filtered.length === 0 ? (
            <div className="apple-card p-12 text-center my-4">
              <h3 className="text-[19px] font-bold text-[#0F172A] mb-2">
                該当する候補者が見つかりませんでした
              </h3>
              <p className="text-[15px] text-[#64748B] mb-6 font-medium">
                検索条件を変更してお試しください。
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedField('all');
                  setSelectedLocation('all');
                  setSelectedJapanese('all');
                  setSearchKeyword('');
                  setActiveTab('recommended');
                }}
              >
                条件をリセット
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: idx * 0.05, type: 'spring', damping: 26, stiffness: 350 }}
                >
                  <CandidateStoryCard
                    candidate={c}
                    matchSummary={defaultJob ? computeMatchCompass(c, defaultJob) : undefined}
                    isFavorite={state.favorites.candidateIds.includes(c.id)}
                    onToggleFavorite={() => toggleFavorite(c.id)}
                    onClick={() => navigate(`/company/candidates/${c.id}`)}
                    isScoutedOrApplied={state.threads.some((t) => t.candidateId === c.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Refinement Idea 4: Integrated Pipeline Widget */}
        <div className="hidden lg:block sticky top-[88px]">
          <ContextPipelineWidget />
        </div>
      </div>

      {/* Story Video Modal */}
      <StoryVideoModal
        candidate={activeStoryCandidate}
        onClose={() => setActiveStoryCandidate(null)}
        onNavigateDetail={(id) => navigate(`/company/candidates/${id}`)}
      />
    </motion.div>
  );
}

/* ===== Refinement Idea 3 & 5: Candidate Story Card with "94% MATCH" Visual Gauge & Linear Grid Layout ===== */
function CandidateStoryCard({
  candidate,
  matchSummary,
  isFavorite,
  onToggleFavorite,
  onClick,
  isScoutedOrApplied,
}: {
  candidate: Candidate;
  matchSummary?: ReturnType<typeof computeMatchCompass>;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
  isScoutedOrApplied: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate percentage match
  const matchPct = matchSummary
    ? Math.round((matchSummary.matched.length / (matchSummary.matched.length + matchSummary.needsCheck.length || 1)) * 100)
    : 92;

  return (
    <motion.article
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.038 : 1,
        borderColor: isHovered ? 'rgba(0, 113, 227, 0.5)' : 'rgba(15, 23, 42, 0.06)',
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 160,
        mass: 1.1,
      }}
      className={`apple-card p-6 md:p-7 cursor-pointer flex flex-col gap-4 relative overflow-hidden transition-shadow duration-500 ${
        isHovered
          ? 'shadow-[0_20px_45px_-12px_rgba(0,113,227,0.15),0_12px_24px_-6px_rgba(15,23,42,0.12)] z-30 bg-white ring-1 ring-[#0071E3]/20'
          : 'z-1'
      }`}
      onClick={onClick}
    >
      {/* Top Header Row with Portrait Face Avatar & Refinement Idea 3 ("94% MATCH" Badge) */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-3.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <CandidateAvatar src={candidate.photoUrl} name={candidate.name} candidateId={candidate.id} size="lg" className="w-13 h-13 sm:w-14 sm:h-14 rounded-full" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0071E3] text-white flex items-center justify-center ring-2 ring-white" title="MiraiWay 事前面談・検証済み">
              <Check size={10} strokeWidth={3} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[17px] sm:text-[19px] font-extrabold text-[#0F172A] leading-snug tracking-tight truncate">
              {candidate.name} <span className="text-[13px] font-semibold text-[#64748B]">({candidate.age}歳 · {candidate.desiredLocations.join('・')})</span>
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              <span className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-extrabold text-[#0071E3] bg-slate-100 px-2.5 py-0.5 rounded-md whitespace-nowrap">
                <FlagIcon className="w-3.5 h-2.5" />
                スリランカ · {candidate.field}
              </span>
              {candidate.academiaCompleted && (
                <span className="inline-flex items-center gap-1 text-[11.5px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-[#0F172A] border border-slate-200 whitespace-nowrap">
                  <ShieldCheck size={12} /> アカデミア修了
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Icons & Match Gauge Badge */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <span className="text-[12px] sm:text-[12.5px] font-extrabold px-3 py-1 rounded-full bg-[#0071E3] text-white shadow-2xs whitespace-nowrap">
            {matchPct}% MATCH
          </span>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer transition-colors"
            aria-label={isFavorite ? '気になるを解除' : '気になる'}
          >
            <Heart size={19} fill={isFavorite ? '#0F172A' : 'none'} className={isFavorite ? 'text-[#0F172A]' : 'text-[#64748B]'} />
          </button>
        </div>
      </div>

      {/* Story Catchphrase */}
      <p className="text-[18px] md:text-[19px] font-extrabold text-[#0F172A] leading-snug tracking-tight">
        「{candidate.storyHeadline}」
      </p>

      {/* Evidence Chips Grid */}
      <div className="flex flex-wrap gap-2">
        {candidate.evidenceItems.slice(0, 4).map((ev) => {
          const Icon = iconMap[ev.icon] || Clock;
          return (
            <div
              key={ev.label}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-[#0F172A] text-[13px] font-semibold border border-slate-200/80"
            >
              <Icon size={14} className="text-[#0071E3]" />
              <span className="text-[#64748B]">{ev.label}:</span>
              <span className="font-bold">{ev.value}</span>
            </div>
          );
        })}
      </div>

      {/* Expanded Details Drawer */}
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
            className="overflow-hidden flex flex-col gap-3.5 pt-4 border-t border-slate-200 bg-slate-50/60 -mx-7 px-7 pb-4 -mb-3 rounded-b-2xl"
          >
            {candidate.miraiwayNote && (
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1 text-[13px] font-bold text-[#0071E3]">
                  <FileText size={15} />
                  <span>MiraiWay 担当者面談所感</span>
                </div>
                <p className="text-[13.5px] text-[#0F172A] leading-relaxed font-medium">
                  {candidate.miraiwayNote}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[12.5px] font-bold text-[#0071E3] flex items-center gap-1">
                <ChevronDown size={14} className="rotate-180" /> 詳細を展開中
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                <Send size={14} />
                詳細プロフィール・スカウト送信
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Footer */}
      {!isHovered && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            {isScoutedOrApplied && (
              <span className="text-[12px] font-bold text-[#0071E3] bg-slate-100 px-2.5 py-0.5 rounded-md">
                スカウト送信済み
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[14px] font-bold text-[#0071E3]">
            詳細を見る <ArrowRight size={15} />
          </div>
        </div>
      )}
    </motion.article>
  );
}

/* ===== Refinement Idea 4: Integrated Pipeline Widget (右側 採用パイプライン小窓) ===== */
function ContextPipelineWidget() {
  const { state } = useDemo();
  const navigate = useNavigate();

  const favoriteCount = state.favorites.candidateIds.length;
  const waitingReply = state.threads.filter((t) => t.nextAction.assignee === 'company' && t.status === 'waiting_reply').length;
  const scheduling = state.threads.filter((t) => t.status === 'interview_scheduling').length;
  const offerCount = state.threads.filter((t) => t.status === 'offer' || t.status === 'onboarding').length;
  const priorityThread = state.threads.find((t) => t.nextAction.assignee === 'company');

  return (
    <div className="apple-card p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-[16px] font-extrabold text-[#0F172A]">採用パイプライン</h3>
        <span className="text-[12px] font-bold text-[#0071E3] bg-slate-100 px-2 py-0.5 rounded">REALTIME</span>
      </div>

      {/* Urgent Action Callout */}
      {priorityThread && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
          <span className="text-[12px] font-extrabold text-[#B45309] block">要対応アクション</span>
          <p className="text-[13.5px] font-bold text-[#0F172A] leading-snug">
            {priorityThread.nextAction.description}
          </p>
          <Button
            variant="primary"
            size="sm"
            className="w-full text-[12.5px] mt-1"
            onClick={() => navigate(priorityThread.nextAction.ctaRoute)}
          >
            {priorityThread.nextAction.ctaLabel}
          </Button>
        </div>
      )}

      {/* Pipeline Status Breakdown */}
      <div className="flex flex-col gap-2.5 text-[13.5px] pt-1">
        {[
          { label: '気になる保存', count: favoriteCount, color: 'text-[#0071E3]' },
          { label: '返信待ち', count: waitingReply, color: 'text-[#B45309]' },
          { label: '面接調整中', count: scheduling, color: 'text-[#0F172A]' },
          { label: '内定手続中', count: offerCount, color: 'text-[#0071E3]' },
        ].map(({ label, count, color }) => (
          <div key={label} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
            <span className="text-[#64748B] font-semibold">{label}</span>
            <span className={`font-extrabold ${color}`}>{count}名</span>
          </div>
        ))}
      </div>
    </div>
  );
}
