import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { logout, getCurrentUser } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import InstituteSidebar from './InstituteSidebar';

interface InstituteLayoutProps {
  children: ReactNode;
  title: string;
}

export default function InstituteLayout({ children, title }: InstituteLayoutProps) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <InstituteSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">CompliEdu Technologies</h1>
                <span className="ml-4 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Institute
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 px-6 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}