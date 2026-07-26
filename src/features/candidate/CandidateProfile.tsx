import { useDemo } from '../../state/DemoContext';
import { Button } from '../../components/common/Button';

export function CandidateProfile() {
  const { state } = useDemo();
  const candidate = state.candidates[0]; // Demo: first candidate as "me"

  if (!candidate) return null;

  const sections = [
    { label: '写真', complete: false },
    { label: '自己紹介', complete: !!candidate.selfIntro },
    { label: '仕事経験', complete: candidate.experiences.length > 0 },
    { label: '日本語と試験', complete: candidate.exams.length > 0 },
    { label: '学習履歴', complete: candidate.learningTimeline.length > 0 },
    { label: '希望条件', complete: candidate.desiredLocations.length > 0 },
    { label: '入社可能時期', complete: !!candidate.startTiming },
  ];
  const completedCount = sections.filter((s) => s.complete).length;

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6 pb-10">
      <h1 className="text-[26px] font-bold mb-2" style={{ color: '#1A2333' }}>プロフィール</h1>
      <p className="text-[14px] mb-6" style={{ color: '#5D6B82' }}>
        企業が声をかけやすくなる情報を整えましょう
      </p>

      {/* Completeness */}
      <div className="rounded-2xl p-5 border mb-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#D9E2EC' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[15px] font-semibold" style={{ color: '#1A2333' }}>プロフィール完成度</p>
          <span className="text-[14px] font-bold" style={{ color: '#1C6FB8' }}>{completedCount}/{sections.length}</span>
        </div>
        <div className="w-full h-2 rounded-full mb-3" style={{ backgroundColor: '#E5EAF0' }}>
          <div className="h-full rounded-full" style={{ width: `${(completedCount / sections.length) * 100}%`, backgroundColor: '#1C6FB8' }} />
        </div>
        <div className="flex flex-col gap-2">
          {sections.filter((s) => !s.complete).map((s) => (
            <p key={s.label} className="text-[13px] flex items-center gap-2" style={{ color: '#D4860A' }}>
              · {s.label}を入力すると、企業から声がかかりやすくなります
            </p>
          ))}
        </div>
      </div>

      {/* Profile sections */}
      {[
        { title: '基本情報', content: `${candidate.name}（${candidate.nameEn}）· ${candidate.age}歳 · ${candidate.field}` },
        { title: '自己紹介', content: candidate.selfIntro },
        { title: '仕事への想い', content: candidate.workAspiration },
        { title: '日本語レベル', content: `${candidate.japaneseLevel} · 累計学習${candidate.studyHours}時間` },
        { title: '希望条件', content: `勤務地: ${candidate.desiredLocations.join('・')} · 希望月給: ${candidate.desiredSalary.toLocaleString()}円 · 寮: ${candidate.dormPreference ? '希望' : '不要'} · 開始: ${candidate.startTiming}` },
      ].map(({ title, content }) => (
        <div key={title} className="rounded-xl p-5 border mb-3" style={{ backgroundColor: '#FFFFFF', borderColor: '#D9E2EC' }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[16px] font-bold" style={{ color: '#1A2333' }}>{title}</h2>
            <Button variant="tertiary" size="sm" onClick={() => {
              // Prototype: show toast
            }}>
              編集
            </Button>
          </div>
          <p className="text-[14px]" style={{ color: '#5D6B82' }}>{content}</p>
        </div>
      ))}
    </div>
  );
}
