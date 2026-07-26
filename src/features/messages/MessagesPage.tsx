import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/DemoContext';
import { Button } from '../../components/common/Button';
import { CandidateAvatar } from '../../components/common/CandidateAvatar';
import { ArrowLeft, Send, Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Thread, Message } from '../../types';

export function MessagesPage() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId: string }>();
  const role = state.currentRole;

  const myThreads = state.threads;
  const selectedThread = threadId ? myThreads.find((t) => t.id === threadId) : null;
  const showList = !threadId;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1280px] mx-auto flex h-[calc(100vh-64px)] px-4 md:px-8 py-4 gap-6"
    >
      {/* Thread List Sidebar */}
      <div
        className={`${showList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[320px] apple-card shrink-0 overflow-hidden`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[18px] font-extrabold text-[#0F172A]">メッセージ一覧</h2>
          <span className="text-[13px] font-bold text-[#0071E3] bg-slate-100 px-2.5 py-0.5 rounded-md">
            {myThreads.length}件
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
          {myThreads.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[14px] font-semibold text-[#64748B]">まだやり取りはありません</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => navigate(role === 'company' ? '/company/candidates' : '/candidate/jobs')}
              >
                {role === 'company' ? '候補者を探す' : '仕事を探す'}
              </Button>
            </div>
          ) : (
            myThreads.map((t) => {
              const isActive = t.id === threadId;
              const daysSince = Math.floor((Date.now() - new Date(t.lastActivityAt).getTime()) / 86400000);
              const statusLabels: Record<string, string> = {
                contact_created: '接点作成',
                waiting_reply: '返信待ち',
                interview_scheduling: '面接調整中',
                offer: '内定',
                onboarding: '入社準備中',
                onboarded: '入社済み',
              };
              const basePath = `/${role}/messages/${t.id}`;
              const candidateObj = state.candidates.find((c) => c.id === t.candidateId);

              return (
                <button
                  key={t.id}
                  onClick={() => navigate(basePath)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 border-slate-300 text-[#0F172A] shadow-sm'
                      : 'bg-white border-transparent text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <CandidateAvatar
                      src={candidateObj?.photoUrl}
                      name={t.candidateName}
                      candidateId={t.candidateId}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[14.5px] font-bold text-[#0F172A] truncate">
                          {role === 'company' ? t.candidateName : t.companyName}
                        </p>
                        <span className="text-[11px] font-bold text-[#64748B] shrink-0">
                          {daysSince === 0 ? '今日' : `${daysSince}日前`}
                        </span>
                      </div>
                      <p className="text-[12.5px] font-semibold text-[#64748B] truncate mt-0.5">{t.jobTitle}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#0071E3]">
                          {statusLabels[t.status]}
                        </span>
                        {t.nextAction.assignee === role && (
                          <span className="text-[11px] font-bold text-[#B45309] bg-amber-500/10 px-2 py-0.5 rounded">
                            要対応
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Thread Detail Main Area */}
      <div className={`${!showList ? 'flex' : 'hidden'} md:flex flex-col flex-1 min-w-0 apple-card overflow-hidden`}>
        {selectedThread ? (
          <ThreadDetail thread={selectedThread} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <p className="text-[16px] font-bold text-[#0F172A]">やり取りを選択してください</p>
            <p className="text-[14px] text-[#64748B] mt-1 font-medium">左側のメッセージ一覧からスレッドを選ぶと対話を開始できます</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ThreadDetail({ thread }: { thread: Thread }) {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const role = state.currentRole;
  const [newMessage, setNewMessage] = useState('');
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages.length]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setShowSendConfirm(true);
  };

  const confirmSend = () => {
    dispatch({
      type: 'SEND_MESSAGE',
      threadId: thread.id,
      content: newMessage,
      sender: role as 'company' | 'candidate' | 'admin',
    });
    setNewMessage('');
    setShowSendConfirm(false);
  };

  const statusLabels: Record<string, string> = {
    contact_created: '接点作成',
    waiting_reply: '返信待ち',
    interview_scheduling: '面接調整中',
    offer: '内定確定',
    onboarding: '入社準備中',
    onboarded: '入社済み',
  };

  const candidateObj = state.candidates.find((c) => c.id === thread.candidateId);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/${role}/messages`)}
            className="md:hidden p-1 text-[#64748B] hover:text-[#0F172A]"
            aria-label="戻る"
          >
            <ArrowLeft size={20} />
          </button>
          <CandidateAvatar
            src={candidateObj?.photoUrl}
            name={thread.candidateName}
            candidateId={thread.candidateId}
            size="md"
          />
          <div>
            <h3 className="text-[17px] font-extrabold text-[#0F172A] leading-tight">
              {role === 'company' ? thread.candidateName : thread.companyName}
            </h3>
            <p className="text-[13px] text-[#64748B] font-semibold">{thread.jobTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {thread.status === 'interview_scheduling' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/${role}/interviews/${thread.id}`)}
            >
              <Calendar size={15} /> 面接日程の調整へ
            </Button>
          )}
          {(thread.status === 'offer' || thread.status === 'onboarding') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/${role}/offer-flow/${thread.id}`)}
            >
              <ShieldCheck size={15} /> 入社手続きへ
            </Button>
          )}
        </div>
      </div>

      {/* Action Prompt Banner (Strict 4 Colors) */}
      <div className="px-6 py-3.5 bg-amber-500/10 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[12px] font-bold text-[#B45309] uppercase tracking-wider block">
            {statusLabels[thread.status]}
          </span>
          <p className="text-[14.5px] font-bold text-[#0F172A] mt-0.5">
            次にやること：{thread.nextAction.label}
          </p>
        </div>

        {thread.nextAction.assignee === role && thread.nextAction.ctaRoute && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(thread.nextAction.ctaRoute)}
          >
            {thread.nextAction.ctaLabel}
          </Button>
        )}
      </div>

      {/* Chat Log Stream */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
        <div className="max-w-[720px] mx-auto flex flex-col gap-4">
          {thread.messages.map((msg: Message) => {
            if (msg.isSystemEvent) {
              return (
                <div key={msg.id} className="text-center py-2">
                  <span className="inline-block text-[12.5px] font-bold px-3 py-1 rounded-full bg-white text-[#64748B] border border-slate-200 shadow-sm">
                    {msg.content}
                  </span>
                </div>
              );
            }
            const isMe = msg.sender === role;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[78%] rounded-2xl p-4 shadow-sm ${
                    isMe
                      ? 'bg-[#0071E3] text-white rounded-br-xs'
                      : 'bg-white text-[#0F172A] border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className={`text-[12px] font-bold mb-1 ${isMe ? 'text-white/80' : 'text-[#64748B]'}`}>
                    {msg.senderName}
                  </p>
                  <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
                  <p className={`text-[10.5px] mt-1.5 text-right font-semibold ${isMe ? 'text-white/70' : 'text-[#64748B]'}`}>
                    {new Date(msg.timestamp).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Composer Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-end gap-3 max-w-[800px] mx-auto">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力してください..."
            className="flex-1 px-4 py-3 text-[14.5px] font-medium rounded-xl border border-slate-200 resize-none min-h-[48px] max-h-[120px] focus:outline-none focus:border-[#0071E3] shadow-sm"
            rows={1}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            aria-label="送信"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>

      {/* Send Confirmation Modal */}
      {showSendConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[420px] w-full shadow-2xl border border-slate-200">
            <h3 className="text-[18px] font-extrabold text-[#0F172A] mb-2">メッセージを送信しますか？</h3>
            <p className="text-[14px] font-medium p-3.5 rounded-xl bg-slate-50 text-[#0F172A] border border-slate-200 whitespace-pre-wrap mb-5">
              {newMessage}
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowSendConfirm(false)}>戻る</Button>
              <Button variant="primary" className="flex-1" onClick={confirmSend}>送信する</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
