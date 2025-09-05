import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { institutions } from '@/lib/data';
import { Institution } from '@/lib/types';

export default function ViewAllInstitutions() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  // Filter institutions based on search and category
  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.institutionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (institution.aisheCode && institution.aisheCode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || institution.institutionCategory === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout title="All Institutions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Manage and view all registered institutions</p>
          </div>
          <Button onClick={() => navigate('/admin/onboard-institution')}>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Institution
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, code, or AISHE code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="MBA">MBA</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Arts & Science">Arts & Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{institutions.length}</div>
              <p className="text-sm text-gray-600">Total Institutions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {institutions.filter(inst => inst.status === 'registered').length}
              </div>
              <p className="text-sm text-gray-600">Registered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {institutions.filter(inst => inst.preQualifiersCompleted).length}
              </div>
              <p className="text-sm text-gray-600">Pre-Qualifiers Complete</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {institutions.filter(inst => inst.institutionCategory === 'Engineering').length}
              </div>
              <p className="text-sm text-gray-600">Engineering</p>
            </CardContent>
          </Card>
        </div>

        {/* Institutions List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Institutions ({filteredInstitutions.length})
            </CardTitle>
            <CardDescription>
              Click on any institution to view detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredInstitutions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No institutions found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInstitutions.map((institution) => (
                  <Dialog key={institution.id}>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{institution.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {institution.institutionCategory} • Code: {institution.institutionCode}
                                </p>
                                <p className="text-xs text-gray-500">
                                  AISHE: {institution.aisheCode || 'N/A'} • Est. {institution.establishedYear}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(institution.status)}>
                                {institution.status}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                Registered: {formatDate(institution.registeredDate)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{institution.name}</DialogTitle>
                        <DialogDescription>
                          Detailed institution information and statistics
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Institution Code:</span>
                                  <span className="font-medium">{institution.institutionCode}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">AISHE Code:</span>
                                  <span className="font-medium">{institution.aisheCode || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Category:</span>
                                  <span className="font-medium">{institution.institutionCategory}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tier:</span>
                                  <span className="font-medium">{institution.tierCategory}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Established:</span>
                                  <span className="font-medium">{institution.establishedYear}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <Badge className={getStatusColor(institution.status)}>
                                    {institution.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Email:</span>
                                  <p className="font-medium">{institution.email}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Address:</span>
                                  <p className="font-medium">{institution.address}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Registered Date:</span>
                                  <p className="font-medium">{formatDate(institution.registeredDate)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* NBA Coordinator Information */}
                        {institution.nbaCoordinator && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">NBA Coordinator</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Name:</span>
                                <p className="font-medium">{institution.nbaCoordinator.name}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Email:</span>
                                <p className="font-medium">{institution.nbaCoordinator.email}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Contact:</span>
                                <p className="font-medium">{institution.nbaCoordinator.contactNumber}</p>
                              </div>
                              {institution.nbaCoordinator.designation && (
                                <div>
                                  <span className="text-gray-600">Designation:</span>
                                  <p className="font-medium">{institution.nbaCoordinator.designation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Status Information */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Accreditation Status</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${institution.preQualifiersCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <span>Pre-Qualifiers: {institution.preQualifiersCompleted ? 'Completed' : 'Pending'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <span>Registration: Active</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}