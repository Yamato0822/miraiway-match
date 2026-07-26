import { useState, useMemo } from 'react';
import { useDemo } from '../../state/DemoContext';
import { useNavigate } from 'react-router-dom';
import { Check, AlertTriangle, ArrowRight, Home, Calendar as CalendarIcon, Users, Heart } from 'lucide-react';
import { computeMatchCompass } from '../../lib/matchCompass';

export function JobDiscovery() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('match');

  const defaultCandidate = state.candidates[0];

  const publishedJobs = useMemo(() => {
    let list = [...state.jobs];
    if (sortBy === 'match' && defaultCandidate) {
      list.sort((a, b) => {
        const ma = computeMatchCompass(defaultCandidate, a).matched.length;
        const mb = computeMatchCompass(defaultCandidate, b).matched.length;
        return mb - ma;
      });
    } else if (sortBy === 'salary') {
      list.sort((a, b) => b.salary.max - a.salary.max);
    } else if (sortBy === 'holiday') {
      list.sort((a, b) => b.annualHolidays - a.annualHolidays);
    }
    return list;
  }, [state.jobs, sortBy, defaultCandidate]);

  // Featured categories
  const categories = [
    { label: '寮があり、初めての来日でも生活を始めやすい', icon: Home },
    { label: '外国人スタッフが働いている', icon: Users },
    { label: '残業が少なく、休日実績が明確', icon: CalendarIcon },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Featured categories rail */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar mb-6 -mx-1 px-1 pb-2">
        {categories.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="shrink-0 w-[260px] p-4 rounded-xl border cursor-pointer hover:shadow-md transition-shadow"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#D9E2EC' }}
          >
            <Icon size={20} style={{ color: '#1C6FB8' }} className="mb-2" />
            <p className="text-[14px] font-medium leading-tight" style={{ color: '#1A2333' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[26px] md:text-[30px] font-bold" style={{ color: '#1A2333' }}>
            安心して働ける仕事を探す
          </h1>
          <p className="text-[14px] mt-1" style={{ color: '#5D6B82' }}>
            お給料、住まい、休日、サポートまで確認できます
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px]" style={{ color: '#5D6B82' }}>{publishedJobs.length}件</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-[13px] px-3 py-2 rounded-lg border bg-white"
            style={{ borderColor: '#D9E2EC' }}
            aria-label="並び替え"
          >
            <option value="match">希望との一致が多い順</option>
            <option value="newest">新着順</option>
            <option value="salary">給料が高い順</option>
            <option value="holiday">休日が多い順</option>
          </select>
        </div>
      </div>

      {/* Job Cards */}
      <div className="flex flex-col gap-5">
        {publishedJobs.map((job) => {
          const match = defaultCandidate ? computeMatchCompass(defaultCandidate, job) : null;
          const isFav = state.favorites.jobIds.includes(job.id);
          const hasApplied = state.threads.some((t) => t.jobId === job.id);
          return (
            <article
              key={job.id}
              className="rounded-[14px] overflow-hidden border cursor-pointer hover:shadow-lg transition-shadow"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#D9E2EC' }}
              onClick={() => navigate(`/candidate/jobs/${job.id}`)}
            >
              {/* Image placeholder */}
              <div className="relative h-[160px] md:h-[200px]" style={{ backgroundColor: '#EAF3FB' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[13px]" style={{ color: '#5D6B82' }}>職場の写真準備中</p>
                </div>
                {job.isNew && (
                  <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#1C6FB8', color: '#FFFFFF' }}>
                    NEW
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'TOGGLE_FAVORITE_JOB', jobId: job.id });
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                  aria-label={isFav ? '気になるを解除' : '気になる'}
                >
                  <Heart size={16} fill={isFav ? '#D93025' : 'none'} style={{ color: isFav ? '#D93025' : '#5D6B82' }} />
                </button>
              </div>
              <div className="p-5 md:p-6">
                <p className="text-[13px] font-medium mb-1" style={{ color: '#5D6B82' }}>{job.companyName}</p>
                <h3 className="text-[20px] md:text-[22px] font-bold leading-tight mb-2" style={{ color: '#1A2333' }}>
                  {job.storyHeadline}
                </h3>
                <p className="text-[14px] mb-3" style={{ color: '#5D6B82' }}>{job.title}</p>

                {/* Reality First Summary */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ backgroundColor: '#EAF7EE', color: '#2D8A4E' }}>
                    費用 0円
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ backgroundColor: '#F7F8FA', border: '1px solid #E5EAF0', color: '#1A2333' }}>
                    手取り目安 {(job.takeHomePay.min / 10000).toFixed(0)}〜{(job.takeHomePay.max / 10000).toFixed(0)}万円
                  </span>
                  {job.dorm.available && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ backgroundColor: '#F7F8FA', border: '1px solid #E5EAF0', color: '#1A2333' }}>
                      <Home size={12} /> {job.dorm.type}寮 {(job.dorm.rent / 10000).toFixed(1)}万円
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ backgroundColor: '#F7F8FA', border: '1px solid #E5EAF0', color: '#1A2333' }}>
                    <CalendarIcon size={12} /> 年間休日 {job.annualHolidays}日
                  </span>
                  {job.foreignStaff > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ backgroundColor: '#F7F8FA', border: '1px solid #E5EAF0', color: '#1A2333' }}>
                      <Users size={12} /> 外国人スタッフ {job.foreignStaff}名
                    </span>
                  )}
                </div>

                {/* Match */}
                {match && (
                  <div className="flex items-center gap-3 py-2 px-3 rounded-xl mb-3" style={{ backgroundColor: '#F7F8FA' }}>
                    <span className="text-[12px] font-semibold flex items-center gap-1" style={{ color: '#2D8A4E' }}>
                      <Check size={12} /> 一致 {match.matched.length}件
                    </span>
                    {match.needsCheck.length > 0 && (
                      <span className="text-[12px] font-semibold flex items-center gap-1" style={{ color: '#D4860A' }}>
                        <AlertTriangle size={12} /> 確認 {match.needsCheck.length}件
                      </span>
                    )}
                    {job.unansweredItems.length > 0 && (
                      <span className="text-[12px] font-medium" style={{ color: '#5D6B82' }}>
                        未回答 {job.unansweredItems.length}件
                      </span>
                    )}
                  </div>
                )}

                {hasApplied && (
                  <span className="text-[12px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: '#EAF3FB', color: '#1C6FB8' }}>
                    応募済み
                  </span>
                )}

                <div className="flex justify-end mt-2">
                  <span className="text-[14px] font-medium flex items-center gap-1" style={{ color: '#1C6FB8' }}>
                    詳しく見る <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
