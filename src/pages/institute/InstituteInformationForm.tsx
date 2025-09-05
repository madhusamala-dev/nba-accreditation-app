import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface InstituteInformationFormProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  onProgressUpdate?: (applicationId: string, progress: number) => void;
}

interface OtherInstitution {
  id: string;
  nameOfInstitution: string;
  yearOfEstablishment: string;
  programsOfStudy: string;
  location: string;
}

interface ProgramDetail {
  id: string;
  nameOfProgram: string;
  programAppliedLevel: string;
  startOfYear: string;
  yearOfAICTEApproval: string;
  initialIntake: string;
  intakeIncrease: string;
  currentIntake: string;
  accreditationStatus: string;
  from: string;
  to: string;
  programForConsideration: string;
  programForDuration: string;
}

interface AccreditationProgram {
  id: string;
  sNo: number;
  level: string;
  discipline: string;
  program: string;
}

export default function InstituteInformationForm({ isOpen, onClose, applicationId, onProgressUpdate }: InstituteInformationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    nameAndAddressOfInstitution: '',
    nameAndAddressOfAffiliatingUniversity: '',
    yearOfEstablishment: '',
    typeOfInstitution: [] as string[],
    ownershipStatus: [] as string[],
    ownershipStatusOther: ''
  });

  const [otherInstitutions, setOtherInstitutions] = useState<OtherInstitution[]>([
    { id: '1', nameOfInstitution: '', yearOfEstablishment: '', programsOfStudy: '', location: '' }
  ]);

  const [programDetails, setProgramDetails] = useState<ProgramDetail[]>([
    {
      id: '1',
      nameOfProgram: '',
      programAppliedLevel: '',
      startOfYear: '',
      yearOfAICTEApproval: '',
      initialIntake: '',
      intakeIncrease: '',
      currentIntake: '',
      accreditationStatus: '',
      from: '',
      to: '',
      programForConsideration: '',
      programForDuration: ''
    }
  ]);

  const [accreditationPrograms, setAccreditationPrograms] = useState<AccreditationProgram[]>([
    { id: '1', sNo: 1, level: '', discipline: '', program: '' }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: 'typeOfInstitution' | 'ownershipStatus', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));

    if (field === 'ownershipStatus' && value === 'Any other specify' && !checked) {
      setFormData(prev => ({ ...prev, ownershipStatusOther: '' }));
    }
  };

  const calculateProgress = () => {
    let completedFields = 0;
    const totalFields = 8;

    if (formData.nameAndAddressOfInstitution.trim()) completedFields++;
    if (formData.nameAndAddressOfAffiliatingUniversity.trim()) completedFields++;
    if (formData.yearOfEstablishment.trim()) completedFields++;
    if (formData.typeOfInstitution.length > 0) completedFields++;
    if (formData.ownershipStatus.length > 0) completedFields++;

    const hasOtherInstitutionData = otherInstitutions.some(inst => 
      inst.nameOfInstitution.trim() || inst.yearOfEstablishment.trim() || 
      inst.programsOfStudy.trim() || inst.location.trim()
    );
    if (hasOtherInstitutionData) completedFields++;

    const hasProgramDetailData = programDetails.some(prog => 
      prog.nameOfProgram.trim() || prog.programAppliedLevel.trim() || 
      prog.startOfYear.trim() || prog.yearOfAICTEApproval.trim()
    );
    if (hasProgramDetailData) completedFields++;

    const hasAccreditationProgramData = accreditationPrograms.some(prog => 
      prog.level.trim() || prog.discipline.trim() || prog.program.trim()
    );
    if (hasAccreditationProgramData) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  const handleSave = () => {
    const progress = calculateProgress();
    
    const savedData = {
      applicationId,
      part1: formData,
      part2: {
        otherInstitutions,
        programDetails,
        accreditationPrograms
      },
      progress,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(`institute_form_${applicationId}`, JSON.stringify(savedData));
    
    if (onProgressUpdate) {
      onProgressUpdate(applicationId, progress);
    }
    
    alert(`Form data saved successfully! Progress: ${progress}%`);
    onClose();
  };

  const loadSavedData = () => {
    const savedData = localStorage.getItem(`institute_form_${applicationId}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.part1 || formData);
      setOtherInstitutions(parsed.part2?.otherInstitutions || otherInstitutions);
      setProgramDetails(parsed.part2?.programDetails || programDetails);
      setAccreditationPrograms(parsed.part2?.accreditationPrograms || accreditationPrograms);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSavedData();
    }
  }, [isOpen]);

  // Other Institutions Table Functions
  const addOtherInstitution = () => {
    const newId = (otherInstitutions.length + 1).toString();
    setOtherInstitutions([...otherInstitutions, {
      id: newId,
      nameOfInstitution: '',
      yearOfEstablishment: '',
      programsOfStudy: '',
      location: ''
    }]);
  };

  const deleteOtherInstitution = (id: string) => {
    if (otherInstitutions.length > 1) {
      setOtherInstitutions(otherInstitutions.filter(inst => inst.id !== id));
    }
  };

  const updateOtherInstitution = (id: string, field: string, value: string) => {
    setOtherInstitutions(otherInstitutions.map(inst =>
      inst.id === id ? { ...inst, [field]: value } : inst
    ));
  };

  // Program Details Table Functions
  const addProgramDetail = () => {
    const newId = (programDetails.length + 1).toString();
    setProgramDetails([...programDetails, {
      id: newId,
      nameOfProgram: '',
      programAppliedLevel: '',
      startOfYear: '',
      yearOfAICTEApproval: '',
      initialIntake: '',
      intakeIncrease: '',
      currentIntake: '',
      accreditationStatus: '',
      from: '',
      to: '',
      programForConsideration: '',
      programForDuration: ''
    }]);
  };

  const deleteProgramDetail = (id: string) => {
    if (programDetails.length > 1) {
      setProgramDetails(programDetails.filter(prog => prog.id !== id));
    }
  };

  const updateProgramDetail = (id: string, field: string, value: string) => {
    setProgramDetails(programDetails.map(prog =>
      prog.id === id ? { ...prog, [field]: value } : prog
    ));
  };

  // Accreditation Programs Table Functions
  const addAccreditationProgram = () => {
    const newId = (accreditationPrograms.length + 1).toString();
    const newSNo = accreditationPrograms.length + 1;
    setAccreditationPrograms([...accreditationPrograms, {
      id: newId,
      sNo: newSNo,
      level: '',
      discipline: '',
      program: ''
    }]);
  };

  const deleteAccreditationProgram = (id: string) => {
    if (accreditationPrograms.length > 1) {
      const filtered = accreditationPrograms.filter(prog => prog.id !== id);
      // Renumber the S.No
      const renumbered = filtered.map((prog, index) => ({ ...prog, sNo: index + 1 }));
      setAccreditationPrograms(renumbered);
    }
  };

  const updateAccreditationProgram = (id: string, field: string, value: string) => {
    setAccreditationPrograms(accreditationPrograms.map(prog =>
      prog.id === id ? { ...prog, [field]: value } : prog
    ));
  };

  const typeOfInstitutionOptions = [
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

  const currentProgress = calculateProgress();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Institute Information Form - {applicationId}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Step {currentStep} of 2
              </Badge>
              <Badge variant="secondary">
                Progress: {currentProgress}%
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Part 1: Basic Information (Fields 1-5)</CardTitle>
              <CardDescription>
                Please fill in the basic information about your institution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nameAndAddressOfInstitution">1. Name and Address of the Institution</Label>
                <Textarea
                  id="nameAndAddressOfInstitution"
                  value={formData.nameAndAddressOfInstitution}
                  onChange={(e) => handleInputChange('nameAndAddressOfInstitution', e.target.value)}
                  placeholder="Enter institution name and complete address"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameAndAddressOfAffiliatingUniversity">2. Name and address of Affiliating University</Label>
                <Textarea
                  id="nameAndAddressOfAffiliatingUniversity"
                  value={formData.nameAndAddressOfAffiliatingUniversity}
                  onChange={(e) => handleInputChange('nameAndAddressOfAffiliatingUniversity', e.target.value)}
                  placeholder="Enter affiliating university name and address"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearOfEstablishment">3. Year of Establishment of the Institution</Label>
                <Input
                  id="yearOfEstablishment"
                  value={formData.yearOfEstablishment}
                  onChange={(e) => handleInputChange('yearOfEstablishment', e.target.value)}
                  placeholder="Enter year of establishment"
                  type="number"
                />
              </div>

              <div className="space-y-3">
                <Label>4. Type of Institution</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {typeOfInstitutionOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${option}`}
                        checked={formData.typeOfInstitution.includes(option)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('typeOfInstitution', option, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`type-${option}`} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.typeOfInstitution.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Selected: {formData.typeOfInstitution.join(', ')}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>5. Ownership Status</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ownershipStatusOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`ownership-${option}`}
                        checked={formData.ownershipStatus.includes(option)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('ownershipStatus', option, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`ownership-${option}`} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
                
                {formData.ownershipStatus.includes('Any other specify') && (
                  <div className="mt-3">
                    <Label htmlFor="ownershipStatusOther">Please specify:</Label>
                    <Input
                      id="ownershipStatusOther"
                      value={formData.ownershipStatusOther}
                      onChange={(e) => handleInputChange('ownershipStatusOther', e.target.value)}
                      placeholder="Please specify the ownership status"
                      className="mt-1"
                    />
                  </div>
                )}
                
                {formData.ownershipStatus.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Selected: {formData.ownershipStatus.join(', ')}
                    {formData.ownershipStatus.includes('Any other specify') && formData.ownershipStatusOther && 
                      ` (${formData.ownershipStatusOther})`
                    }
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Part 2: Additional Information (Fields 6-8)</CardTitle>
                <CardDescription>
                  Please provide detailed information about programs and institutions
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Field 6: Other Academic Institutions */}
            <Card>
              <CardHeader>
                <CardTitle>6. Other Academic Institution of the Trust / Society / Company etc. if any:</CardTitle>
                <CardDescription>
                  Add details of other academic institutions under the same trust/society/company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={addOtherInstitution} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Row
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name of Institution</TableHead>
                          <TableHead>Year of Establishment</TableHead>
                          <TableHead>Programs of Study</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {otherInstitutions.map((institution) => (
                          <TableRow key={institution.id}>
                            <TableCell>
                              <Input
                                value={institution.nameOfInstitution}
                                onChange={(e) => updateOtherInstitution(institution.id, 'nameOfInstitution', e.target.value)}
                                placeholder="Institution name"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={institution.yearOfEstablishment}
                                onChange={(e) => updateOtherInstitution(institution.id, 'yearOfEstablishment', e.target.value)}
                                placeholder="Year"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={institution.programsOfStudy}
                                onChange={(e) => updateOtherInstitution(institution.id, 'programsOfStudy', e.target.value)}
                                placeholder="Programs"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={institution.location}
                                onChange={(e) => updateOtherInstitution(institution.id, 'location', e.target.value)}
                                placeholder="Location"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteOtherInstitution(institution.id)}
                                disabled={otherInstitutions.length === 1}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Field 7: Program Details */}
            <Card>
              <CardHeader>
                <CardTitle>7. Details of all the programs being offered by the institution under consideration</CardTitle>
                <CardDescription>
                  Provide comprehensive details of all programs offered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={addProgramDetail} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Row
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Name of Program</TableHead>
                          <TableHead className="min-w-[120px]">Program Applied Level</TableHead>
                          <TableHead className="min-w-[100px]">Start of Year</TableHead>
                          <TableHead className="min-w-[120px]">Year of AICTE Approval</TableHead>
                          <TableHead className="min-w-[100px]">Initial Intake</TableHead>
                          <TableHead className="min-w-[120px]">Intake Increase</TableHead>
                          <TableHead className="min-w-[100px]">Current Intake</TableHead>
                          <TableHead className="min-w-[120px]">Accreditation Status</TableHead>
                          <TableHead className="min-w-[80px]">From</TableHead>
                          <TableHead className="min-w-[80px]">To</TableHead>
                          <TableHead className="min-w-[140px]">Program For Consideration</TableHead>
                          <TableHead className="min-w-[120px]">Program For Duration</TableHead>
                          <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {programDetails.map((program) => (
                          <TableRow key={program.id}>
                            <TableCell>
                              <Input
                                value={program.nameOfProgram}
                                onChange={(e) => updateProgramDetail(program.id, 'nameOfProgram', e.target.value)}
                                placeholder="Program name"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={program.programAppliedLevel}
                                onValueChange={(value) => updateProgramDetail(program.id, 'programAppliedLevel', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="UG">UG</SelectItem>
                                  <SelectItem value="PG">PG</SelectItem>
                                  <SelectItem value="Diploma">Diploma</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={program.startOfYear}
                                onChange={(e) => updateProgramDetail(program.id, 'startOfYear', e.target.value)}
                                placeholder="Year"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={program.yearOfAICTEApproval}
                                onChange={(e) => updateProgramDetail(program.id, 'yearOfAICTEApproval', e.target.value)}
                                placeholder="Year"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={program.initialIntake}
                                onChange={(e) => updateProgramDetail(program.id, 'initialIntake', e.target.value)}
                                placeholder="Number"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={program.intakeIncrease}
                                onValueChange={(value) => updateProgramDetail(program.id, 'intakeIncrease', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={program.currentIntake}
                                onChange={(e) => updateProgramDetail(program.id, 'currentIntake', e.target.value)}
                                placeholder="Number"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={program.accreditationStatus}
                                onChange={(e) => updateProgramDetail(program.id, 'accreditationStatus', e.target.value)}
                                placeholder="Status"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={program.from}
                                onChange={(e) => updateProgramDetail(program.id, 'from', e.target.value)}
                                placeholder="From"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={program.to}
                                onChange={(e) => updateProgramDetail(program.id, 'to', e.target.value)}
                                placeholder="To"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={program.programForConsideration}
                                onValueChange={(value) => updateProgramDetail(program.id, 'programForConsideration', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={program.programForDuration}
                                onChange={(e) => updateProgramDetail(program.id, 'programForDuration', e.target.value)}
                                placeholder="Duration"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteProgramDetail(program.id)}
                                disabled={programDetails.length === 1}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Field 8: Accreditation Programs */}
            <Card>
              <CardHeader>
                <CardTitle>8. Programs to be considered for Accreditation vide this application:</CardTitle>
                <CardDescription>
                  List all programs that need to be considered for accreditation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={addAccreditationProgram} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Row
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">S No</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Discipline</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accreditationPrograms.map((program) => (
                          <TableRow key={program.id}>
                            <TableCell>
                              <div className="text-center font-medium">{program.sNo}</div>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={program.level}
                                onChange={(e) => updateAccreditationProgram(program.id, 'level', e.target.value)}
                                placeholder="Level"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={program.discipline}
                                onChange={(e) => updateAccreditationProgram(program.id, 'discipline', e.target.value)}
                                placeholder="Discipline"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={program.program}
                                onChange={(e) => updateAccreditationProgram(program.id, 'program', e.target.value)}
                                placeholder="Program"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteAccreditationProgram(program.id)}
                                disabled={accreditationPrograms.length === 1}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation and Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            
            {currentStep < 2 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Form
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}