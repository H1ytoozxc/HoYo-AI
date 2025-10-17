import React, { Suspense, lazy } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Outlet 
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Guards
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Loading component
import LoadingScreen from '../components/LoadingScreen';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('../pages/HomePage'));
const ChatsPage = lazy(() => import('../pages/ChatsPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const ArtifactsPage = lazy(() => import('../pages/ArtifactsPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const ConversationPage = lazy(() => import('../pages/ConversationPage'));
const ModelPlayground = lazy(() => import('../pages/ModelPlayground'));
const Analytics = lazy(() => import('../pages/Analytics'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('../pages/admin/Users'));
const AdminModels = lazy(() => import('../pages/admin/Models'));
const AdminSettings = lazy(() => import('../pages/admin/Settings'));

const AppRouter = () => {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Routes with Auth Layout */}
            <Route element={<PublicRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
              </Route>
            </Route>

            {/* Private Routes with Main Layout */}
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                {/* Dashboard */}
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                
                {/* Chat Routes */}
                <Route path="/chats" element={<ChatsPage />} />
                <Route path="/chats/:conversationId" element={<ConversationPage />} />
                <Route path="/new-chat" element={<Navigate to="/" state={{ openNewChat: true }} />} />
                
                {/* Projects & Artifacts */}
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetails />} />
                <Route path="/artifacts" element={<ArtifactsPage />} />
                <Route path="/artifacts/:artifactId" element={<ArtifactView />} />
                
                {/* AI Models */}
                <Route path="/models" element={<ModelsPage />} />
                <Route path="/playground" element={<ModelPlayground />} />
                <Route path="/playground/:modelId" element={<ModelPlayground />} />
                
                {/* User Routes */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/settings/:section" element={<SettingsPage />} />
                
                {/* Analytics */}
                <Route path="/analytics" element={<Analytics />} />
                
                {/* API Documentation */}
                <Route path="/api-docs" element={<ApiDocs />} />
                
                {/* Billing & Subscription */}
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/upgrade" element={<UpgradePage />} />
              </Route>
            </Route>

            {/* Admin Routes with Dashboard Layout */}
            <Route element={<PrivateRoute requireAdmin />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="models" element={<AdminModels />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="logs" element={<AdminLogs />} />
                <Route path="metrics" element={<AdminMetrics />} />
              </Route>
            </Route>

            {/* Shared Routes (accessible by all) */}
            <Route path="/shared/:shareId" element={<SharedConversation />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </Router>
  );
};

// Lazy load additional pages
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const ProjectDetails = lazy(() => import('../pages/ProjectDetails'));
const ArtifactView = lazy(() => import('../pages/ArtifactView'));
const ModelsPage = lazy(() => import('../pages/ModelsPage'));
const ApiDocs = lazy(() => import('../pages/ApiDocs'));
const BillingPage = lazy(() => import('../pages/BillingPage'));
const UpgradePage = lazy(() => import('../pages/UpgradePage'));
const AdminLogs = lazy(() => import('../pages/admin/Logs'));
const AdminMetrics = lazy(() => import('../pages/admin/Metrics'));
const SharedConversation = lazy(() => import('../pages/SharedConversation'));

export default AppRouter;
