import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrentUser } from '@/lib/auth';
import { 
  getInstitutionById, 
  getSARApplicationsByInstitution, 
  getDepartmentsByCategory,
  createSARApplications,
  createInstituteInfoApplication
} from '@/lib/data';
import { SARApplication, Department } from '@/lib/types';
import InstituteLayout from '@/components/InstituteLayout';
import { FileText, Plus, Calendar, User, ExternalLink, Building2 } from 'lucide-react';

export default function SARApplications() {
  const [sarApplications, setSarApplications] = useState<SARApplication[]>([]);
  const [showNewApplicationForm, setShowNewApplicationForm] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [instituteInfoApplication, setInstituteInfoApplication] = useState<SARApplication | null>(null);
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const institution = currentUser?.institutionId ? getInstitutionById(currentUser.institutionId) : null;

  useEffect(() => {
    if (currentUser?.institutionId) {
      console.log('Loading applications for institution:', currentUser.institutionId);
      const applications = getSARApplicationsByInstitution(currentUser.institutionId);
      console.log('All applications loaded:', applications);
      
      setSarApplications(applications);
      
      // Check for existing institute information application
      const instituteApp = applications.find(app => 
        app.departmentId === 'institute-info' || app.applicationId.includes('-IS-')
      );
      console.log('Institute info application found:', instituteApp);
      setInstituteInfoApplication(instituteApp || null);
      
      if (institution) {
        const allDepartments = getDepartmentsByCategory(institution.institutionCategory);
        
        // Filter out departments that already have SAR applications (excluding institute info)
        const existingDepartmentIds = applications
          .filter(app => app.departmentId !== 'institute-info' && !app.applicationId.includes('-IS-'))
          .map(app => app.departmentId);
        const availableDepts = allDepartments.filter(dept => !existingDepartmentIds.includes(dept.id));
        
        setAvailableDepartments(availableDepts);
      }
    }
  }, [currentUser?.institutionId, institution]);

  const handleStartNewApplication = () => {
    setShowNewApplicationForm(true);
    setSelectedDepartments([]);
  };

  const handleCreateInstituteInfo = () => {
    if (!currentUser?.institutionId || !institution) return;
    
    setLoading(true);
    
    try {
      const instituteInfoApp = createInstituteInfoApplication(
        currentUser.institutionId,
        currentUser.email
      );
      
      setSarApplications(prev => [...prev, instituteInfoApp]);
      setInstituteInfoApplication(instituteInfoApp);
    } catch (error) {
      console.error('Error creating institute information application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments(prev => [...prev, departmentId]);
    } else {
      setSelectedDepartments(prev => prev.filter(id => id !== departmentId));
    }
  };

  const handleCreateApplications = () => {
    if (!currentUser?.institutionId || selectedDepartments.length === 0) return;
    
    setLoading(true);
    
    try {
      const newApplications = createSARApplications(
        currentUser.institutionId,
        selectedDepartments,
        currentUser.email
      );
      
      setSarApplications(prev => [...prev, ...newApplications]);
      
      // Update available departments by removing the newly created ones
      setAvailableDepartments(prev => 
        prev.filter(dept => !selectedDepartments.includes(dept.id))
      );
      
      setShowNewApplicationForm(false);
      setSelectedDepartments([]);
    } catch (error) {
      console.error('Error creating SAR applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { variant: 'secondary' as const, label: 'Draft' },
      'in-progress': { variant: 'default' as const, label: 'In Progress' },
      'completed': { variant: 'success' as const, label: 'Completed' },
      'submitted': { variant: 'outline' as const, label: 'Submitted' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!currentUser || !institution) {
    return (
      <InstituteLayout title="SAR Applications">
        <div className="flex items-center justify-center h-64">
          <Alert>
            <AlertDescription>
              Unable to load institution information. Please try logging in again.
            </AlertDescription>
          </Alert>
        </div>
      </InstituteLayout>
    );
  }

  const departmentApplications = sarApplications.filter(app => 
    app.departmentId !== 'institute-info' && !app.applicationId.includes('-IS-')
  );

  return (
    <InstituteLayout title="SAR Applications">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Manage your Self Assessment Report applications for {institution.name}
          </p>
        </div>

        {/* Institute Information Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Institute Information
            </h2>
            {!instituteInfoApplication && (
              <Button 
                onClick={handleCreateInstituteInfo} 
                disabled={loading}
                className="inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Institute Information
              </Button>
            )}
          </div>

          {instituteInfoApplication ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Modified By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{instituteInfoApplication.applicationId}</TableCell>
                      <TableCell>{instituteInfoApplication.departmentName}</TableCell>
                      <TableCell>{getStatusBadge(instituteInfoApplication.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${instituteInfoApplication.completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{instituteInfoApplication.completionPercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(instituteInfoApplication.applicationStartDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(instituteInfoApplication.lastModifiedDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-1" />
                          {instituteInfoApplication.lastModifiedBy}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="inline-flex items-center"
                          onClick={() => navigate(`/institute/institute-info/${instituteInfoApplication.id}`)}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Fill
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  Create your institute information application to get started with the accreditation process.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Department Applications Section */}
        {departmentApplications.length === 0 && !showNewApplicationForm ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">No Department Applications Found</CardTitle>
              <CardDescription className="mb-6">
                You haven't started any department SAR applications yet. Create your first application to get started.
              </CardDescription>
              <Button onClick={handleStartNewApplication} className="inline-flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Start New Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {departmentApplications.length > 0 && (
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Department SAR Applications</h2>
                {availableDepartments.length > 0 && (
                  <Button onClick={handleStartNewApplication} className="inline-flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Application
                  </Button>
                )}
              </div>
            )}

            {departmentApplications.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead>Modified By</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departmentApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.applicationId}</TableCell>
                          <TableCell>{app.departmentName}</TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${app.completionPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{app.completionPercentage}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(app.applicationStartDate)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(app.lastModifiedDate)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-1" />
                              {app.lastModifiedBy}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="inline-flex items-center"
                              onClick={() => navigate(`/institute/sar/${app.id}`)}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Fill
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {availableDepartments.length === 0 && departmentApplications.length > 0 && (
              <Alert>
                <AlertDescription>
                  <strong>All departments have SAR applications created.</strong>
                  <br />
                  You have created SAR applications for all available departments in your institution category ({institution.institutionCategory}).
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {showNewApplicationForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New SAR Application</CardTitle>
              <CardDescription>
                Select the departments for which you want to create SAR applications. 
                Each department will have a separate application with a unique ID.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {availableDepartments.length > 0 ? (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Available Departments for {institution.institutionCategory}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableDepartments.map((department) => (
                        <div key={department.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={department.id}
                            checked={selectedDepartments.includes(department.id)}
                            onCheckedChange={(checked) => 
                              handleDepartmentChange(department.id, checked as boolean)
                            }
                          />
                          <label 
                            htmlFor={department.id} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {department.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDepartments.length > 0 && (
                    <Alert>
                      <AlertDescription>
                        <strong>{selectedDepartments.length} department(s) selected.</strong>
                        <br />
                        This will create {selectedDepartments.length} separate SAR application(s) with unique IDs 
                        based on your institution code ({institution.institutionCode}) and application date.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-4">
                    <Button 
                      onClick={handleCreateApplications}
                      disabled={selectedDepartments.length === 0 || loading}
                      className="inline-flex items-center"
                    >
                      {loading ? 'Creating...' : 'Create Applications'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowNewApplicationForm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Alert>
                    <AlertDescription>
                      <strong>No departments available for new applications.</strong>
                      <br />
                      You have already created SAR applications for all departments in your institution category ({institution.institutionCategory}).
                    </AlertDescription>
                  </Alert>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewApplicationForm(false)}
                    className="mt-4"
                  >
                    Close
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </InstituteLayout>
  );
}