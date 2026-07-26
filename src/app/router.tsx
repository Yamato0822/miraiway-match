import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './AppShell';

// Company
import { CompanyHome } from '../features/company/CompanyHome';
import { CandidateDiscovery } from '../features/company/CandidateDiscovery';
import { CandidateDetail } from '../features/company/CandidateDetail';
import { CompanyPage } from '../features/company/CompanyPage';

// Candidate
import { CandidateHome } from '../features/candidate/CandidateHome';
import { JobDiscovery } from '../features/candidate/JobDiscovery';
import { JobDetail } from '../features/candidate/JobDetail';
import { CandidateProfile } from '../features/candidate/CandidateProfile';

// Shared / Messages / Interviews / Offer
import { MessagesPage } from '../features/messages/MessagesPage';
import { InterviewPage } from '../features/interviews/InterviewPage';
import { OfferFlowPage } from '../features/offer-flow/OfferFlowPage';

// Admin
import { AdminHome } from '../features/admin/AdminHome';
import { AdminCandidates } from '../features/admin/AdminCandidates';
import { AdminThreads } from '../features/admin/AdminThreads';
import { InterpreterSchedule } from '../features/admin/InterpreterSchedule';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/company/home" replace /> },

      // Company routes
      { path: 'company/home', element: <CompanyHome /> },
      { path: 'company/candidates', element: <CandidateDiscovery /> },
      { path: 'company/candidates/:id', element: <CandidateDetail /> },
      { path: 'company/messages', element: <MessagesPage /> },
      { path: 'company/messages/:threadId', element: <MessagesPage /> },
      { path: 'company/interviews/:threadId', element: <InterviewPage /> },
      { path: 'company/offer-flow', element: <OfferFlowPage /> },
      { path: 'company/offer-flow/:threadId', element: <OfferFlowPage /> },
      { path: 'company/page', element: <CompanyPage /> },

      // Candidate routes
      { path: 'candidate/home', element: <CandidateHome /> },
      { path: 'candidate/jobs', element: <JobDiscovery /> },
      { path: 'candidate/jobs/:jobId', element: <JobDetail /> },
      { path: 'candidate/messages', element: <MessagesPage /> },
      { path: 'candidate/messages/:threadId', element: <MessagesPage /> },
      { path: 'candidate/interviews/:threadId', element: <InterviewPage /> },
      { path: 'candidate/profile', element: <CandidateProfile /> },

      // Admin routes
      { path: 'admin/home', element: <AdminHome /> },
      { path: 'admin/candidates', element: <AdminCandidates /> },
      { path: 'admin/threads', element: <AdminThreads /> },
      { path: 'admin/interpreter', element: <InterpreterSchedule /> },

      // Fallback
      { path: '*', element: <Navigate to="/company/home" replace /> },
    ],
  },
]);
