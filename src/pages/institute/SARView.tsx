import { useState, useEffect } from 'react';
import InstituteLayout from '@/components/InstituteLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrentUser } from '@/lib/auth';
import { getInstitutionById } from '@/lib/data';
import { PROGRAMS_BY_CATEGORY } from '@/lib/types';
import { Eye, Download, FileText } from 'lucide-react';

interface SARApplicationRow {
  id: string;
  department: string;
  program: string;
  startDate: string;
  endDate: string;
  status: 'in-progress' | 'completed';
  submittedDate?: string;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  phase: 'SAR Preparation' | 'SAR Submission' | 'SAR Review';
}

export default function SARView() {
  const [applications, setApplications] = useState<SARApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (user?.institutionId) {
      const institution = getInstitutionById(user.institutionId);
      if (institution) {
        // Generate mock SAR applications based on institution category
        const programs = PROGRAMS_BY_CATEGORY[institution.institutionCategory] || [];
        const mockApplications: SARApplicationRow[] = programs.slice(0, 1).map((program, index) => ({
          id: `sar-${institution.id}-${index + 1}`,
          department: institution.institutionCategory,
          program: program,
          startDate: '2024-09-01',
          endDate: '2025-03-01',
          status: 'completed',
          submittedDate: '2024-08-20',
          reviewStatus: 'approved',
          phase: 'SAR Review'
        }));
        setApplications(mockApplications);
      }
      setLoading(false);
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReviewStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'SAR Preparation': return 'bg-yellow-100 text-yellow-800';
      case 'SAR Submission': return 'bg-orange-100 text-orange-800';
      case 'SAR Review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleViewApplication = (applicationId: string) => {
    // Navigate to view application details
    console.log('Viewing SAR application:', applicationId);
  };

  const handleDownloadApplication = (applicationId: string) => {
    // Download application as PDF
    console.log('Downloading SAR application:', applicationId);
  };

  if (loading) {
    return (
      <InstituteLayout title="SAR Applications - View">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading SAR applications...</p>
        </div>
      </InstituteLayout>
    );
  }

  return (
    <InstituteLayout title="SAR Applications - View">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Self Assessment Report (SAR) Applications - View Only
            </CardTitle>
            <CardDescription>
              View and download your submitted SAR applications
            </CardDescription>
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
                      <TableHead>Current Phase</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Review Status</TableHead>
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
                          <Badge className={getPhaseColor(application.phase)}>
                            {application.phase}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(application.status)}>
                            {getStatusText(application.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {application.submittedDate 
                            ? new Date(application.submittedDate).toLocaleDateString()
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge className={getReviewStatusColor(application.reviewStatus)}>
                            {application.reviewStatus.charAt(0).toUpperCase() + application.reviewStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewApplication(application.id)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            {application.status === 'completed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadApplication(application.id)}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No SAR Applications to View</h3>
                <p className="text-gray-600">
                  You haven't submitted any SAR applications yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InstituteLayout>
  );
}