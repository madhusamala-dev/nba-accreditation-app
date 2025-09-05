import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDashboardStats, getInstitutions } from '@/lib/data';
import { Institution } from '@/lib/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRegistered: 0,
    preQualifiersOngoing: 0,
    preQualifiersCompleted: 0,
    sarOngoing: 0,
    sarCompleted: 0
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setStats(getDashboardStats());
    setInstitutions(getInstitutions());
  }, []);

  const getFilteredInstitutions = (status: string) => {
    switch (status) {
      case 'registered':
        return institutions;
      case 'pre-qualifiers-ongoing':
        return institutions.filter(i => i.status === 'pre-qualifiers-ongoing');
      case 'pre-qualifiers-completed':
        return institutions.filter(i => i.status === 'pre-qualifiers-completed');
      case 'sar-ongoing':
        return institutions.filter(i => i.status === 'sar-ongoing');
      case 'sar-completed':
        return institutions.filter(i => i.status === 'sar-completed');
      default:
        return [];
    }
  };

  const getApplicationDates = (institution: Institution) => {
    const registeredDate = new Date(institution.registeredDate);
    let startDate: Date;
    let endDate: Date;

    if (institution.status === 'pre-qualifiers-ongoing' || institution.status === 'pre-qualifiers-completed') {
      // Pre-qualifier phase: starts from registration, duration 3 months
      startDate = registeredDate;
      endDate = new Date(registeredDate);
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (institution.status === 'sar-ongoing' || institution.status === 'sar-completed') {
      // SAR phase: starts after pre-qualifier (3 months after registration), duration 6 months
      startDate = new Date(registeredDate);
      startDate.setMonth(startDate.getMonth() + 3);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 6);
    } else {
      // For registered institutions, use registration date
      startDate = registeredDate;
      endDate = registeredDate;
    }

    return {
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString()
    };
  };

  const StatCard = ({ title, count, status, description }: { title: string; count: number; status: string; description: string }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedCategory(status)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-600">{count}</div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  const isApplicationPhase = (category: string) => {
    return ['pre-qualifiers-ongoing', 'pre-qualifiers-completed', 'sar-ongoing', 'sar-completed'].includes(category);
  };

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Welcome to CompliEdu Admin Panel</p>
          </div>
          <Button onClick={() => navigate('/admin/onboard-institution')}>
            Onboard New Institution
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Registered"
            count={stats.totalRegistered}
            status="registered"
            description="All registered colleges"
          />
          <StatCard
            title="Pre-qualifiers Ongoing"
            count={stats.preQualifiersOngoing}
            status="pre-qualifiers-ongoing"
            description="Currently in progress"
          />
          <StatCard
            title="Pre-qualifiers Completed"
            count={stats.preQualifiersCompleted}
            status="pre-qualifiers-completed"
            description="Successfully completed"
          />
          <StatCard
            title="SAR Ongoing"
            count={stats.sarOngoing}
            status="sar-ongoing"
            description="Currently in progress"
          />
          <StatCard
            title="SAR Completed"
            count={stats.sarCompleted}
            status="sar-completed"
            description="Successfully completed"
          />
        </div>

        {selectedCategory && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Institution Details</CardTitle>
                <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                  Close
                </Button>
              </div>
              <CardDescription>
                Showing institutions for: {selectedCategory.replace('-', ' ').toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Institution Code</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">NBA Coordinator</th>
                      <th className="text-left p-2">Contact</th>
                      {isApplicationPhase(selectedCategory) ? (
                        <>
                          <th className="text-left p-2">Application Start Date</th>
                          <th className="text-left p-2">Application End Date</th>
                        </>
                      ) : (
                        <th className="text-left p-2">Registered Date</th>
                      )}
                      <th className="text-left p-2">Status</th>
                      {(selectedCategory === 'pre-qualifiers-ongoing' || selectedCategory === 'sar-ongoing') && (
                        <th className="text-left p-2">Progress</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredInstitutions(selectedCategory).map((institution) => {
                      const applicationDates = getApplicationDates(institution);
                      return (
                        <tr key={institution.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{institution.institutionCode}</td>
                          <td className="p-2">{institution.name}</td>
                          <td className="p-2">{institution.nbaCoordinator.name}</td>
                          <td className="p-2">{institution.nbaCoordinator.contactNumber}</td>
                          {isApplicationPhase(selectedCategory) ? (
                            <>
                              <td className="p-2">{applicationDates.startDate}</td>
                              <td className="p-2">{applicationDates.endDate}</td>
                            </>
                          ) : (
                            <td className="p-2">{new Date(institution.registeredDate).toLocaleDateString()}</td>
                          )}
                          <td className="p-2">
                            <Badge variant="outline">
                              {institution.status.replace('-', ' ')}
                            </Badge>
                          </td>
                          {(selectedCategory === 'pre-qualifiers-ongoing' || selectedCategory === 'sar-ongoing') && (
                            <td className="p-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${institution.completionPercentage || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{institution.completionPercentage || 0}%</span>
                              </div>
                              {institution.lastUpdated && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Updated: {new Date(institution.lastUpdated).toLocaleDateString()}
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {getFilteredInstitutions(selectedCategory).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No institutions found for this category
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}