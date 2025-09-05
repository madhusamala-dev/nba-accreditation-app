import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface InstitutionForm {
  // Basic Information
  name: string;
  institutionCode: string;
  aisheCode: string;
  institutionCategory: string;
  tierCategory: string;
  establishedYear: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  website: string;
  
  // Head of Institution
  headName: string;
  headDesignation: string;
  headEmail: string;
  headMobile: string;
  
  // NBA Coordinator
  coordinatorName: string;
  coordinatorDesignation: string;
  coordinatorEmail: string;
  coordinatorPhone: string;
  
  // Additional Information
  totalDepartments: string;
  totalStudents: string;
  totalFaculty: string;
  accreditationHistory: string;
}

export default function OnboardInstitution() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InstitutionForm>({
    // Basic Information
    name: '',
    institutionCode: '',
    aisheCode: '',
    institutionCategory: '',
    tierCategory: '',
    establishedYear: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    website: '',
    
    // Head of Institution
    headName: '',
    headDesignation: '',
    headEmail: '',
    headMobile: '',
    
    // NBA Coordinator
    coordinatorName: '',
    coordinatorDesignation: '',
    coordinatorEmail: '',
    coordinatorPhone: '',
    
    // Additional Information
    totalDepartments: '',
    totalStudents: '',
    totalFaculty: '',
    accreditationHistory: ''
  });

  const handleInputChange = (field: keyof InstitutionForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Institution onboarded:', formData);
      
      // Reset form
      setFormData({
        name: '',
        institutionCode: '',
        aisheCode: '',
        institutionCategory: '',
        tierCategory: '',
        establishedYear: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        website: '',
        headName: '',
        headDesignation: '',
        headEmail: '',
        headMobile: '',
        coordinatorName: '',
        coordinatorDesignation: '',
        coordinatorEmail: '',
        coordinatorPhone: '',
        totalDepartments: '',
        totalStudents: '',
        totalFaculty: '',
        accreditationHistory: ''
      });
      
      setCurrentStep(1);
      
      // Show success message and redirect
      alert('Institution onboarded successfully!');
      navigate('/admin/view-institutions');
      
    } catch (error) {
      console.error('Error onboarding institution:', error);
      alert('Error onboarding institution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.institutionCode && formData.institutionCategory;
      case 2:
        return formData.headName && formData.headEmail && formData.coordinatorName && formData.coordinatorEmail;
      case 3:
        return formData.address && formData.city && formData.state;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                  placeholder="Enter established year"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institutionCategory">Institution Category *</Label>
                <Select
                  value={formData.institutionCategory}
                  onValueChange={(value) => handleInputChange('institutionCategory', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Autonomous">Autonomous</SelectItem>
                    <SelectItem value="Deemed University">Deemed University</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tierCategory">Tier Category</Label>
                <Select
                  value={formData.tierCategory}
                  onValueChange={(value) => handleInputChange('tierCategory', value)}
                >
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
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.institution.edu"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Head of Institution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Head of the Institution</CardTitle>
                <CardDescription>Information about the head of the institution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="headName">Name *</Label>
                    <Input
                      id="headName"
                      value={formData.headName}
                      onChange={(e) => handleInputChange('headName', e.target.value)}
                      placeholder="Enter head's name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headDesignation">Designation *</Label>
                    <Input
                      id="headDesignation"
                      value={formData.headDesignation}
                      onChange={(e) => handleInputChange('headDesignation', e.target.value)}
                      placeholder="Enter designation"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="headEmail">Email *</Label>
                    <Input
                      id="headEmail"
                      type="email"
                      value={formData.headEmail}
                      onChange={(e) => handleInputChange('headEmail', e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headMobile">Mobile No. *</Label>
                    <Input
                      id="headMobile"
                      type="tel"
                      value={formData.headMobile}
                      onChange={(e) => handleInputChange('headMobile', e.target.value)}
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NBA Coordinator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">NBA Coordinator Information</CardTitle>
                <CardDescription>Information about the NBA coordinator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coordinatorName">Name *</Label>
                    <Input
                      id="coordinatorName"
                      value={formData.coordinatorName}
                      onChange={(e) => handleInputChange('coordinatorName', e.target.value)}
                      placeholder="Enter coordinator's name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordinatorDesignation">Designation *</Label>
                    <Input
                      id="coordinatorDesignation"
                      value={formData.coordinatorDesignation}
                      onChange={(e) => handleInputChange('coordinatorDesignation', e.target.value)}
                      placeholder="Enter designation"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coordinatorEmail">E-mail *</Label>
                    <Input
                      id="coordinatorEmail"
                      type="email"
                      value={formData.coordinatorEmail}
                      onChange={(e) => handleInputChange('coordinatorEmail', e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordinatorPhone">Phone No. *</Label>
                    <Input
                      id="coordinatorPhone"
                      type="tel"
                      value={formData.coordinatorPhone}
                      onChange={(e) => handleInputChange('coordinatorPhone', e.target.value)}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter complete address"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalDepartments">Total Departments</Label>
                <Input
                  id="totalDepartments"
                  type="number"
                  value={formData.totalDepartments}
                  onChange={(e) => handleInputChange('totalDepartments', e.target.value)}
                  placeholder="Enter number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalStudents">Total Students</Label>
                <Input
                  id="totalStudents"
                  type="number"
                  value={formData.totalStudents}
                  onChange={(e) => handleInputChange('totalStudents', e.target.value)}
                  placeholder="Enter number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalFaculty">Total Faculty</Label>
                <Input
                  id="totalFaculty"
                  type="number"
                  value={formData.totalFaculty}
                  onChange={(e) => handleInputChange('totalFaculty', e.target.value)}
                  placeholder="Enter number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accreditationHistory">Accreditation History</Label>
              <Textarea
                id="accreditationHistory"
                value={formData.accreditationHistory}
                onChange={(e) => handleInputChange('accreditationHistory', e.target.value)}
                placeholder="Enter previous accreditation details, if any"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: 'Basic Information', description: 'Institution details' },
    { number: 2, title: 'Contact Information', description: 'Head & Coordinator details' },
    { number: 3, title: 'Address Information', description: 'Location details' },
    { number: 4, title: 'Additional Information', description: 'Statistics & history' }
  ];

  return (
    <AdminLayout title="Onboard New Institution">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 mt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isStepValid(currentStep)}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Onboarding...
                        </>
                      ) : (
                        'Complete Onboarding'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}