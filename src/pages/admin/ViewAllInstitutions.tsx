import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getInstitutions } from '@/lib/data';
import { Institution } from '@/lib/types';
import { Search, Plus, Eye, Edit } from 'lucide-react';

export default function ViewAllInstitutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const allInstitutions = getInstitutions();
    setInstitutions(allInstitutions);
    setFilteredInstitutions(allInstitutions);
  }, []);

  useEffect(() => {
    let filtered = institutions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(inst => 
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.institutionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.aisheCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inst => inst.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(inst => inst.institutionCategory === categoryFilter);
    }

    setFilteredInstitutions(filtered);
  }, [institutions, searchTerm, statusFilter, categoryFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-blue-100 text-blue-800';
      case 'pre-qualifiers-ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'pre-qualifiers-completed': return 'bg-green-100 text-green-800';
      case 'sar-ongoing': return 'bg-orange-100 text-orange-800';
      case 'sar-completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registered': return 'Registered';
      case 'pre-qualifiers-ongoing': return 'Pre-Qualifiers Ongoing';
      case 'pre-qualifiers-completed': return 'Pre-Qualifiers Completed';
      case 'sar-ongoing': return 'SAR Ongoing';
      case 'sar-completed': return 'SAR Completed';
      default: return status;
    }
  };

  const uniqueCategories = [...new Set(institutions.map(inst => inst.institutionCategory))];
  const uniqueStatuses = [...new Set(institutions.map(inst => inst.status))];

  return (
    <AdminLayout title="View All Institutions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Manage all registered institutions</p>
          </div>
          <Button onClick={() => navigate('/admin/onboard-institution')}>
            <Plus className="w-4 h-4 mr-2" />
            Onboard New Institution
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search institutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {getStatusText(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-gray-600">
                Showing {filteredInstitutions.length} of {institutions.length} institutions
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Institutions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Institutions</CardTitle>
            <CardDescription>
              Complete list of all registered institutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Institution Details</th>
                    <th className="text-left p-3">Codes</th>
                    <th className="text-left p-3">Category & Tier</th>
                    <th className="text-left p-3">NBA Coordinator</th>
                    <th className="text-left p-3">Chairman</th>
                    <th className="text-left p-3">Contact Info</th>
                    <th className="text-left p-3">Registration</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstitutions.map((institution) => (
                    <tr key={institution.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{institution.name}</p>
                          <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                            {institution.address}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="text-xs">
                            <span className="font-medium">Institution:</span> {institution.institutionCode}
                          </p>
                          <p className="text-xs">
                            <span className="font-medium">AISHE:</span> {institution.aisheCode}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {institution.institutionCategory}
                          </Badge>
                          <p className="text-xs text-gray-600">{institution.tierCategory}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="font-medium text-xs">{institution.nbaCoordinator.name}</p>
                          <p className="text-xs text-gray-600">{institution.nbaCoordinator.designation}</p>
                          <p className="text-xs text-gray-500">{institution.nbaCoordinator.contactNumber}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="font-medium text-xs">{institution.chairman.name}</p>
                          <p className="text-xs text-gray-600">{institution.chairman.designation}</p>
                          <p className="text-xs text-gray-500">{institution.chairman.contactNumber}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="text-xs">{institution.email}</p>
                          <p className="text-xs text-gray-600">{institution.nbaCoordinator.email}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="text-xs font-medium">
                            {new Date(institution.registeredDate).toLocaleDateString()}
                          </p>
                          {institution.lastUpdated && (
                            <p className="text-xs text-gray-500">
                              Updated: {new Date(institution.lastUpdated).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(institution.status)}>
                          {getStatusText(institution.status)}
                        </Badge>
                        {(institution.status === 'pre-qualifiers-ongoing' || institution.status === 'sar-ongoing') && (
                          <div className="mt-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-blue-600 h-1 rounded-full"
                                style={{ width: `${institution.completionPercentage || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{institution.completionPercentage || 0}%</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Edit Institution"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredInstitutions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No institutions found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                      ? 'Try adjusting your search criteria or filters.'
                      : 'No institutions have been registered yet.'}
                  </p>
                  {(!searchTerm && statusFilter === 'all' && categoryFilter === 'all') && (
                    <Button onClick={() => navigate('/admin/onboard-institution')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Onboard First Institution
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}