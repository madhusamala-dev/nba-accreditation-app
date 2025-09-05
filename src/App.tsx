import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstituteLayout from './components/layout/InstituteLayout';
import InstituteDashboard from './pages/institute/InstituteDashboard';
import SARApplications from './pages/institute/SARApplications';
import { getCurrentUser } from './lib/auth';
import { User } from './lib/types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        {user.role === 'admin' && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          </>
        )}
        
        {user.role === 'institute' && (
          <>
            <Route path="/institute" element={<InstituteLayout />}>
              <Route path="dashboard" element={<InstituteDashboard />} />
              <Route path="sar-applications" element={<SARApplications />} />
              <Route path="pre-qualifiers" element={<div className="p-6"><h1 className="text-2xl font-bold">Pre-Qualifiers</h1><p className="text-gray-600 mt-2">Pre-qualification requirements and assessments will be available here.</p></div>} />
              <Route path="sar-templates" element={<div className="p-6"><h1 className="text-2xl font-bold">SAR Templates</h1><p className="text-gray-600 mt-2">Self Assessment Report templates will be available here.</p></div>} />
              <Route path="sar-guidelines" element={<div className="p-6"><h1 className="text-2xl font-bold">SAR Guidelines</h1><p className="text-gray-600 mt-2">Guidelines and instructions for SAR preparation will be available here.</p></div>} />
              <Route path="evaluation" element={<div className="p-6"><h1 className="text-2xl font-bold">Evaluation</h1><p className="text-gray-600 mt-2">Evaluation status and reports will be available here.</p></div>} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600 mt-2">Account and system settings will be available here.</p></div>} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
            <Route path="/" element={<Navigate to="/institute/dashboard" replace />} />
          </>
        )}
        
        <Route path="/login" element={<Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/institute/dashboard'} replace />} />
        <Route path="*" element={<Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/institute/dashboard'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;