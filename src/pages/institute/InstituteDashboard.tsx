import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InstituteLayout from '@/components/InstituteLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getCurrentUser } from '@/lib/auth';
import { getInstitutionById, getSARApplicationsByInstitution } from '@/lib/data';
import { Institution, SARApplication } from '@/lib/types';

export default function InstituteDashboard() {
  const navigate = useNavigate();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [sarApplications, setSarApplications] = useState<SARApplication[]>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser?.institutionId) {
      const inst = getInstitutionById(currentUser.institutionId);
      setInstitution(inst);
      
      if (inst) {
        const apps = getSARApplicationsByInstitution(inst.id);
        setSarApplications(apps);
      }
    }
  }, [currentUser]);

  const calculateOverallProgress = () => {
    if (sarApplications.length === 0) return 0;
    const totalProgress = sarApplications.reduce((sum, app) => sum + app.completionPercentage, 0);
    return Math.round(totalProgress / sarApplications.length);
  };

  const getApplicationStatus = () => {
    if (sarApplications.length === 0) return 'Not Started';
    
    const allCompleted = sarApplications.every(app => app.status === 'completed');
    const anyInProgress = sarApplications.some(app => app.status === 'in-progress');
    const allDraft = sarApplications.every(app => app.status === 'draft');
    
    if (allCompleted) return 'Completed';
    if (anyInProgress) return 'In Progress';
    if (allDraft) return 'Draft';
    return 'In Progress';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getEarliestStartDate = () => {
    if (sarApplications.length === 0) return null;
    
    const dates = sarApplications.map(app => new Date(app.applicationStartDate));
    const earliestDate = new Date(Math.min(...dates.map(date => date.getTime())));
    return earliestDate;
  };

  const calculateEndDate = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 60);
    return endDate;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const overallProgress = calculateOverallProgress();
  const applicationStatus = getApplicationStatus();
  const startDate = getEarliestStartDate();
  const endDate = startDate ? calculateEndDate(startDate) : null;
  const daysRemaining = endDate ? getDaysRemaining(endDate) : null;

  if (!institution) {
    return (
      <InstituteLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </InstituteLayout>
    );
  }

  return (
    <InstituteLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to {institution.name}
                </h2>
                <p className="text-gray-600">
                  Institution Code: {institution.institutionCode} • Category: {institution.institutionCategory}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your NBA accreditation applications and track progress
                </p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-2">
                  {institution.tierCategory || 'Tier II'}
                </Badge>
                <p className="text-sm text-gray-600">
                  Est. {institution.establishedYear}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Application Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Current Application Status
            </CardTitle>
            <CardDescription>
              Track your SAR application progress and timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">SAR Phase</span>
                </div>
                <Badge className={getStatusColor(applicationStatus)}>
                  {applicationStatus}
                </Badge>
              </div>

              {/* Timeline Information */}
              {startDate && endDate && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Start Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(startDate)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">End Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(endDate)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Days Remaining</p>
                      <p className={`font-semibold ${daysRemaining && daysRemaining < 10 ? 'text-red-600' : daysRemaining && daysRemaining < 30 ? 'text-orange-600' : 'text-green-600'}`}>
                        {daysRemaining !== null ? (daysRemaining > 0 ? `${daysRemaining} days` : 'Overdue') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {daysRemaining !== null && daysRemaining < 15 && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-sm text-orange-800">
                          {daysRemaining > 0 
                            ? `Deadline approaching! Only ${daysRemaining} days remaining to complete your SAR applications.`
                            : 'Your SAR application deadline has passed. Please contact the administrator.'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{sarApplications.length}</div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {sarApplications.filter(app => app.status === 'completed').length}
                  </div>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {sarApplications.filter(app => app.status === 'in-progress').length}
                  </div>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SAR Applications */}
        {sarApplications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>SAR Applications</CardTitle>
              <CardDescription>
                Your department-wise SAR application progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sarApplications.map((app) => (
                  <Card key={app.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            app.status === 'completed' ? 'bg-green-500' : 
                            app.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                          <div>
                            <h4 className="font-medium">{app.departmentName}</h4>
                            <p className="text-sm text-gray-600">{app.applicationId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            {app.status === 'draft' ? 'Draft' : 
                             app.status === 'in-progress' ? 'In Progress' : 'Completed'}
                          </Badge>
                          <div className="w-24">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{app.completionPercentage}%</span>
                            </div>
                            <Progress value={app.completionPercentage} className="h-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>SAR Applications</CardTitle>
              <CardDescription>Manage your Self Assessment Reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/institute/sar-applications')}
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View SAR Applications
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Institution Profile</CardTitle>
              <CardDescription>View and manage institution details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>AISHE Code:</span>
                  <span className="font-medium">{institution.aisheCode || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coordinator:</span>
                  <span className="font-medium">{institution.coordinatorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">{institution.coordinatorEmail}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </InstituteLayout>
  );
}