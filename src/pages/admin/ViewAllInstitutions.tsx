import { useState, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { institutions } from '@/lib/data';
import { Institution } from '@/lib/types';

export default function ViewAllInstitutions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  // Filter and search institutions
  const filteredInstitutions = useMemo(() => {
    return institutions.filter(institution => {
      const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          institution.institutionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          institution.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || institution.institutionCategory === categoryFilter;
      const matchesTier = tierFilter === 'all' || institution.tierCategory === tierFilter;
      
      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [searchTerm, categoryFilter, tierFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier I': return 'bg-blue-100 text-blue-800';
      case 'Tier II': return 'bg-purple-100 text-purple-800';
      case 'Tier III': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="View All Institutions">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{institutions.length}</p>
                  <p className="text-sm text-gray-600">Total Institutions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {institutions.filter(inst => inst.status === 'Active').length}
                  </p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {institutions.filter(inst => inst.status === 'Pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {institutions.filter(inst => inst.tierCategory === 'Tier I').length}
                  </p>
                  <p className="text-sm text-gray-600">Tier I</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search institutions by name, code, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Autonomous">Autonomous</SelectItem>
                  <SelectItem value="Deemed University">Deemed University</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="Tier I">Tier I</SelectItem>
                  <SelectItem value="Tier II">Tier II</SelectItem>
                  <SelectItem value="Tier III">Tier III</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Institutions List */}
        <Card>
          <CardHeader>
            <CardTitle>Institutions ({filteredInstitutions.length})</CardTitle>
            <CardDescription>
              Manage and view all registered institutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInstitutions.map((institution) => (
                <Card key={institution.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {institution.name}
                          </h3>
                          <Badge className={getStatusColor(institution.status)}>
                            {institution.status}
                          </Badge>
                          <Badge className={getTierColor(institution.tierCategory)}>
                            {institution.tierCategory}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Code:</span> {institution.institutionCode}
                          </div>
                          <div>
                            <span className="font-medium">Category:</span> {institution.institutionCategory}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {institution.city}, {institution.state}
                          </div>
                          <div>
                            <span className="font-medium">Established:</span> {institution.establishedYear}
                          </div>
                        </div>

                        {/* Head of Institution and NBA Coordinator Info */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Head of the Institution</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div><span className="font-medium">Name:</span> {institution.headName || 'N/A'}</div>
                              <div><span className="font-medium">Designation:</span> {institution.headDesignation || 'N/A'}</div>
                              <div><span className="font-medium">Email:</span> {institution.headEmail || 'N/A'}</div>
                              <div><span className="font-medium">Mobile No.:</span> {institution.headMobile || 'N/A'}</div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">NBA Coordinator Information</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div><span className="font-medium">Name:</span> {institution.coordinatorName}</div>
                              <div><span className="font-medium">Designation:</span> {institution.coordinatorDesignation || 'N/A'}</div>
                              <div><span className="font-medium">E-mail:</span> {institution.coordinatorEmail}</div>
                              <div><span className="font-medium">Phone No.:</span> {institution.coordinatorPhone || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedInstitution(institution)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{selectedInstitution?.name}</DialogTitle>
                              <DialogDescription>
                                Complete institution information and details
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedInstitution && (
                              <div className="space-y-6">
                                {/* Basic Information */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Basic Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div><span className="font-medium">Institution Code:</span> {selectedInstitution.institutionCode}</div>
                                    <div><span className="font-medium">AISHE Code:</span> {selectedInstitution.aisheCode || 'N/A'}</div>
                                    <div><span className="font-medium">Category:</span> {selectedInstitution.institutionCategory}</div>
                                    <div><span className="font-medium">Tier:</span> {selectedInstitution.tierCategory}</div>
                                    <div><span className="font-medium">Established:</span> {selectedInstitution.establishedYear}</div>
                                    <div><span className="font-medium">Website:</span> 
                                      {selectedInstitution.website ? (
                                        <a href={selectedInstitution.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                          {selectedInstitution.website}
                                        </a>
                                      ) : 'N/A'}
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Contact Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Head of the Institution</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                      <div><span className="font-medium">Name:</span> {selectedInstitution.headName || 'N/A'}</div>
                                      <div><span className="font-medium">Designation:</span> {selectedInstitution.headDesignation || 'N/A'}</div>
                                      <div><span className="font-medium">Email:</span> {selectedInstitution.headEmail || 'N/A'}</div>
                                      <div><span className="font-medium">Mobile No.:</span> {selectedInstitution.headMobile || 'N/A'}</div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">NBA Coordinator Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                      <div><span className="font-medium">Name:</span> {selectedInstitution.coordinatorName}</div>
                                      <div><span className="font-medium">Designation:</span> {selectedInstitution.coordinatorDesignation || 'N/A'}</div>
                                      <div><span className="font-medium">E-mail:</span> {selectedInstitution.coordinatorEmail}</div>
                                      <div><span className="font-medium">Phone No.:</span> {selectedInstitution.coordinatorPhone || 'N/A'}</div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Address Information */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Address Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="text-sm">
                                    <div className="mb-2">
                                      <span className="font-medium">Address:</span> {selectedInstitution.address}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div><span className="font-medium">City:</span> {selectedInstitution.city}</div>
                                      <div><span className="font-medium">State:</span> {selectedInstitution.state}</div>
                                      <div><span className="font-medium">Pincode:</span> {selectedInstitution.pincode || 'N/A'}</div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Additional Information */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Additional Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div><span className="font-medium">Total Departments:</span> {selectedInstitution.totalDepartments || 'N/A'}</div>
                                    <div><span className="font-medium">Total Students:</span> {selectedInstitution.totalStudents || 'N/A'}</div>
                                    <div><span className="font-medium">Total Faculty:</span> {selectedInstitution.totalFaculty || 'N/A'}</div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredInstitutions.length === 0 && (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No institutions found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search criteria or filters.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}