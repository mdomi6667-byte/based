
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Submit from './pages/Submit';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';

// Admin Route Wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main Layout Wrapper (Hides Navbar on Admin pages)
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <footer className="bg-white/50 backdrop-blur-md border-t border-white/20 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
            <p className="mb-2">&copy; {new Date().getFullYear()} Based. Built for the community.</p>
            <a 
                href="https://x.com/0Xweb3_guy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block font-medium hover:text-black transition-colors duration-200"
            >
                Built by 0Xweb3_guy
            </a>
        </div>
    </footer>
  </>
);

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/leaderboard" element={<MainLayout><Leaderboard /></MainLayout>} />
            <Route path="/submit" element={<MainLayout><Submit /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            
            {/* Admin Routes (No MainLayout/Navbar) */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen font-sans text-gray-900">
           <AppRoutes />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
