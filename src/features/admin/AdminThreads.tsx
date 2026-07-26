import { useDemo } from '../../state/DemoContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertTriangle } from 'lucide-react';

export function AdminThreads() {
  const { state } = useDemo();
  const navigate = useNavigate();

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6 pb-10">
      <h1 className="text-[26px] font-bold mb-2" style={{ color: '#1A2333' }}>やり取り管理</h1>
      <p className="text-[14px] mb-6" style={{ color: '#5D6B82' }}>全選考スレッドの進捗と停滞状況</p>

      <div className="flex flex-col gap-3">
        {state.threads.map((t) => {
          const days = Math.floor((Date.now() - new Date(t.lastActivityAt).getTime()) / 86400000);
          const isStalled = days >= 3 && t.status !== 'onboarded';
          return (
            <div
              key={t.id}
              onClick={() => navigate(`/admin/home`)}
              className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-shadow"
              style={{ backgroundColor: '#FFFFFF', borderColor: isStalled ? '#F5DDA0' : '#D9E2EC' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-semibold" style={{ color: '#1A2333' }}>
                    {t.candidateName} × {t.companyName}
                  </p>
                  <p className="text-[13px]" style={{ color: '#5D6B82' }}>{t.jobTitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EAF3FB', color: '#1C6FB8' }}>
                      {t.status}
                    </span>
                    {isStalled && (
                      <span className="text-[12px] font-medium flex items-center gap-1" style={{ color: '#D93025' }}>
                        <AlertTriangle size={12} /> {days}日停滞
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight size={16} style={{ color: '#D9E2EC' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
