import type { DemoState, Role, ToastState, ModalState, FeedbackEntry, Notification } from '../types';

export type DemoAction =
  | { type: 'SWITCH_ROLE'; role: Role }
  | { type: 'RESET_DEMO'; state: DemoState }
  | { type: 'TOGGLE_FAVORITE_CANDIDATE'; candidateId: string }
  | { type: 'TOGGLE_FAVORITE_JOB'; jobId: string }
  | { type: 'SEND_SCOUT'; candidateId: string; jobId: string; message: string; questions?: string[] }
  | { type: 'SCOUT_CANDIDATE'; candidateId: string; jobId: string; message: string; questions?: string[] }
  | { type: 'APPLY_TO_JOB'; jobId: string; candidateId: string; message: string; questions: string[] }
  | { type: 'SEND_MESSAGE'; threadId: string; content: string; sender: 'company' | 'candidate' | 'admin' }
  | { type: 'PROPOSE_INTERVIEW_SLOTS'; threadId: string }
  | { type: 'CONFIRM_INTERVIEW_SLOT'; threadId: string; slotId: string }
  | { type: 'REQUEST_INTERPRETER'; threadId: string; plan: 'standard' | 'detailed' }
  | { type: 'SET_INTERPRETER_AVAILABILITY'; slotId: string; available: boolean }
  | { type: 'CONFIRM_INTERPRETER_SLOT'; threadId: string; slotId: string }
  | { type: 'COMPLETE_OFFER_STEP'; threadId: string; stepId: string }
  | { type: 'SET_THREAD_STATUS'; threadId: string; status: DemoState['threads'][0]['status'] }
  | { type: 'SET_NEXT_ACTION'; threadId: string; nextAction: DemoState['threads'][0]['nextAction'] }
  | { type: 'TOGGLE_CANDIDATE_PUBLISHED'; candidateId: string }
  | { type: 'ADD_PENDING_QUESTION'; jobId: string; question: string }
  | { type: 'REMOVE_PENDING_QUESTION'; jobId: string; question: string }
  | { type: 'ADD_FEEDBACK'; entry: FeedbackEntry }
  | { type: 'SHOW_TOAST'; toast: ToastState }
  | { type: 'DISMISS_TOAST' }
  | { type: 'SHOW_MODAL'; modal: ModalState }
  | { type: 'DISMISS_MODAL' }
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; notificationId: string }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'REGISTER_ONBOARDING_USER'; role: Role; name: string; field?: string };
