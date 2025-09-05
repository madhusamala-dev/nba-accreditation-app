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
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [sarApplications, setSarApplications] = useState<SARApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = () => {
      try {
        console.log('InstituteDashboard: Loading data...');
        const user = getCurrentUser();
        console.log('InstituteDashboard: Current user:', user);
        
        if (user?.institutionId) {
          console.log('InstituteDashboard: Looking for institution:', user.institutionId);
          const inst = getInstitutionById(user.institutionId);
          console.log('InstituteDashboard: Found institution:', inst);
          
          if (inst) {
            setInstitution(inst);
            
            // Get SAR applications for this institution
            const applications = getSARApplicationsByInstitution(user.institutionId);
            setSarApplications(applications);
            setError(null);
          } else {
            setError(`Institution with ID ${user.institutionId} not found`);
          }
        } else {
          setError('No user or institution ID found');
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <InstituteLayout title="Institute Dashboard">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading institution data...</p>
        </div>
      </InstituteLayout>
    );
  }

  if (error || !institution) {
    return (
      <InstituteLayout title="Institute Dashboard">
        <div className="text-center py-8">
          <p className="text-red-500">
            {error || 'Institution data not found. Please contact administrator.'}
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">Debug Info:</p>
            <p className="text-xs">Error: {error}</p>
            <p className="text-xs">User: {getCurrentUser()?.email}</p>
            <p className="text-xs">Institution ID: {getCurrentUser()?.institutionId}</p>
          </div>
        </div>
      </InstituteLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'in-progress': return 'In Progress';
      case 'submitted': return 'Submitted';
      case 'completed': return 'Completed';
      default: return status || 'Draft';
    }
  };

  const getApplicationTypeColor = (departmentId: string) => {
    if (departmentId === 'institute-info') {
      return 'bg-blue-50 border-blue-200';
    }
    return 'bg-green-50 border-green-200';
  };

  const getApplicationTypeIcon = (departmentId: string) => {
    if (departmentId === 'institute-info') {
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  // Separate institute info and department applications
  const instituteInfoApp = sarApplications.find(app => app.departmentId === 'institute-info');
  const departmentApps = sarApplications.filter(app => app.departmentId !== 'institute-info');

  return (
    <InstituteLayout title="Institute Dashboard">
      <div className="space-y-6">
        {/* Institution Info */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{institution.name}</CardTitle>
                <CardDescription className="mt-1">
                  {institution.institutionCategory} • {institution.tierCategory || 'Tier I'} • Code: {institution.institutionCode}
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Pre-Qualifiers Completed
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">AISHE Code:</span> {institution.aisheCode || 'N/A'}</p>
                <p><span className="font-medium">Email:</span> {institution.email || 'N/A'}</p>
                <p><span className="font-medium">Registered:</span> {institution.registeredDate ? new Date(institution.registeredDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p><span className="font-medium">NBA Coordinator:</span> {institution.nbaCoordinator?.name || institution.coordinatorName}</p>
                <p><span className="font-medium">Designation:</span> {institution.nbaCoordinator?.designation || 'Professor'}</p>
                <p><span className="font-medium">Contact:</span> {institution.nbaCoordinator?.contactNumber || institution.coordinatorPhone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Application Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Application Status</CardTitle>
            <CardDescription>Track your NBA accreditation progress</CardDescription>
          </CardHeader>
          <CardContent>
            {sarApplications.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-orange-600">
                    SAR Phase - In Progress
                  </h3>
                  <Badge variant="outline" className="text-sm bg-orange-50 text-orange-700 border-orange-200">
                    {sarApplications.length} Application{sarApplications.length > 1 ? 's' : ''} Created
                  </Badge>
                </div>

                {/* Institute Information Application */}
                {instituteInfoApp && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Institute Information</h4>
                    <Card className={`${getApplicationTypeColor(instituteInfoApp.departmentId)} border-2`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            {getApplicationTypeIcon(instituteInfoApp.departmentId)}
                            <div>
                              <h5 className="font-medium text-gray-900">{instituteInfoApp.applicationId}</h5>
                              <p className="text-sm text-gray-600">{instituteInfoApp.departmentName}</p>
                              <p className="text-xs text-gray-500">
                                Started: {new Date(instituteInfoApp.applicationStartDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(instituteInfoApp.status)}>
                              {getStatusText(instituteInfoApp.status)}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">
                              {instituteInfoApp.completionPercentage}% Complete
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Progress value={instituteInfoApp.completionPercentage} className="h-2" />
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-xs text-gray-500">
                            Last modified: {new Date(instituteInfoApp.lastModifiedDate).toLocaleDateString()}
                          </p>
                          <Button variant="outline" size="sm" onClick={() => navigate('/institute/sar-applications')}>
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Department SAR Applications */}
                {departmentApps.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Department SAR Applications ({departmentApps.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {departmentApps.map((app) => (
                        <Card key={app.id} className={`${getApplicationTypeColor(app.departmentId)} border-2`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                {getApplicationTypeIcon(app.departmentId)}
                                <div>
                                  <h5 className="font-medium text-gray-900">{app.applicationId}</h5>
                                  <p className="text-sm text-gray-600">{app.departmentName}</p>
                                </div>
                              </div>
                              <Badge className={getStatusColor(app.status)}>
                                {getStatusText(app.status)}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-medium">{app.completionPercentage}%</span>
                              </div>
                              <Progress value={app.completionPercentage} className="h-2" />
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <p className="text-xs text-gray-500">
                                Started: {new Date(app.applicationStartDate).toLocaleDateString()}
                              </p>
                              <Button variant="outline" size="sm" onClick={() => navigate('/institute/sar-applications')}>
                                Continue
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{sarApplications.length}</p>
                    <p className="text-sm text-gray-600">Total Applications</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {sarApplications.filter(app => app.status === 'draft').length}
                    </p>
                    <p className="text-sm text-gray-600">Draft</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {sarApplications.filter(app => app.status === 'in-progress').length}
                    </p>
                    <p className="text-sm text-gray-600">In Progress</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {sarApplications.filter(app => app.status === 'completed').length}
                    </p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Application</h3>
                  <p className="text-gray-600 mb-4">Pre-Qualifiers completed. Ready to create SAR applications.</p>
                  <Button onClick={() => navigate('/institute/sar-applications')}>
                    Create SAR Applications
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InstituteLayout>
  );
}