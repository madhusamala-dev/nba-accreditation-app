import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { institutions, getSARApplicationsByInstitution } from '@/lib/data';
import { Institution, SARApplication } from '@/lib/types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [institutionSARApps, setInstitutionSARApps] = useState<SARApplication[]>([]);

  // Calculate dashboard statistics
  const totalInstitutions = institutions.length;
  const preQualifiersCompleted = institutions.filter(inst => inst.preQualifiersCompleted).length;
  
  // Get institutions with SAR applications (ongoing)
  const institutionsWithSAR = institutions.filter(inst => {
    const apps = getSARApplicationsByInstitution(inst.id);
    return apps.length > 0;
  });
  const sarOngoing = institutionsWithSAR.length;

  const handleInstituteClick = (institution: Institution) => {
    setSelectedInstitution(institution);
    // Get SAR applications for this institution
    const apps = getSARApplicationsByInstitution(institution.id);
    setInstitutionSARApps(apps);
  };

  const calculateAverageProgress = (apps: SARApplication[]) => {
    if (apps.length === 0) return 0;
    const totalProgress = apps.reduce((sum, app) => sum + app.completionPercentage, 0);
    return Math.round(totalProgress / apps.length);
  };

  const getOverallStatus = (apps: SARApplication[]) => {
    if (apps.length === 0) return 'No Applications';
    
    const allCompleted = apps.every(app => app.status === 'completed');
    const anyInProgress = apps.some(app => app.status === 'in-progress');
    const allDraft = apps.every(app => app.status === 'draft');
    
    if (allCompleted) return 'Completed';
    if (anyInProgress) return 'In-Progress';
    if (allDraft) return 'Draft';
    return 'Mixed Status';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'In-Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Mixed Status': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Institutions</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInstitutions}</div>
              <p className="text-xs text-muted-foreground">Registered institutions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pre-Qualifiers Completed</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{preQualifiersCompleted}</div>
              <p className="text-xs text-muted-foreground">Ready for SAR phase</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SAR Ongoing</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{sarOngoing}</div>
              <p className="text-xs text-muted-foreground">Applications in progress</p>
            </CardContent>
          </Card>
        </div>

        {/* SAR Ongoing Institutions */}
        {sarOngoing > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>SAR Applications in Progress</CardTitle>
              <CardDescription>Institutions currently working on SAR applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {institutionsWithSAR.map((institution) => {
                  const apps = getSARApplicationsByInstitution(institution.id);
                  const avgProgress = calculateAverageProgress(apps);
                  const status = getOverallStatus(apps);
                  
                  return (
                    <Dialog key={institution.id}>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <h3 className="font-semibold text-lg">{institution.name}</h3>
                                  <p className="text-sm text-gray-600">
                                    {institution.institutionCategory} • Code: {institution.institutionCode}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {apps.length} SAR Application{apps.length > 1 ? 's' : ''} • {apps.filter(app => app.departmentId !== 'institute-info').length} Department{apps.filter(app => app.departmentId !== 'institute-info').length !== 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className={getStatusColor(status)}>
                                  {status}
                                </Badge>
                                <div className="mt-2 w-24">
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{avgProgress}%</span>
                                  </div>
                                  <Progress value={avgProgress} className="h-2" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{institution.name} - SAR Application Details</DialogTitle>
                          <DialogDescription>
                            Detailed view of SAR applications and progress
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Institution Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Institution Details</h4>
                              <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Category:</span> {institution.institutionCategory}</p>
                                <p><span className="font-medium">Code:</span> {institution.institutionCode}</p>
                                <p><span className="font-medium">AISHE Code:</span> {institution.aisheCode || 'N/A'}</p>
                                <p><span className="font-medium">Email:</span> {institution.email || 'N/A'}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">SAR Statistics</h4>
                              <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Total Applications:</span> {apps.length}</p>
                                <p><span className="font-medium">No. of Departments:</span> {apps.filter(app => app.departmentId !== 'institute-info').length}</p>
                                <p><span className="font-medium">Overall Status:</span> <Badge className={`${getStatusColor(status)} text-xs`}>{status}</Badge></p>
                                <p><span className="font-medium">Average Progress:</span> {avgProgress}%</p>
                              </div>
                            </div>
                          </div>

                          {/* Applications List */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">SAR Applications</h4>
                            <div className="space-y-3">
                              {apps.map((app) => (
                                <Card key={app.id} className={`${app.departmentId === 'institute-info' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        {app.departmentId === 'institute-info' ? (
                                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                          </svg>
                                        ) : (
                                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                          </svg>
                                        )}
                                        <div>
                                          <h5 className="font-medium">{app.applicationId}</h5>
                                          <p className="text-sm text-gray-600">{app.departmentName}</p>
                                          <p className="text-xs text-gray-500">
                                            Started: {new Date(app.applicationStartDate).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <Badge className={getStatusColor(app.status === 'draft' ? 'Draft' : app.status === 'in-progress' ? 'In-Progress' : 'Completed')}>
                                          {app.status === 'draft' ? 'Draft' : app.status === 'in-progress' ? 'In-Progress' : 'Completed'}
                                        </Badge>
                                        <div className="mt-2 w-24">
                                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Progress</span>
                                            <span>{app.completionPercentage}%</span>
                                          </div>
                                          <Progress value={app.completionPercentage} className="h-2" />
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Institution Management</CardTitle>
              <CardDescription>Manage registered institutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/onboard-institution')}
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Onboard New Institution
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/view-institutions')}
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                View All Institutions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Monitor system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active SAR Applications</span>
                  <Badge variant="secondary">{institutionsWithSAR.reduce((total, inst) => total + getSARApplicationsByInstitution(inst.id).length, 0)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Institutions with SAR</span>
                  <Badge variant="secondary">{sarOngoing}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pre-Qualifiers Completed</span>
                  <Badge variant="secondary">{preQualifiersCompleted}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}