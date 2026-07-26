import { useDemo } from '../../state/DemoContext';
import { Check } from 'lucide-react';

export function InterpreterSchedule() {
  const { state, dispatch } = useDemo();

  const pendingRequests = state.threads
    .filter((t) => t.interpreterRequest?.status === 'pending')
    .map((t) => ({
      thread: t,
      request: t.interpreterRequest!,
    }));

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6 pb-10">
      <h1 className="text-[26px] font-bold mb-2" style={{ color: '#1A2333' }}>通訳予定</h1>
      <p className="text-[14px] mb-6" style={{ color: '#5D6B82' }}>通訳依頼の確認と空き枠の管理</p>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[18px] font-bold mb-4" style={{ color: '#1A2333' }}>
            通訳依頼（{pendingRequests.length}件）
          </h2>
          <div className="flex flex-col gap-3">
            {pendingRequests.map(({ thread, request }) => (
              <div key={thread.id} className="p-4 rounded-xl border" style={{ backgroundColor: '#FFFFFF', borderColor: '#D9E2EC' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[15px] font-semibold" style={{ color: '#1A2333' }}>
                      {thread.candidateName} × {thread.companyName}
                    </p>
                    <p className="text-[13px]" style={{ color: '#5D6B82' }}>
                      プラン：{request.plan === 'standard' ? '通常面接 30分 — 8,000円' : '条件確認面接 60分 — 15,000円'}
                    </p>
                    <p className="text-[13px] mt-1" style={{ color: '#5D6B82' }}>
                      候補日：{thread.interviewSlots.map((s) => `${s.dateJST} ${s.timeJST}`).join(' / ')}
                    </p>
                  </div>
                  <span className="text-[12px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FDF6E3', color: '#D4860A' }}>
                    確認待ち
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interpreter Availability Grid */}
      <section>
        <h2 className="text-[18px] font-bold mb-4" style={{ color: '#1A2333' }}>通訳空き枠</h2>
        <p className="text-[14px] mb-4" style={{ color: '#5D6B82' }}>
          枠をONにすると、企業側で予約可能な枠として表示されます
        </p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#D9E2EC' }}>
          {state.threads.flatMap((t) => t.interviewSlots).map((slot) => {
            const isAvailable = state.interpreterAvailability[slot.id] ?? slot.interpreterAvailable;
            return (
              <div key={slot.id} className="flex items-center justify-between p-4 border-b last:border-0" style={{ borderColor: '#E5EAF0' }}>
                <div>
                  <p className="text-[14px] font-medium" style={{ color: '#1A2333' }}>
                    {slot.dateJST} ({slot.dayOfWeek}) {slot.timeJST} JST
                  </p>
                  <p className="text-[12px]" style={{ color: '#5D6B82' }}>
                    {slot.timeIST} IST
                  </p>
                </div>
                <button
                  onClick={() => {
                    dispatch({
                      type: 'SET_INTERPRETER_AVAILABILITY',
                      slotId: slot.id,
                      available: !isAvailable,
                    });
                    dispatch({
                      type: 'SHOW_TOAST',
                      toast: {
                        message: `通訳枠を${!isAvailable ? 'ONに' : 'OFFに'}しました`,
                        type: 'info',
                      },
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors"
                  style={{
                    backgroundColor: isAvailable ? '#EAF7EE' : '#F7F8FA',
                    color: isAvailable ? '#2D8A4E' : '#5D6B82',
                  }}
                  aria-pressed={isAvailable}
                >
                  {isAvailable ? <><Check size={14} /> 空き</> : '不可'}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
