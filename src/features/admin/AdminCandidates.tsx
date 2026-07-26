import { useDemo } from '../../state/DemoContext';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function AdminCandidates() {
  const { state, dispatch } = useDemo();
  const [filter, setFilter] = useState('');

  const candidates = state.candidates.filter(
    (c) => c.name.includes(filter) || c.field.includes(filter)
  );

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6 pb-10">
      <h1 className="text-[26px] font-bold mb-2" style={{ color: '#1A2333' }}>候補者管理</h1>
      <p className="text-[14px] mb-6" style={{ color: '#5D6B82' }}>候補者の公開状態・情報充実度の管理</p>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="名前または分野で検索..."
          className="w-full max-w-[320px] px-3 py-2 text-[14px] rounded-lg border"
          style={{ borderColor: '#D9E2EC' }}
        />
      </div>

      {/* List */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#D9E2EC', backgroundColor: '#FFFFFF' }}>
        {candidates.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4 border-b last:border-0" style={{ borderColor: '#E5EAF0' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold" style={{ backgroundColor: '#EAF3FB', color: '#1C6FB8' }}>
                {c.name.charAt(0)}
              </div>
              <div>
                <p className="text-[15px] font-semibold" style={{ color: '#1A2333' }}>{c.name} ({c.nameEn})</p>
                <p className="text-[12px]" style={{ color: '#5D6B82' }}>
                  {c.field} · {c.japaneseLevel} · 学習{c.studyHours}h · {c.desiredLocations.join('・')}
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CANDIDATE_PUBLISHED', candidateId: c.id })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
              style={{
                backgroundColor: c.published ? '#EAF7EE' : '#F7F8FA',
                color: c.published ? '#2D8A4E' : '#5D6B82',
              }}
              aria-pressed={c.published}
            >
              {c.published ? <><Eye size={14} /> 公開中</> : <><EyeOff size={14} /> 非公開</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
