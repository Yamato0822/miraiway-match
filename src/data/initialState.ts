import type { DemoState } from '../types';
import { candidates } from './candidates';
import { jobs, companyProfile } from './jobs';
import { threads, notifications } from './threads';

export const DEMO_STATE_VERSION = 7;

export const initialDemoState: DemoState = {
  version: DEMO_STATE_VERSION,
  currentRole: 'company',
  candidates,
  jobs,
  companyProfile,
  threads,
  notifications,
  favorites: {
    candidateIds: ['c1'],
    jobIds: [],
  },
  interpreterAvailability: {
    'slot1': false,
    'slot2': true,
    'slot3': true,
  },
  feedbackEntries: [],
  pendingQuestions: {},
  hasCompletedOnboarding: false,
  ui: {
    toast: null,
    modal: null,
  },
};
