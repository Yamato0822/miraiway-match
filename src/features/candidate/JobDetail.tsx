import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/DemoContext';
import { computeMatchCompass } from '../../lib/matchCompass';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useState } from 'react';
import { ArrowLeft, Check, AlertTriangle, Banknote, Home, Clock, Calendar, Users, Shield, HelpCircle, ArrowRight } from 'lucide-react';

export function JobDetail() {
  const { jobId } = useParams<{ jobId: string }>();
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState('応募させていただきます。ぜひお話しさせてください。');

  const job = state.jobs.find((j) => j.id === jobId);
  if (!job) return <div className="p-10 text-center" style={{ color: '#5D6B82' }}>求人が見つかりません</div>;

  const defaultCandidate = state.candidates[0];
  const match = defaultCandidate ? computeMatchCompass(defaultCandidate, job) : null;
  const pendingQs = state.pendingQuestions[job.id] || [];
  const existingThread = state.threads.find((t) => t.jobId === job.id);

  const handleApply = () => {
    dispatch({
      type: 'APPLY_TO_JOB',
      jobId: job.id,
      candidateId: defaultCandidate.id,
      message: applyMessage,
      questions: pendingQs,
    });
    setShowApplyModal(false);
    dispatch({
      type: 'SHOW_TOAST',
      toast: {
        message: `${job.companyName}に応募しました`,
        type: 'success',
        action: { label: 'やり取りを見る', route: '/candidate/messages' },
      },
    });
  };

  const addQuestion = (q: string) => {
    dispatch({ type: 'ADD_PENDING_QUESTION', jobId: job.id, question: q });
    dispatch({
      type: 'SHOW_TOAST',
      toast: { message: '応募後、会社に聞く質問へ追加しました', type: 'info' },
    });
  };

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 py-4 text-[14px] font-medium" style={{ color: '#5D6B82' }}>
        <ArrowLeft size={16} /> 戻る
      </button>

      {/* Hero */}
      <div className="rounded-2xl overflow-hidden border mb-6" style={{ borderColor: '#D9E2EC' }}>
        <div className="h-[180px] md:h-[240px]" style={{ backgroundColor: '#EAF3FB' }}>
          <div className="h-full flex items-center justify-center">
            <p className="text-[13px]" style={{ color: '#5D6B82' }}>職場の写真準備中</p>
          </div>
        </div>
        <div className="p-5 md:p-6" style={{ backgroundColor: '#FFFFFF' }}>
          <p className="text-[13px] font-medium mb-1" style={{ color: '#5D6B82' }}>{job.companyName}</p>
          <h1 className="text-[24px] md:text-[28px] font-bold leading-tight" style={{ color: '#1A2333' }}>
            {job.storyHeadline}
          </h1>
          <p className="text-[14px] mt-1" style={{ color: '#5D6B82' }}>{job.title} · {job.location}</p>

          {/* Match bar */}
          {match && (
            <div className="flex items-center gap-3 mt-3 px-3 py-2 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
              <span className="text-[13px] font-semibold" style={{ color: '#1A2333' }}>あなたとの条件</span>
              <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EAF7EE', color: '#2D8A4E' }}>一致 {match.matched.length}件</span>
              {match.needsCheck.length > 0 && (
                <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FDF6E3', color: '#D4860A' }}>確認 {match.needsCheck.length}件</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reality First Sections */}
      {/* 1. Cost */}
      <Section icon={<Banknote size={18} />} title="あなたが払う費用" accent>
        <p className="text-[28px] font-bold" style={{ color: '#2D8A4E' }}>0円</p>
        <p className="text-[14px] mt-1" style={{ color: '#5D6B82' }}>
          求職者が払う費用はありません。MiraiWayの利用料は企業が負担します。
        </p>
      </Section>

      {/* 2. Salary */}
      <Section icon={<Banknote size={18} />} title="お給料と手取り">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[12px] font-semibold mb-1" style={{ color: '#5D6B82' }}>月給</p>
            <p className="text-[22px] font-bold" style={{ color: '#1A2333' }}>
              {(job.salary.min / 10000).toFixed(0)}〜{(job.salary.max / 10000).toFixed(0)}万円
            </p>
          </div>
          <div>
            <p className="text-[12px] font-semibold mb-1" style={{ color: '#5D6B82' }}>手取り目安</p>
            <p className="text-[22px] font-bold" style={{ color: '#2D8A4E' }}>
              {(job.takeHomePay.min / 10000).toFixed(0)}〜{(job.takeHomePay.max / 10000).toFixed(0)}万円
            </p>
            <p className="text-[11px]" style={{ color: '#5D6B82' }}>税金や保険を引いた後の金額</p>
          </div>
        </div>
      </Section>

      {/* 3. Deductions */}
      <Section icon={<Banknote size={18} />} title="給料から引かれるお金（天引き）">
        <div className="flex flex-col gap-2">
          {job.deductions.map((d) => (
            <div key={d.name} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: '#E5EAF0' }}>
              <div>
                <p className="text-[14px] font-medium" style={{ color: '#1A2333' }}>{d.name}</p>
                {d.description && <p className="text-[12px]" style={{ color: '#5D6B82' }}>{d.description}</p>}
              </div>
              <p className="text-[14px] font-semibold" style={{ color: '#1A2333' }}>約{d.amount.toLocaleString()}円</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. Housing */}
      <Section icon={<Home size={18} />} title="住まい">
        {job.dorm.available ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[14px] font-bold" style={{ color: '#1A2333' }}>{job.dorm.type}</span>
              <span className="text-[14px]" style={{ color: '#5D6B82' }}>家賃 月{job.dorm.rent.toLocaleString()}円</span>
            </div>
            <p className="text-[14px]" style={{ color: '#5D6B82' }}>{job.dorm.details}</p>
          </div>
        ) : (
          <p className="text-[14px]" style={{ color: '#5D6B82' }}>寮なし。{job.dorm.details}</p>
        )}
      </Section>

      {/* 5. Commute */}
      <Section icon={<Clock size={18} />} title="通勤">
        <p className="text-[14px]" style={{ color: '#1A2333' }}>{job.commute}</p>
      </Section>

      {/* 6. Work conditions */}
      <Section icon={<Calendar size={18} />} title="休日・残業">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[12px] font-semibold" style={{ color: '#5D6B82' }}>年間休日（1年に休める日数）</p>
            <p className="text-[18px] font-bold" style={{ color: '#1A2333' }}>{job.annualHolidays}日</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: '#5D6B82' }}>残業</p>
            <p className="text-[14px] font-medium" style={{ color: '#1A2333' }}>{job.overtime}</p>
          </div>
        </div>
      </Section>

      {/* 7. Foreign support */}
      <Section icon={<Users size={18} />} title="外国人への支援">
        {job.foreignStaff > 0 && (
          <p className="text-[14px] mb-3" style={{ color: '#1A2333' }}>
            現在 <strong>{job.foreignStaff}名</strong> の外国人スタッフが働いています
          </p>
        )}
        <div className="flex flex-col gap-1.5">
          {job.supportItems.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Shield size={14} style={{ color: '#2D8A4E', marginTop: 2, flexShrink: 0 }} />
              <p className="text-[14px]" style={{ color: '#1A2333' }}>{item}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 8. Unanswered — Ask from Unknown */}
      {job.unansweredItems.length > 0 && (
        <Section icon={<HelpCircle size={18} />} title="確認が必要なこと">
          <p className="text-[13px] mb-3" style={{ color: '#5D6B82' }}>
            まだ回答がない項目です。応募後に質問できます。
          </p>
          <div className="flex flex-col gap-2">
            {job.unansweredItems.map((item) => (
              <div key={item} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#FDF6E3' }}>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} style={{ color: '#D4860A' }} />
                  <p className="text-[14px]" style={{ color: '#1A2333' }}>{item}</p>
                </div>
                {!pendingQs.includes(item) ? (
                  <button
                    onClick={() => addQuestion(item)}
                    className="text-[12px] font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#FFFFFF', color: '#D4860A', border: '1px solid #D4860A' }}
                  >
                    この点を聞く
                  </button>
                ) : (
                  <span className="text-[12px] font-medium" style={{ color: '#2D8A4E' }}>
                    <Check size={12} className="inline" /> 追加済み
                  </span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 9. Job description */}
      <Section icon={<Banknote size={18} />} title="仕事の内容">
        <p className="text-[15px] leading-[1.75]" style={{ color: '#1A2333' }}>{job.description}</p>
      </Section>

      {/* 10. Company values */}
      {job.companyValues && (
        <Section icon={<Users size={18} />} title="会社の考え方">
          <p className="text-[15px] leading-[1.75]" style={{ color: '#1A2333' }}>{job.companyValues}</p>
        </Section>
      )}

      {/* Career path */}
      {job.careerPath && (
        <Section icon={<ArrowRight size={18} />} title="キャリア（将来の仕事の道）">
          <p className="text-[15px]" style={{ color: '#1A2333' }}>{job.careerPath}</p>
        </Section>
      )}

      {/* Pending questions */}
      {pendingQs.length > 0 && (
        <div className="rounded-xl p-4 border mb-6" style={{ backgroundColor: '#FDF6E3', borderColor: '#F5DDA0' }}>
          <p className="text-[13px] font-semibold mb-2" style={{ color: '#D4860A' }}>
            応募後に聞く質問（{pendingQs.length}件）
          </p>
          <div className="flex flex-wrap gap-2">
            {pendingQs.map((q) => (
              <span key={q} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium" style={{ backgroundColor: '#FFFFFF', color: '#1A2333', border: '1px solid #D9E2EC' }}>
                {q}
                <button
                  onClick={() => dispatch({ type: 'REMOVE_PENDING_QUESTION', jobId: job.id, question: q })}
                  className="ml-1 text-[10px]"
                  aria-label={`${q}を削除`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      {!existingThread ? (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:relative md:mt-4 p-4 md:p-0"
          style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E5EAF0' }}
        >
          <div className="max-w-[960px] mx-auto">
            <Button variant="primary" fullWidth onClick={() => setShowApplyModal(true)}>
              応募する
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <Button variant="secondary" fullWidth onClick={() => navigate(`/candidate/messages/${existingThread.id}`)}>
            やり取りを見る
          </Button>
        </div>
      )}

      {/* Apply Modal */}
      <Modal open={showApplyModal} onClose={() => setShowApplyModal(false)} title="応募する">
        <div>
          <p className="text-[15px] mb-1" style={{ color: '#1A2333' }}>
            <strong>{job.companyName}</strong>に応募します
          </p>
          <p className="text-[13px] mb-4" style={{ color: '#5D6B82' }}>
            応募すると、会社とのやり取りが始まります。
            {pendingQs.length > 0 && `選んだ質問${pendingQs.length}件も、応募後に確認できます。`}
          </p>
          <textarea
            value={applyMessage}
            onChange={(e) => setApplyMessage(e.target.value)}
            className="w-full h-24 px-3 py-2 text-[14px] rounded-xl border resize-none mb-4"
            style={{ borderColor: '#D9E2EC' }}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>戻る</Button>
            <Button variant="primary" className="flex-1" onClick={handleApply}>応募する</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Section({ icon, title, children, accent }: { icon: React.ReactNode; title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <section
      className="rounded-2xl p-5 md:p-6 border mb-4"
      style={{
        backgroundColor: accent ? '#EAF7EE' : '#FFFFFF',
        borderColor: accent ? '#C6E7D0' : '#D9E2EC',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: '#1C6FB8' }}>{icon}</span>
        <h2 className="text-[17px] font-bold" style={{ color: '#1A2333' }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
