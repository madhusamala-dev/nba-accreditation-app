import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InstituteFormData {
  nameAndAddress: string;
  affiliatingUniversity: string;
  yearOfEstablishment: string;
  institutionType: string[];
  ownershipStatus: string[];
  otherOwnershipSpecify: string;
}

interface InstituteInformationFormProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
}

export default function InstituteInformationForm({ isOpen, onClose, applicationId }: InstituteInformationFormProps) {
  const [formData, setFormData] = useState<InstituteFormData>({
    nameAndAddress: '',
    affiliatingUniversity: '',
    yearOfEstablishment: '',
    institutionType: [],
    ownershipStatus: [],
    otherOwnershipSpecify: ''
  });

  const institutionTypeOptions = [
    'University',
    'Autonomous',
    'Deemed University',
    'Affiliated',
    'Government Aided'
  ];

  const ownershipStatusOptions = [
    'Central Government',
    'State Government',
    'Government Aided',
    'Self Financing',
    'Trust',
    'Society',
    'Section 25 Company',
    'Any other specify'
  ];

  const handleCheckboxChange = (field: 'institutionType' | 'ownershipStatus', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSave = () => {
    console.log('Saving Institute Information (Part 1):', formData);
    localStorage.setItem(`institute-info-part1-${applicationId}`, JSON.stringify(formData));
    alert('Institute Information (Part 1) saved successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Institute Information Form - Part 1</DialogTitle>
          <DialogDescription>
            Complete the basic institute information for Application ID: {applicationId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Field 1: Name and Address */}
          <div className="space-y-2">
            <Label htmlFor="nameAndAddress">1. Name and Address of the Institution</Label>
            <Textarea
              id="nameAndAddress"
              value={formData.nameAndAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, nameAndAddress: e.target.value }))}
              placeholder="Enter the complete name and address of the institution"
              rows={4}
            />
          </div>

          {/* Field 2: Affiliating University */}
          <div className="space-y-2">
            <Label htmlFor="affiliatingUniversity">2. Name and Address of Affiliating University</Label>
            <Textarea
              id="affiliatingUniversity"
              value={formData.affiliatingUniversity}
              onChange={(e) => setFormData(prev => ({ ...prev, affiliatingUniversity: e.target.value }))}
              placeholder="Enter the name and address of affiliating university"
              rows={3}
            />
          </div>

          {/* Field 3: Year of Establishment */}
          <div className="space-y-2">
            <Label htmlFor="yearOfEstablishment">3. Year of Establishment of the Institution</Label>
            <Input
              id="yearOfEstablishment"
              type="number"
              value={formData.yearOfEstablishment}
              onChange={(e) => setFormData(prev => ({ ...prev, yearOfEstablishment: e.target.value }))}
              placeholder="Enter year"
            />
          </div>

          {/* Field 4: Type of Institution */}
          <div className="space-y-3">
            <Label>4. Type of Institution (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {institutionTypeOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${option}`}
                    checked={formData.institutionType.includes(option)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('institutionType', option, checked as boolean)
                    }
                  />
                  <Label htmlFor={`type-${option}`} className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Field 5: Ownership Status */}
          <div className="space-y-3">
            <Label>5. Ownership Status (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {ownershipStatusOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ownership-${option}`}
                    checked={formData.ownershipStatus.includes(option)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('ownershipStatus', option, checked as boolean)
                    }
                  />
                  <Label htmlFor={`ownership-${option}`} className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
            {formData.ownershipStatus.includes('Any other specify') && (
              <div className="mt-3">
                <Input
                  placeholder="Please specify"
                  value={formData.otherOwnershipSpecify}
                  onChange={(e) => setFormData(prev => ({ ...prev, otherOwnershipSpecify: e.target.value }))}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="space-x-2">
            <Button onClick={handleSave}>
              Save Part 1
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}