/* ===== Types for MiraiWay Match ===== */

export type Role = 'company' | 'candidate' | 'admin';

export type EvidenceItem = {
  icon: string;
  label: string;
  value: string;
};

export type LearningEntry = {
  month: string;
  hours: number;
  topic: string;
  teacherNote: string;
  milestone?: string;
};

export type Exam = {
  name: string;
  passed: boolean;
  date?: string;
};

export type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
};

export type Candidate = {
  id: string;
  name: string;
  nameEn: string;
  field: string;
  subField: string;
  japaneseLevel: string;
  studyHours: number;
  exams: Exam[];
  desiredLocations: string[];
  desiredSalary: number;
  startTiming: string;
  dormPreference: boolean;
  storyHeadline: string;
  workAspiration: string;
  shortStory: string;
  miraiwayNote: string;
  videoDuration: string;
  visualType: 'video' | 'photo' | 'learning';
  recommendationReasons: string[];
  evidenceItems: EvidenceItem[];
  questionsToConfirm: string[];
  learningTimeline: LearningEntry[];
  experiences: Experience[];
  specialConsiderations: string;
  published: boolean;
  isNew: boolean;
  photoUrl: string;
  coverUrl: string;
  selfIntro: string;
  age: number;
  academiaCompleted: boolean;
};

export type Deduction = {
  name: string;
  amount: number;
  description?: string;
};

export type DormInfo = {
  available: boolean;
  type: string;
  rent: number;
  details: string;
};

export type Job = {
  id: string;
  companyId: string;
  title: string;
  field: string;
  location: string;
  salary: { min: number; max: number };
  takeHomePay: { min: number; max: number };
  deductions: Deduction[];
  dorm: DormInfo;
  commute: string;
  annualHolidays: number;
  overtime: string;
  foreignStaff: number;
  supportItems: string[];
  unansweredItems: string[];
  storyHeadline: string;
  description: string;
  photoUrl: string;
  isNew: boolean;
  startTiming: string;
  japaneseRequirement: string;
  dormPreference: boolean;
  memberPhotos: string[];
  companyValues: string;
  companyName: string;
  careerPath: string;
};

export type CompanyProfile = {
  id: string;
  name: string;
  industry: string;
  location: string;
  employeeCount: number;
  foreignEmployeeCount: number;
  description: string;
  values: string;
  logoUrl: string;
  coverUrl: string;
  completeness: {
    money: { complete: boolean; missing: number };
    housing: { complete: boolean; missing: number };
    work: { complete: boolean; missing: number };
    support: { complete: boolean; missing: number };
  };
};

export type ThreadStatus =
  | 'contact_created'
  | 'waiting_reply'
  | 'interview_scheduling'
  | 'offer'
  | 'onboarding'
  | 'onboarded';

export type NextAction = {
  label: string;
  assignee: 'company' | 'candidate' | 'admin';
  description: string;
  ctaLabel: string;
  ctaRoute: string;
  estimatedTime?: string;
};

export type MessageSender = 'company' | 'candidate' | 'admin' | 'system';

export type Message = {
  id: string;
  sender: MessageSender;
  senderName: string;
  content: string;
  timestamp: string;
  isSystemEvent: boolean;
};

export type InterviewSlot = {
  id: string;
  dateJST: string;
  timeJST: string;
  dateIST: string;
  timeIST: string;
  dayOfWeek: string;
  companyAvailable: boolean;
  candidateAvailable: boolean;
  interpreterAvailable: boolean;
  confirmed: boolean;
};

export type InterpreterPlan = 'standard' | 'detailed';

export type InterpreterRequest = {
  plan: InterpreterPlan;
  status: 'pending' | 'confirmed' | 'completed';
  confirmedSlotId?: string;
};

export type OfferStepStatus = 'completed' | 'current' | 'upcoming';

export type OfferStep = {
  id: string;
  name: string;
  estimatedDays: string;
  status: OfferStepStatus;
  mainActor: string;
  miraiwaySupport: string;
  companyTask: string;
  candidateTask: string;
  requiredDocs: string[];
  completedAt?: string;
};

export type Thread = {
  id: string;
  candidateId: string;
  jobId: string;
  companyId: string;
  origin: 'scout' | 'application';
  status: ThreadStatus;
  nextAction: NextAction;
  messages: Message[];
  interviewSlots: InterviewSlot[];
  interpreterRequest: InterpreterRequest | null;
  offerSteps: OfferStep[];
  lastActivityAt: string;
  createdAt: string;
  candidateName: string;
  companyName: string;
  jobTitle: string;
};

export type Notification = {
  id: string;
  type: 'scout' | 'application' | 'message' | 'interview' | 'offer' | 'system';
  title: string;
  description: string;
  route: string;
  read: boolean;
  timestamp: string;
  forRole: Role;
};

export type FeedbackEntry = {
  id: string;
  respondentType: string;
  currentPage: string;
  clarity: number;
  goodPoints: string;
  confusingPoints: string;
  missingInfo: string;
  wouldUse: 'yes' | 'considering' | 'no';
  timestamp: string;
};

export type ToastState = {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  action?: { label: string; route: string };
};

export type ModalState = {
  type: string;
  props: Record<string, unknown>;
};

export type MatchResult = {
  field: string;
  label: string;
  status: 'matched' | 'needs_check' | 'not_matched';
  detail: string;
};

export type MatchSummary = {
  matched: MatchResult[];
  needsCheck: MatchResult[];
  notMatched: MatchResult[];
};

export type FilterState = {
  keyword: string;
  fields: string[];
  locations: string[];
  startTiming: string[];
  japaneseLevel: string[];
  dormPreference: string;
  salaryMin: number | null;
  academiaCompleted: boolean | null;
};

export type SortOption = 'match' | 'newest' | 'study';

export type DiscoveryTab = 'recommended' | 'newest' | 'academia' | 'favorites';

export type DemoState = {
  version: number;
  currentRole: Role;
  candidates: Candidate[];
  jobs: Job[];
  companyProfile: CompanyProfile;
  threads: Thread[];
  notifications: Notification[];
  favorites: {
    candidateIds: string[];
    jobIds: string[];
  };
  interpreterAvailability: Record<string, boolean>;
  feedbackEntries: FeedbackEntry[];
  pendingQuestions: Record<string, string[]>;
  hasCompletedOnboarding: boolean;
  ui: {
    toast: ToastState | null;
    modal: ModalState | null;
  };
};
