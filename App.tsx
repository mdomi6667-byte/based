
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Submit from './pages/Submit';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import SubmissionDetail from './pages/SubmissionDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminContent from './pages/admin/AdminContent';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserRole } from './types';

// Admin Route Wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main Layout Wrapper
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen transition-colors duration-300">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <footer className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-t border-gray-200 dark:border-white/10 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p className="mb-2">&copy; {new Date().getFullYear()} Based. Built for the community.</p>
            <a 
                href="https://x.com/0Xweb3_guy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block font-medium hover:text-black dark:hover:text-white transition-colors duration-200"
            >
                Built by 0Xweb3_guy
            </a>
        </div>
    </footer>
  </div>
);

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/leaderboard" element={<MainLayout><Leaderboard /></MainLayout>} />
            <Route path="/submit" element={<MainLayout><Submit /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/u/:userId" element={<MainLayout><PublicProfile /></MainLayout>} />
            <Route path="/submission/:id" element={<MainLayout><SubmissionDetail /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            
            {/* Admin Routes (No MainLayout/Navbar) */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/content" element={<AdminRoute><AdminContent /></AdminRoute>} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
