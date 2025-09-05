import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { addInstitution } from '@/lib/data';
import { Institution } from '@/lib/types';

export default function OnboardInstitution() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    institutionCode: '',
    aisheCode: '',
    institutionCategory: '',
    tierCategory: '',
    email: '',
    address: '',
    establishedYear: '',
    coordinatorName: '',
    coordinatorEmail: '',
    coordinatorPhone: '',
    nbaCoordinatorName: '',
    nbaCoordinatorEmail: '',
    nbaCoordinatorPhone: '',
    nbaCoordinatorDesignation: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      const requiredFields = ['name', 'institutionCode', 'institutionCategory', 'address', 'establishedYear', 'coordinatorName', 'coordinatorEmail', 'coordinatorPhone'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsLoading(false);
        return;
      }

      // Create institution object
      const newInstitution: Omit<Institution, 'id'> = {
        name: formData.name,
        institutionCode: formData.institutionCode,
        aisheCode: formData.aisheCode || undefined,
        institutionCategory: formData.institutionCategory,
        tierCategory: formData.tierCategory || undefined,
        email: formData.email || undefined,
        address: formData.address,
        establishedYear: parseInt(formData.establishedYear),
        coordinatorName: formData.coordinatorName,
        coordinatorEmail: formData.coordinatorEmail,
        coordinatorPhone: formData.coordinatorPhone,
        registeredDate: new Date().toISOString(),
        status: 'registered',
        preQualifiersCompleted: false,
        nbaCoordinator: formData.nbaCoordinatorName ? {
          name: formData.nbaCoordinatorName,
          email: formData.nbaCoordinatorEmail,
          contactNumber: formData.nbaCoordinatorPhone,
          designation: formData.nbaCoordinatorDesignation
        } : undefined
      };

      // Add institution
      const createdInstitution = addInstitution(newInstitution);
      
      setSuccess(`Institution "${createdInstitution.name}" has been successfully onboarded!`);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/admin/view-institutions');
      }, 2000);

    } catch (error) {
      console.error('Error onboarding institution:', error);
      setError('Failed to onboard institution. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Onboard New Institution">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of the institution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Institution Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter institution name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institutionCode">Institution Code *</Label>
                  <Input
                    id="institutionCode"
                    value={formData.institutionCode}
                    onChange={(e) => handleInputChange('institutionCode', e.target.value)}
                    placeholder="Enter institution code"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aisheCode">AISHE Code</Label>
                  <Input
                    id="aisheCode"
                    value={formData.aisheCode}
                    onChange={(e) => handleInputChange('aisheCode', e.target.value)}
                    placeholder="Enter AISHE code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year *</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                    placeholder="Enter established year"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institutionCategory">Institution Category *</Label>
                  <Select value={formData.institutionCategory} onValueChange={(value) => handleInputChange('institutionCategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="MBA">MBA</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Arts & Science">Arts & Science</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="Architecture">Architecture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tierCategory">Tier Category</Label>
                  <Select value={formData.tierCategory} onValueChange={(value) => handleInputChange('tierCategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tier I">Tier I</SelectItem>
                      <SelectItem value="Tier II">Tier II</SelectItem>
                      <SelectItem value="Tier III">Tier III</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Institution Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter institution email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Coordinator Information */}
          <Card>
            <CardHeader>
              <CardTitle>Coordinator Information</CardTitle>
              <CardDescription>Enter the details of the institution coordinator</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coordinatorName">Coordinator Name *</Label>
                  <Input
                    id="coordinatorName"
                    value={formData.coordinatorName}
                    onChange={(e) => handleInputChange('coordinatorName', e.target.value)}
                    placeholder="Enter coordinator name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coordinatorEmail">Coordinator Email *</Label>
                  <Input
                    id="coordinatorEmail"
                    type="email"
                    value={formData.coordinatorEmail}
                    onChange={(e) => handleInputChange('coordinatorEmail', e.target.value)}
                    placeholder="Enter coordinator email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coordinatorPhone">Coordinator Phone *</Label>
                  <Input
                    id="coordinatorPhone"
                    value={formData.coordinatorPhone}
                    onChange={(e) => handleInputChange('coordinatorPhone', e.target.value)}
                    placeholder="Enter coordinator phone"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NBA Coordinator Information */}
          <Card>
            <CardHeader>
              <CardTitle>NBA Coordinator Information</CardTitle>
              <CardDescription>Enter the details of the NBA coordinator (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nbaCoordinatorName">NBA Coordinator Name</Label>
                  <Input
                    id="nbaCoordinatorName"
                    value={formData.nbaCoordinatorName}
                    onChange={(e) => handleInputChange('nbaCoordinatorName', e.target.value)}
                    placeholder="Enter NBA coordinator name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nbaCoordinatorDesignation">Designation</Label>
                  <Input
                    id="nbaCoordinatorDesignation"
                    value={formData.nbaCoordinatorDesignation}
                    onChange={(e) => handleInputChange('nbaCoordinatorDesignation', e.target.value)}
                    placeholder="Enter designation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nbaCoordinatorEmail">NBA Coordinator Email</Label>
                  <Input
                    id="nbaCoordinatorEmail"
                    type="email"
                    value={formData.nbaCoordinatorEmail}
                    onChange={(e) => handleInputChange('nbaCoordinatorEmail', e.target.value)}
                    placeholder="Enter NBA coordinator email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nbaCoordinatorPhone">NBA Coordinator Phone</Label>
                  <Input
                    id="nbaCoordinatorPhone"
                    value={formData.nbaCoordinatorPhone}
                    onChange={(e) => handleInputChange('nbaCoordinatorPhone', e.target.value)}
                    placeholder="Enter NBA coordinator phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/view-institutions')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Onboarding...
                </div>
              ) : (
                'Onboard Institution'
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}