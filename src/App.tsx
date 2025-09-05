import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import OnboardInstitution from './pages/admin/OnboardInstitution';
import ViewAllInstitutions from './pages/admin/ViewAllInstitutions';
import InstituteDashboard from './pages/institute/InstituteDashboard';
import SARApplications from './pages/institute/SARApplications';
import { getCurrentUser } from './lib/auth';
import { User } from './lib/types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for current user on app load
    const checkAuth = () => {
      const user = getCurrentUser();
      console.log('App: Checking authentication, found user:', user);
      setCurrentUser(user);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'compliedu_current_user') {
        console.log('App: Storage changed, rechecking auth');
        checkAuth();
      }
    };

    // Listen for custom login events
    const handleLoginEvent = () => {
      console.log('App: Login event detected, rechecking auth');
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleLoginEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleLoginEvent);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            currentUser?.role === 'admin' ? 
            <AdminDashboard /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/admin/onboard-institution" 
          element={
            currentUser?.role === 'admin' ? 
            <OnboardInstitution /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/admin/view-institutions" 
          element={
            currentUser?.role === 'admin' ? 
            <ViewAllInstitutions /> : 
            <Navigate to="/login" replace />
          } 
        />
        
        {/* Institute Routes */}
        <Route 
          path="/institute/dashboard" 
          element={
            currentUser?.role === 'institute' ? 
            <InstituteDashboard /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/institute/sar" 
          element={
            currentUser?.role === 'institute' ? 
            <SARApplications /> : 
            <Navigate to="/login" replace />
          } 
        />
        
        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            currentUser ? 
              (currentUser.role === 'admin' ? 
                <Navigate to="/admin/dashboard" replace /> : 
                <Navigate to="/institute/dashboard" replace />
              ) : 
              <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;