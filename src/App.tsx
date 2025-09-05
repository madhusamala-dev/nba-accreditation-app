import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import OnboardInstitution from './pages/admin/OnboardInstitution';
import ViewAllInstitutions from './pages/admin/ViewAllInstitutions';
import InstituteDashboard from './pages/institute/InstituteDashboard';
import SARApplications from './pages/institute/SARApplications';
import { getCurrentUser } from './lib/auth';

function App() {
  const currentUser = getCurrentUser();

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