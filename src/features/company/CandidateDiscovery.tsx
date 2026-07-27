import { useState, useMemo } from 'react';
import { useDemo } from '../../state/DemoContext';
import { useNavigate } from 'react-router-dom';
import { Search, RotateCcw, ShieldCheck, Megaphone, Bookmark, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { computeMatchCompass } from '../../lib/matchCompass';
import { Button } from '../../components/common/Button';
import { FlagIcon, CandidateAvatar } from '../../components/common/CandidateAvatar';
import { StoryVideoModal } from '../../components/demo/StoryVideoModal';
import type { Candidate, DiscoveryTab, SortOption } from '../../types';

const defaultGradientSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%230F172A'/><stop offset='50%' stop-color='%231E293B'/><stop offset='100%' stop-color='%230071E3'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><circle cx='400' cy='200' r='140' fill='%230071E3' opacity='0.25'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23FFFFFF' font-family='sans-serif' font-size='22' font-weight='bold' opacity='0.9'>MiraiWay Match · スリランカ高度人材</text></svg>";

export function CandidateDiscovery() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const [categoryTab, setCategoryTab] = useState<'candidates' | 'casual'>('candidates');
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('recommended');
  const [sortBy] = useState<SortOption>('match');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedJapanese, setSelectedJapanese] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [onlyAcademia, setOnlyAcademia] = useState<boolean>(false);
  const [onlyVideo, setOnlyVideo] = useState<boolean>(false);
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
    if (activeTab === 'academia' || onlyAcademia) {
      list = list.filter((c) => c.academiaCompleted);
    }
    if (onlyVideo) {
      list = list.filter((c) => Boolean(c.videoDuration));
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
  }, [state.candidates, state.favorites.candidateIds, activeTab, sortBy, selectedField, selectedLocation, selectedJapanese, searchKeyword, onlyAcademia, onlyVideo, defaultJob]);

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

  const resetFilters = () => {
    setSelectedField('all');
    setSelectedLocation('all');
    setSelectedJapanese('all');
    setSearchKeyword('');
    setOnlyAcademia(false);
    setOnlyVideo(false);
    setActiveTab('recommended');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="max-w-[1140px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-24"
    >
      {/* Wantedly-style 2-Column Stream Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ===== Left Sidebar (Filters & Category Tabs) ===== */}
        <aside className="w-full lg:w-[270px] shrink-0 sticky top-[80px] self-start flex flex-col gap-6">

          {/* Top Category Switcher (Wantedly 「シゴト / ミートアップ」 Style) */}
          <div className="flex items-center gap-6 border-b border-slate-200 pb-2">
            <button
              onClick={() => setCategoryTab('candidates')}
              className={`relative pb-2.5 text-[15px] font-extrabold transition-colors cursor-pointer ${
                categoryTab === 'candidates' ? 'text-[#111827]' : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              候補者を探す
              {categoryTab === 'candidates' && (
                <motion.div
                  layoutId="wantedlyCategoryTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0071E3]"
                />
              )}
            </button>

            <button
              onClick={() => setCategoryTab('casual')}
              className={`relative pb-2.5 text-[15px] font-extrabold transition-colors cursor-pointer ${
                categoryTab === 'casual' ? 'text-[#111827]' : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              カジュアル面談
              {categoryTab === 'casual' && (
                <motion.div
                  layoutId="wantedlyCategoryTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0071E3]"
                />
              )}
            </button>
          </div>

          {/* Wantedly Pick Banner ("指名カジュ面、はじめました。" Style) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex flex-col gap-1">
              <span className="text-[10.5px] font-extrabold text-[#0071E3] bg-white px-2 py-0.5 rounded border border-slate-200 w-fit">
                MiraiWay Pick
              </span>
              <p className="text-[14px] font-extrabold text-[#111827] leading-snug">
                指名カジュアル面談、<br />はじめました。
              </p>
              <span className="text-[11.5px] text-[#6B7280] font-semibold mt-0.5">通訳が100%同席無料</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-[#0071E3]/10 border border-[#0071E3]/20 flex items-center justify-center shrink-0 overflow-hidden">
              <CandidateAvatar src={state.candidates[0].photoUrl} name="MiraiWay" size="md" className="w-14 h-14 rounded-full object-cover" />
            </div>
          </div>

          {/* Section Title & Reset */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-[16px] font-extrabold text-[#111827]">候補者を絞り込む</h2>
            <button
              onClick={resetFilters}
              className="text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer p-1"
              title="条件をリセット"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Keyword Search Input (Wantedly Flat Gray Input) */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="キーワードで検索"
              className="w-full pl-9 pr-3 py-2.5 text-[14px] font-semibold rounded-lg bg-[#F3F4F6] text-[#111827] border-0 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/40 transition-all placeholder:text-[#9CA3AF]"
            />
          </div>

          {/* Select Dropdowns */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[12px] font-bold text-[#6B7280] block mb-1">職種・分野</label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full px-3 py-2.5 text-[14px] font-bold rounded-lg bg-white text-[#111827] border border-slate-200/90 cursor-pointer focus:outline-none focus:border-[#0071E3]"
              >
                <option value="all">すべての職種</option>
                <option value="建設">建設</option>
                <option value="介護">介護</option>
                <option value="製造">製造</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#6B7280] block mb-1">希望地域</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2.5 text-[14px] font-bold rounded-lg bg-white text-[#111827] border border-slate-200/90 cursor-pointer focus:outline-none focus:border-[#0071E3]"
              >
                <option value="all">すべての地域</option>
                <option value="東京">東京</option>
                <option value="神奈川">神奈川</option>
                <option value="埼玉">埼玉</option>
                <option value="千葉">千葉</option>
                <option value="大阪">大阪</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#6B7280] block mb-1">日本語レベル</label>
              <select
                value={selectedJapanese}
                onChange={(e) => setSelectedJapanese(e.target.value)}
                className="w-full px-3 py-2.5 text-[14px] font-bold rounded-lg bg-white text-[#111827] border border-slate-200/90 cursor-pointer focus:outline-none focus:border-[#0071E3]"
              >
                <option value="all">すべてのレベル</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
              </select>
            </div>
          </div>

          {/* Wantedly Characteristic Checkbox List */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
            <span className="text-[12px] font-bold text-[#6B7280] block">特徴・条件</span>
            
            <label className="flex items-center gap-2.5 text-[13.5px] font-bold text-[#111827] cursor-pointer hover:text-[#0071E3] transition-colors">
              <input
                type="checkbox"
                checked={onlyAcademia}
                onChange={(e) => setOnlyAcademia(e.target.checked)}
                className="w-4 h-4 rounded text-[#0071E3] focus:ring-0 cursor-pointer"
              />
              <span>アカデミア修了者のみ</span>
            </label>

            <label className="flex items-center gap-2.5 text-[13.5px] font-bold text-[#111827] cursor-pointer hover:text-[#0071E3] transition-colors">
              <input
                type="checkbox"
                checked={onlyVideo}
                onChange={(e) => setOnlyVideo(e.target.checked)}
                className="w-4 h-4 rounded text-[#0071E3] focus:ring-0 cursor-pointer"
              />
              <span>自己紹介動画あり</span>
              <span className="text-[10px] font-extrabold text-white bg-[#0071E3] px-1.5 py-0.5 rounded">NEW</span>
            </label>
          </div>
        </aside>

        {/* ===== Right Stream Feed (Wantedly Cover Stream) ===== */}
        <main className="flex-1 min-w-0 max-w-[820px] flex flex-col gap-6">

          {/* Stream Header (Count on Left, Sort Links on Right) */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <h1 className="text-[17px] font-extrabold text-[#111827]">
              <strong className="text-[20px]">{filtered.length}</strong> / {state.candidates.length}件の候補者
            </h1>

            {/* Wantedly Tab Sort Links ("人気 | 新着 | おすすめ") */}
            <div className="flex items-center gap-4 text-[14px] font-bold">
              {[
                { key: 'recommended', label: 'おすすめ' },
                { key: 'newest', label: '新着' },
                { key: 'academia', label: 'アカデミア' },
                { key: 'favorites', label: `気になる (${state.favorites.candidateIds.length})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as DiscoveryTab)}
                  className={`cursor-pointer transition-colors ${
                    activeTab === key ? 'text-[#0071E3] font-extrabold underline underline-offset-4' : 'text-[#6B7280] hover:text-[#111827]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Candidate Stream List */}
          {filtered.length === 0 ? (
            <div className="p-12 text-center my-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-[18px] font-bold text-[#111827] mb-2">
                該当する候補者が見つかりませんでした
              </h3>
              <p className="text-[14px] text-[#6B7280] mb-6 font-medium">
                条件をリセットしてお試しください。
              </p>
              <Button variant="secondary" onClick={resetFilters}>
                条件をリセット
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((c, idx) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: idx * 0.04, type: 'spring', damping: 26, stiffness: 350 }}
                  >
                    <WantedlyCandidateCard
                      candidate={c}
                      matchSummary={defaultJob ? computeMatchCompass(c, defaultJob) : undefined}
                      isFavorite={state.favorites.candidateIds.includes(c.id)}
                      onToggleFavorite={() => toggleFavorite(c.id)}
                      onClick={() => navigate(`/company/candidates/${c.id}`)}
                      onOpenVideo={() => setActiveStoryCandidate(c)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
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

/* ===== Wantedly Stream Candidate Card Component ===== */
function WantedlyCandidateCard({
  candidate,
  matchSummary,
  isFavorite,
  onToggleFavorite,
  onClick,
  onOpenVideo,
}: {
  candidate: Candidate;
  matchSummary?: ReturnType<typeof computeMatchCompass>;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
  onOpenVideo: () => void;
}) {
  const matchPct = matchSummary
    ? Math.round((matchSummary.matched.length / (matchSummary.matched.length + matchSummary.needsCheck.length || 1)) * 100)
    : 92;

  return (
    <article
      onClick={onClick}
      className="wantedly-card p-0 cursor-pointer overflow-hidden flex flex-col gap-4 group transition-all"
    >
      {/* 1. Wantedly Hero Cover Image (16:9 Aspect Ratio) */}
      <div className="relative w-full h-[220px] sm:h-[260px] bg-slate-900 overflow-hidden">
        <img
          src={candidate.coverUrl || defaultGradientSvg}
          alt={candidate.storyHeadline}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultGradientSvg;
          }}
        />

        {/* Video Play Overlay Indicator if video exists */}
        {candidate.videoDuration && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenVideo();
            }}
            className="absolute bottom-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[12px] font-extrabold hover:bg-[#0071E3] transition-colors cursor-pointer border border-white/20"
          >
            <Play size={13} className="fill-white" />
            <span>自己紹介動画 ({candidate.videoDuration})</span>
          </button>
        )}

        {/* Match Percentage Pill Badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <span className="text-[12px] font-extrabold px-3 py-1 rounded-full bg-[#0071E3] text-white shadow-sm">
            {matchPct}% MATCH
          </span>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="px-6 pt-2 pb-5 flex flex-col gap-3.5">

        {/* Tag Pills Row (Wantedly Green & Gray Tags) */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 tag-green font-extrabold px-2.5 py-1 rounded-md text-[12.5px] whitespace-nowrap">
            {candidate.field} · {candidate.subField}
          </span>

          <span className="tag-gray font-bold px-2.5 py-1 rounded-md text-[12px] whitespace-nowrap">
            日本語 {candidate.japaneseLevel} ({candidate.studyHours}h)
          </span>

          {candidate.academiaCompleted && (
            <span className="inline-flex items-center gap-1 tag-gray font-bold px-2.5 py-1 rounded-md text-[12px] whitespace-nowrap">
              <ShieldCheck size={13} className="text-[#0071E3]" /> アカデミア修了
            </span>
          )}

          <span className="tag-gray font-bold px-2.5 py-1 rounded-md text-[12px] whitespace-nowrap">
            開始: {candidate.startTiming}
          </span>
        </div>

        {/* Impact Catchphrase Title */}
        <h2 className="text-[20px] sm:text-[22px] font-extrabold text-[#111827] leading-snug tracking-tight group-hover:text-[#0071E3] transition-colors">
          「{candidate.storyHeadline}」
        </h2>

        {/* Short Intro Excerpt */}
        <p className="text-[14.5px] text-[#4B5563] leading-relaxed line-clamp-2 font-medium">
          {candidate.shortStory}
        </p>

        {/* Entry / Scout Stats Subtext */}
        <p className="text-[13px] text-[#6B7280] font-bold">
          {candidate.studyHours / 10 + 12}人がスカウト検討・注目中
        </p>

        {/* Footer Meta Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CandidateAvatar src={candidate.photoUrl} name={candidate.name} candidateId={candidate.id} size="sm" className="w-9 h-9 rounded-full object-cover" />
            <div>
              <div className="flex items-center gap-1.5 text-[14px] font-extrabold text-[#111827]">
                <span>{candidate.name}</span>
                <FlagIcon className="w-3.5 h-2.5" />
              </div>
              <span className="text-[12px] text-[#6B7280] font-semibold">{candidate.age}歳 · 希望: {candidate.desiredLocations.join('・')}</span>
            </div>
          </div>

          {/* Action Buttons (Share Megaphone / Favorite Bookmark) */}
          <div className="flex items-center gap-3 text-[#6B7280]">
            <div className="flex items-center gap-1 text-[13px] font-bold">
              <Megaphone size={16} />
              <span>0</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="flex items-center gap-1 text-[13px] font-bold hover:text-[#111827] transition-colors cursor-pointer"
            >
              <Bookmark size={16} fill={isFavorite ? '#111827' : 'none'} className={isFavorite ? 'text-[#111827]' : 'text-[#6B7280]'} />
              <span>{isFavorite ? 1 : 0}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
