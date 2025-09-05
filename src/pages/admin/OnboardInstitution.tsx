import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { addInstitution } from '@/lib/data';
import { Institution } from '@/lib/types';

export default function OnboardInstitution() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    aisheCode: '',
    institutionCode: '',
    tierCategory: '',
    institutionCategory: '',
    email: '',
    password: '',
    nbaCoordinatorName: '',
    nbaCoordinatorDesignation: '',
    nbaCoordinatorEmail: '',
    nbaCoordinatorContact: '',
    chairmanName: '',
    chairmanDesignation: '',
    chairmanEmail: '',
    chairmanContact: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newInstitution: Institution = {
      id: Date.now().toString(),
      name: formData.name,
      aisheCode: formData.aisheCode,
      institutionCode: formData.institutionCode,
      tierCategory: formData.tierCategory as 'Tier I' | 'Tier II' | 'Tier III',
      institutionCategory: formData.institutionCategory as 'Engineering' | 'Management' | 'Pharmacy' | 'MCA' | 'Architecture' | 'Hospitality & Tourism Management',
      email: formData.email,
      password: formData.password,
      nbaCoordinator: {
        name: formData.nbaCoordinatorName,
        designation: formData.nbaCoordinatorDesignation,
        email: formData.nbaCoordinatorEmail,
        contactNumber: formData.nbaCoordinatorContact
      },
      chairman: {
        name: formData.chairmanName,
        designation: formData.chairmanDesignation,
        email: formData.chairmanEmail,
        contactNumber: formData.chairmanContact
      },
      address: formData.address,
      registeredDate: new Date().toISOString(),
      status: 'registered'
    };

    addInstitution(newInstitution);
    navigate('/admin/dashboard');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout title="Onboard New Institution">
      <Card>
        <CardHeader>
          <CardTitle>Institution Registration</CardTitle>
          <CardDescription>
            Register a new institution for NBA accreditation process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Institution Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Institution Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aisheCode">AISHE Code</Label>
                <Input
                  id="aisheCode"
                  value={formData.aisheCode}
                  onChange={(e) => handleInputChange('aisheCode', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institutionCode">Institution Code</Label>
                <Input
                  id="institutionCode"
                  value={formData.institutionCode}
                  onChange={(e) => handleInputChange('institutionCode', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tierCategory">Tier Category</Label>
                <Select onValueChange={(value) => handleInputChange('tierCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tier I">Tier I</SelectItem>
                    <SelectItem value="Tier II">Tier II</SelectItem>
                    <SelectItem value="Tier III">Tier III</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="institutionCategory">Institution Category</Label>
                <Select onValueChange={(value) => handleInputChange('institutionCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="MCA">MCA</SelectItem>
                    <SelectItem value="Architecture">Architecture</SelectItem>
                    <SelectItem value="Hospitality & Tourism Management">Hospitality & Tourism Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* NBA Coordinator Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">NBA Coordinator Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nbaCoordinatorName">Name</Label>
                  <Input
                    id="nbaCoordinatorName"
                    value={formData.nbaCoordinatorName}
                    onChange={(e) => handleInputChange('nbaCoordinatorName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nbaCoordinatorDesignation">Designation</Label>
                  <Input
                    id="nbaCoordinatorDesignation"
                    value={formData.nbaCoordinatorDesignation}
                    onChange={(e) => handleInputChange('nbaCoordinatorDesignation', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nbaCoordinatorEmail">Email</Label>
                  <Input
                    id="nbaCoordinatorEmail"
                    type="email"
                    value={formData.nbaCoordinatorEmail}
                    onChange={(e) => handleInputChange('nbaCoordinatorEmail', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nbaCoordinatorContact">Contact Number</Label>
                  <Input
                    id="nbaCoordinatorContact"
                    value={formData.nbaCoordinatorContact}
                    onChange={(e) => handleInputChange('nbaCoordinatorContact', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Chairman Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Chairman Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chairmanName">Name</Label>
                  <Input
                    id="chairmanName"
                    value={formData.chairmanName}
                    onChange={(e) => handleInputChange('chairmanName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chairmanDesignation">Designation</Label>
                  <Input
                    id="chairmanDesignation"
                    value={formData.chairmanDesignation}
                    onChange={(e) => handleInputChange('chairmanDesignation', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chairmanEmail">Email</Label>
                  <Input
                    id="chairmanEmail"
                    type="email"
                    value={formData.chairmanEmail}
                    onChange={(e) => handleInputChange('chairmanEmail', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chairmanContact">Contact Number</Label>
                  <Input
                    id="chairmanContact"
                    value={formData.chairmanContact}
                    onChange={(e) => handleInputChange('chairmanContact', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard')}>
                Cancel
              </Button>
              <Button type="submit">
                Register Institution
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}