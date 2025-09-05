import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InstituteLayout from '@/components/InstituteLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrentUser } from '@/lib/auth';
import { getInstitutionById } from '@/lib/data';
import { PROGRAMS_BY_CATEGORY } from '@/lib/types';
import { FileText, Plus } from 'lucide-react';

interface ApplicationRow {
  id: string;
  department: string;
  program: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  completionPercentage: number;
}

export default function PreQualifierFill() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (user?.institutionId) {
      const institution = getInstitutionById(user.institutionId);
      if (institution) {
        // Generate mock applications based on institution category
        const programs = PROGRAMS_BY_CATEGORY[institution.institutionCategory] || [];
        const mockApplications: ApplicationRow[] = programs.map((program, index) => ({
          id: `pq-${institution.id}-${index + 1}`,
          department: institution.institutionCategory,
          program: program,
          startDate: '2024-09-01',
          endDate: '2024-12-01',
          status: index === 0 ? 'in-progress' : index === 1 ? 'completed' : 'not-started',
          completionPercentage: index === 0 ? 45 : index === 1 ? 100 : 0
        }));
        setApplications(mockApplications);
      }
      setLoading(false);
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleFillApplication = (applicationId: string) => {
    // Navigate to application form
    navigate(`/institute/pre-qualifier/fill/${applicationId}`);
  };

  const handleCreateNew = () => {
    navigate('/institute/new-application');
  };

  if (loading) {
    return (
      <InstituteLayout title="Pre-Qualifier Applications - Fill">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading applications...</p>
        </div>
      </InstituteLayout>
    );
  }

  return (
    <InstituteLayout title="Pre-Qualifier Applications - Fill">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Pre-Qualifier Applications
                </CardTitle>
                <CardDescription>
                  Fill out pre-qualifier applications for your programs
                </CardDescription>
              </div>
              <Button onClick={handleCreateNew} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create New Application
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Application Start Date</TableHead>
                      <TableHead>Application End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {application.department}
                        </TableCell>
                        <TableCell>{application.program}</TableCell>
                        <TableCell>
                          {new Date(application.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(application.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(application.status)}>
                            {getStatusText(application.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${application.completionPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {application.completionPercentage}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={application.status === 'completed' ? 'outline' : 'default'}
                            onClick={() => handleFillApplication(application.id)}
                          >
                            {application.status === 'completed' ? 'Review' : 'Fill'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-gray-600 mb-4">
                  You haven't created any pre-qualifier applications yet.
                </p>
                <Button onClick={handleCreateNew}>
                  Create Your First Application
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InstituteLayout>
  );
}