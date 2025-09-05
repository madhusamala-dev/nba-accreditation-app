import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/auth';
import { getInstitutionById, createApplication, generateApplicationId } from '@/lib/data';
import { Institution, Application, PROGRAMS_BY_CATEGORY } from '@/lib/types';

export default function NewApplication() {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [generatedSARs, setGeneratedSARs] = useState<string[]>([]);
  const [applicationId, setApplicationId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (user?.institutionId) {
      const inst = getInstitutionById(user.institutionId);
      setInstitution(inst);
      if (inst) {
        const appId = generateApplicationId(inst.institutionCode);
        setApplicationId(appId);
      }
    }
  }, [user]);

  useEffect(() => {
    // Generate SARs based on selected programs
    const sars = selectedPrograms.map(program => `SAR-${program.replace(/\s+/g, '-').replace(/[()]/g, '')}`);
    setGeneratedSARs(sars);
  }, [selectedPrograms]);

  const handleProgramToggle = (program: string) => {
    setSelectedPrograms(prev => 
      prev.includes(program) 
        ? prev.filter(p => p !== program)
        : [...prev, program]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedPrograms.length === 0) {
      setError('Please select at least one program');
      return;
    }

    if (!institution || !user) {
      setError('Institution data not found');
      return;
    }

    try {
      const application: Application = {
        id: `app-${Date.now()}`,
        institutionId: institution.id,
        applicationId,
        programs: selectedPrograms,
        sars: generatedSARs,
        createdDate: new Date().toISOString(),
        status: 'draft'
      };

      createApplication(application);
      setSuccess('Application created successfully!');
      
      setTimeout(() => {
        navigate('/institute/dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to create application. Please try again.');
    }
  };

  if (!institution) {
    return (
      <Layout title="New Application">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading institution data...</p>
        </div>
      </Layout>
    );
  }

  const availablePrograms = PROGRAMS_BY_CATEGORY[institution.institutionCategory] || [];

  return (
    <Layout title="New Application">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Application</CardTitle>
            <CardDescription>
              Select programs for your institution's NBA accreditation application
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Application ID */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm text-gray-700">Application ID</p>
                    <p className="text-lg font-mono">{applicationId}</p>
                  </div>
                  <Badge variant="outline">Auto-generated</Badge>
                </div>
              </div>

              {/* Institution Info */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Institution Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">Name:</span> {institution.name}</p>
                  <p><span className="font-medium">Code:</span> {institution.institutionCode}</p>
                  <p><span className="font-medium">Category:</span> {institution.institutionCategory}</p>
                  <p><span className="font-medium">Tier:</span> {institution.tierCategory}</p>
                </div>
              </div>

              {/* Program Selection */}
              <div>
                <h3 className="font-semibold mb-4">Select Programs</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Available programs for {institution.institutionCategory} category:
                </p>
                
                <div className="space-y-3">
                  {availablePrograms.map((program) => (
                    <div key={program} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={program}
                        checked={selectedPrograms.includes(program)}
                        onCheckedChange={() => handleProgramToggle(program)}
                      />
                      <label
                        htmlFor={program}
                        className="flex-1 text-sm font-medium cursor-pointer"
                      >
                        {program}
                      </label>
                    </div>
                  ))}
                </div>

                {availablePrograms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No programs available for {institution.institutionCategory} category
                  </div>
                )}
              </div>

              {/* Generated SARs Preview */}
              {generatedSARs.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-3 text-blue-900">Generated SARs</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    The following Self Assessment Reports (SARs) will be generated for your selected programs:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {generatedSARs.map((sar) => (
                      <Badge key={sar} variant="secondary" className="bg-blue-100 text-blue-800">
                        {sar}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/institute/dashboard')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={selectedPrograms.length === 0}>
                  Create Application
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}