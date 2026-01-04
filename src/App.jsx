import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import { ToastProvider } from './shared/context/ToastContext';
import { ThemeProvider } from './shared/context/ThemeContext';
import { migrateStorage } from './shared/utils/migration';

// Lazy Load Pages
const Home = lazy(() => import('./features/core/pages/Home').then(m => ({ default: m.Home })));
const Setup = lazy(() => import('./features/interview/pages/Setup').then(m => ({ default: m.Setup })));
const Interview = lazy(() => import('./features/interview/pages/Interview').then(m => ({ default: m.Interview })));
const Feedback = lazy(() => import('./features/interview/pages/Feedback').then(m => ({ default: m.Feedback })));
const SystemDesign = lazy(() => import('./features/whiteboard/pages/SystemDesign').then(m => ({ default: m.SystemDesign })));
const P2PInterview = lazy(() => import('./features/interview/pages/P2PInterview').then(m => ({ default: m.P2PInterview })));
const History = lazy(() => import('./features/interview/pages/History').then(m => ({ default: m.History })));
const ResumeOptimizer = lazy(() => import('./features/toolkit/pages/ResumeOptimizer').then(m => ({ default: m.ResumeOptimizer })));
const Dashboard = lazy(() => import('./features/core/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const CollaborativeWhiteboard = lazy(() => import('./features/whiteboard/pages/CollaborativeWhiteboard').then(m => ({ default: m.CollaborativeWhiteboard })));
const CodeCompiler = lazy(() => import('./features/coding/pages/CodeCompiler').then(m => ({ default: m.CodeCompiler })));
const Settings = lazy(() => import('./features/core/pages/Settings').then(m => ({ default: m.Settings })));
const Flashcards = lazy(() => import('./features/prep/pages/Flashcards').then(m => ({ default: m.Flashcards })));
const BugHunt = lazy(() => import('./features/coding/pages/BugHunt').then(m => ({ default: m.BugHunt })));
const CompanySprints = lazy(() => import('./features/resources/pages/CompanySprints').then(m => ({ default: m.CompanySprints })));
const BehavioralPrep = lazy(() => import('./features/prep/pages/BehavioralPrep').then(m => ({ default: m.BehavioralPrep })));
const Roadmaps = lazy(() => import('./features/resources/pages/Roadmaps').then(m => ({ default: m.Roadmaps })));
const Blogs = lazy(() => import('./features/resources/pages/Blogs').then(m => ({ default: m.Blogs })));
const NegotiationSimulator = lazy(() => import('./features/prep/pages/NegotiationSimulator').then(m => ({ default: m.NegotiationSimulator })));
const PitchCoach = lazy(() => import('./features/prep/pages/PitchCoach').then(m => ({ default: m.PitchCoach })));
const ReferralEngine = lazy(() => import('./features/toolkit/pages/ReferralEngine').then(m => ({ default: m.ReferralEngine })));
const Vault = lazy(() => import('./features/toolkit/pages/Vault').then(m => ({ default: m.Vault })));
const SurvivalKit = lazy(() => import('./features/toolkit/pages/SurvivalKit').then(m => ({ default: m.SurvivalKit })));
const PreFlight = lazy(() => import('./features/interview/pages/PreFlight').then(m => ({ default: m.PreFlight })));
const Auth = lazy(() => import('./features/core/components/Auth').then(m => ({ default: m.Auth })));

// Run storage migration
migrateStorage();

const PageLoader = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="w-16 h-16 border-4 border-primary-100 dark:border-primary-900/30 border-t-primary-600 dark:border-t-primary-500 rounded-full animate-spin mb-4" />
    <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Initializing your session...</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/setup" element={
                  <ProtectedRoute>
                    <Setup />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/interview" element={
                  <ProtectedRoute>
                    <Interview />
                  </ProtectedRoute>
                } />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/system-design" element={
                  <ProtectedRoute>
                    <SystemDesign />
                  </ProtectedRoute>
                } />
                <Route path="/p2p" element={
                  <ProtectedRoute>
                    <P2PInterview />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } />
                <Route path="/resume-optimizer" element={<ResumeOptimizer />} />
                <Route path="/collaborative-whiteboard" element={<CollaborativeWhiteboard />} />
                <Route path="/compiler" element={<CodeCompiler />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/bug-hunt" element={<BugHunt />} />
                <Route path="/company-sprints" element={<CompanySprints />} />
                <Route path="/behavioral-prep" element={<BehavioralPrep />} />
                <Route path="/roadmaps" element={<Roadmaps />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/negotiate" element={<NegotiationSimulator />} />
                <Route path="/pitch-coach" element={<PitchCoach />} />
                <Route path="/referral-engine" element={<ReferralEngine />} />
                <Route path="/vault" element={<Vault />} />
                <Route path="/survival-kit" element={<SurvivalKit />} />
                <Route path="/pre-flight" element={<PreFlight />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
