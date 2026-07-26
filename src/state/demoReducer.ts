import type { DemoState } from '../types';
import type { DemoAction } from './actions';

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'SWITCH_ROLE':
      return { ...state, currentRole: action.role };

    case 'RESET_DEMO':
      return { ...action.state };

    case 'TOGGLE_FAVORITE_CANDIDATE': {
      const ids = state.favorites.candidateIds;
      const has = ids.includes(action.candidateId);
      return {
        ...state,
        favorites: {
          ...state.favorites,
          candidateIds: has
            ? ids.filter((id) => id !== action.candidateId)
            : [...ids, action.candidateId],
        },
      };
    }

    case 'TOGGLE_FAVORITE_JOB': {
      const ids = state.favorites.jobIds;
      const has = ids.includes(action.jobId);
      return {
        ...state,
        favorites: {
          ...state.favorites,
          jobIds: has
            ? ids.filter((id) => id !== action.jobId)
            : [...ids, action.jobId],
        },
      };
    }

    case 'SCOUT_CANDIDATE': {
      const candidate = state.candidates.find((c) => c.id === action.candidateId);
      const job = state.jobs.find((j) => j.id === action.jobId);
      if (!candidate || !job) return state;

      const newThread = {
        id: `t-${Date.now()}`,
        candidateId: action.candidateId,
        jobId: action.jobId,
        companyId: job.companyId,
        origin: 'scout' as const,
        status: 'contact_created' as const,
        nextAction: {
          label: '候補者の返信を待つ',
          assignee: 'candidate' as const,
          description: `${candidate.name}さんからの返信を待っています`,
          ctaLabel: 'やり取りを見る',
          ctaRoute: '',
          estimatedTime: '',
        },
        messages: [
          {
            id: `m-${Date.now()}-1`,
            sender: 'system' as const,
            senderName: 'システム',
            content: `${job.companyName}が${candidate.name}さんにスカウトを送りました`,
            timestamp: new Date().toISOString(),
            isSystemEvent: true,
          },
          {
            id: `m-${Date.now()}-2`,
            sender: 'company' as const,
            senderName: job.companyName,
            content: action.message,
            timestamp: new Date().toISOString(),
            isSystemEvent: false,
          },
        ],
        interviewSlots: [],
        interpreterRequest: null,
        offerSteps: [],
        lastActivityAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        candidateName: candidate.name,
        companyName: job.companyName,
        jobTitle: job.title,
      };

      newThread.nextAction.ctaRoute = `/company/messages/${newThread.id}`;

      const newNotification = {
        id: `n-${Date.now()}`,
        type: 'scout' as const,
        title: 'スカウトが届きました',
        description: `${job.companyName}からお話の依頼が届いています`,
        route: `/candidate/messages/${newThread.id}`,
        read: false,
        timestamp: new Date().toISOString(),
        forRole: 'candidate' as const,
      };

      return {
        ...state,
        threads: [...state.threads, newThread],
        notifications: [newNotification, ...state.notifications],
      };
    }

    case 'APPLY_TO_JOB': {
      const candidate = state.candidates.find((c) => c.id === action.candidateId);
      const job = state.jobs.find((j) => j.id === action.jobId);
      if (!candidate || !job) return state;

      const newThread = {
        id: `t-${Date.now()}`,
        candidateId: action.candidateId,
        jobId: action.jobId,
        companyId: job.companyId,
        origin: 'application' as const,
        status: 'contact_created' as const,
        nextAction: {
          label: '企業の返信を待つ',
          assignee: 'company' as const,
          description: `${job.companyName}からの返信を待っています`,
          ctaLabel: 'やり取りを見る',
          ctaRoute: '',
          estimatedTime: '',
        },
        messages: [
          {
            id: `m-${Date.now()}-1`,
            sender: 'system' as const,
            senderName: 'システム',
            content: `${candidate.name}さんが${job.companyName}に応募しました`,
            timestamp: new Date().toISOString(),
            isSystemEvent: true,
          },
          {
            id: `m-${Date.now()}-2`,
            sender: 'candidate' as const,
            senderName: candidate.name,
            content: action.message + (action.questions.length > 0 ? '\n\n【質問】\n' + action.questions.join('\n') : ''),
            timestamp: new Date().toISOString(),
            isSystemEvent: false,
          },
        ],
        interviewSlots: [],
        interpreterRequest: null,
        offerSteps: [],
        lastActivityAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        candidateName: candidate.name,
        companyName: job.companyName,
        jobTitle: job.title,
      };

      newThread.nextAction.ctaRoute = `/candidate/messages/${newThread.id}`;

      const newNotification = {
        id: `n-${Date.now()}`,
        type: 'application' as const,
        title: '新しい応募が届きました',
        description: `${candidate.name}さんが${job.title}に応募しました`,
        route: `/company/messages/${newThread.id}`,
        read: false,
        timestamp: new Date().toISOString(),
        forRole: 'company' as const,
      };

      return {
        ...state,
        threads: [...state.threads, newThread],
        notifications: [newNotification, ...state.notifications],
      };
    }

    case 'SEND_MESSAGE': {
      const now = new Date().toISOString();
      const senderNames: Record<string, string> = {
        company: state.companyProfile.name,
        candidate: '候補者',
        admin: 'MiraiWay運営',
      };
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId
            ? {
                ...t,
                messages: [
                  ...t.messages,
                  {
                    id: `m-${Date.now()}`,
                    sender: action.sender,
                    senderName: senderNames[action.sender] || action.sender,
                    content: action.content,
                    timestamp: now,
                    isSystemEvent: false,
                  },
                ],
                lastActivityAt: now,
              }
            : t
        ),
      };
    }

    case 'SET_THREAD_STATUS': {
      const now = new Date().toISOString();
      const statusLabels: Record<string, string> = {
        contact_created: '接点作成',
        waiting_reply: '返信待ち',
        interview_scheduling: '面接調整中',
        offer: '内定',
        onboarding: '入社準備中',
        onboarded: '入社済み',
      };
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId
            ? {
                ...t,
                status: action.status,
                lastActivityAt: now,
                messages: [
                  ...t.messages,
                  {
                    id: `m-sys-${Date.now()}`,
                    sender: 'system',
                    senderName: 'システム',
                    content: `ステータスが「${statusLabels[action.status]}」に進みました`,
                    timestamp: now,
                    isSystemEvent: true,
                  },
                ],
              }
            : t
        ),
      };
    }

    case 'SET_NEXT_ACTION':
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId ? { ...t, nextAction: action.nextAction } : t
        ),
      };

    case 'PROPOSE_INTERVIEW_SLOTS':
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId
            ? {
                ...t,
                status: 'interview_scheduling',
                messages: [
                  ...t.messages,
                  {
                    id: `m-sys-${Date.now()}`,
                    sender: 'system',
                    senderName: 'システム',
                    content: '面接候補日が送られました',
                    timestamp: new Date().toISOString(),
                    isSystemEvent: true,
                  },
                ],
                lastActivityAt: new Date().toISOString(),
              }
            : t
        ),
      };

    case 'CONFIRM_INTERVIEW_SLOT': {
      const now = new Date().toISOString();
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId
            ? {
                ...t,
                interviewSlots: t.interviewSlots.map((s) => ({
                  ...s,
                  confirmed: s.id === action.slotId,
                })),
                messages: [
                  ...t.messages,
                  {
                    id: `m-sys-${Date.now()}`,
                    sender: 'system',
                    senderName: 'システム',
                    content: '面接日時が確定しました',
                    timestamp: now,
                    isSystemEvent: true,
                  },
                ],
                lastActivityAt: now,
                nextAction: {
                  label: '面接を実施',
                  assignee: 'company',
                  description: '確定した日時で面接を行ってください',
                  ctaLabel: '面接詳細を見る',
                  ctaRoute: `/company/interviews/${action.threadId}`,
                },
              }
            : t
        ),
      };
    }

    case 'REQUEST_INTERPRETER': {
      const now = new Date().toISOString();
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId
            ? {
                ...t,
                interpreterRequest: {
                  plan: action.plan,
                  status: 'pending',
                },
                messages: [
                  ...t.messages,
                  {
                    id: `m-sys-${Date.now()}`,
                    sender: 'system',
                    senderName: 'システム',
                    content: `通訳同席がリクエストされました（${action.plan === 'standard' ? '通常面接 30分' : '条件確認面接 60分'}）`,
                    timestamp: now,
                    isSystemEvent: true,
                  },
                ],
                lastActivityAt: now,
              }
            : t
        ),
      };
    }

    case 'SET_INTERPRETER_AVAILABILITY':
      return {
        ...state,
        interpreterAvailability: {
          ...state.interpreterAvailability,
          [action.slotId]: action.available,
        },
      };

    case 'CONFIRM_INTERPRETER_SLOT':
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId && t.interpreterRequest
            ? {
                ...t,
                interpreterRequest: {
                  ...t.interpreterRequest,
                  status: 'confirmed',
                  confirmedSlotId: action.slotId,
                },
              }
            : t
        ),
      };

    case 'COMPLETE_OFFER_STEP': {
      const now = new Date().toISOString();
      return {
        ...state,
        threads: state.threads.map((t) => {
          if (t.id !== action.threadId) return t;
          const steps = t.offerSteps.map((s, i, arr) => {
            if (s.id === action.stepId) {
              return { ...s, status: 'completed' as const, completedAt: now };
            }
            const prevIdx = arr.findIndex((x) => x.id === action.stepId);
            if (i === prevIdx + 1 && s.status === 'upcoming') {
              return { ...s, status: 'current' as const };
            }
            return s;
          });
          const allDone = steps.every((s) => s.status === 'completed');
          return {
            ...t,
            offerSteps: steps,
            status: allDone ? 'onboarded' : t.status,
            lastActivityAt: now,
          };
        }),
      };
    }

    case 'TOGGLE_CANDIDATE_PUBLISHED':
      return {
        ...state,
        candidates: state.candidates.map((c) =>
          c.id === action.candidateId ? { ...c, published: !c.published } : c
        ),
      };

    case 'ADD_PENDING_QUESTION': {
      const existing = state.pendingQuestions[action.jobId] || [];
      if (existing.includes(action.question)) return state;
      return {
        ...state,
        pendingQuestions: {
          ...state.pendingQuestions,
          [action.jobId]: [...existing, action.question],
        },
      };
    }

    case 'REMOVE_PENDING_QUESTION': {
      const existing = state.pendingQuestions[action.jobId] || [];
      return {
        ...state,
        pendingQuestions: {
          ...state.pendingQuestions,
          [action.jobId]: existing.filter((q) => q !== action.question),
        },
      };
    }

    case 'ADD_FEEDBACK':
      return {
        ...state,
        feedbackEntries: [...state.feedbackEntries, action.entry],
      };

    case 'SHOW_TOAST':
      return { ...state, ui: { ...state.ui, toast: action.toast } };

    case 'DISMISS_TOAST':
      return { ...state, ui: { ...state.ui, toast: null } };

    case 'SHOW_MODAL':
      return { ...state, ui: { ...state.ui, modal: action.modal } };

    case 'DISMISS_MODAL':
      return { ...state, ui: { ...state.ui, modal: null } };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.notification, ...state.notifications],
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.notificationId ? { ...n, read: true } : n
        ),
      };

    case 'COMPLETE_ONBOARDING':
      return { ...state, hasCompletedOnboarding: true };

    case 'REGISTER_ONBOARDING_USER': {
      let updatedCompany = state.companyProfile;
      let updatedCandidates = state.candidates;

      if (action.role === 'company' && action.name.trim()) {
        updatedCompany = { ...state.companyProfile, name: action.name.trim() };
      }

      return {
        ...state,
        currentRole: action.role,
        companyProfile: updatedCompany,
        candidates: updatedCandidates,
        hasCompletedOnboarding: true,
      };
    }

    default:
      return state;
  }
}
