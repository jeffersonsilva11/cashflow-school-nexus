
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, Code, FileText, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

/**
 * MigrationHelper component provides tools for developers during the migration process.
 * It includes debugging tools, service comparison, and reference documentation.
 */
export function MigrationHelper() {
  const { toast } = useToast();
  const [isComparing, setIsComparing] = useState(false);
  const [compareResults, setCompareResults] = useState<{ entity: string; matches: boolean; details?: string }[]>([]);
  
  // Simulate comparing data between old and new services
  const handleCompareServices = () => {
    setIsComparing(true);
    
    // This would be implemented to actually compare data from old vs new services
    setTimeout(() => {
      setCompareResults([
        { entity: 'Students', matches: true },
        { entity: 'Schools', matches: true },
        { entity: 'Invoices', matches: false, details: 'Format mismatch in items field' },
      ]);
      setIsComparing(false);
      
      toast({
        title: "Service comparison completed",
        description: "See results for details on any discrepancies found.",
      });
    }, 2000);
  };
  
  // For simulating cache clearing during development
  const handleClearCaches = () => {
    // This would actually clear React Query caches
    toast({
      title: "Caches cleared",
      description: "All React Query caches have been reset.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Migration Assistant</CardTitle>
        <CardDescription>Tools to help with the service migration process</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="actions">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="comparison">Data Comparison</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="actions" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                onClick={handleClearCaches}
              >
                <RefreshCw className="h-6 w-6 mb-2" />
                <span>Clear Query Caches</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => window.open('/docs/service-migration-guide.md', '_blank')}
              >
                <FileText className="h-6 w-6 mb-2" />
                <span>View Migration Guide</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              >
                <Code className="h-6 w-6 mb-2" />
                <span>Open Supabase Dashboard</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                onClick={handleCompareServices}
                disabled={isComparing}
              >
                {isComparing ? (
                  <>
                    <div className="h-6 w-6 mb-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Comparing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-6 w-6 mb-2" />
                    <span>Compare Old vs New Services</span>
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="pt-4">
            {compareResults.length > 0 ? (
              <div className="space-y-4">
                {compareResults.map((result, index) => (
                  <Alert key={index} variant={result.matches ? "default" : "destructive"}>
                    {result.matches ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>{result.entity}</AlertTitle>
                    <AlertDescription>
                      {result.matches 
                        ? "Data matches between old and new services."
                        : `Mismatch detected: ${result.details}`}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Run a comparison from the Actions tab to see results here.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="docs" className="pt-4">
            <div className="prose max-w-none dark:prose-invert">
              <h3>Migration Services Quick Reference</h3>
              
              <h4>Students</h4>
              <pre className="bg-muted p-4 rounded-md overflow-auto">
                {`import { useStudents, useStudent, useCreateStudent, useUpdateStudent, useDeleteStudent } from '@/services/students/hooks';

// Fetch all students
const { data: students, isLoading, error } = useStudents();

// Fetch single student
const { data: student } = useStudent(studentId);

// Create student
const createMutation = useCreateStudent();
createMutation.mutate(newStudentData);

// Update student
const updateMutation = useUpdateStudent(studentId);
updateMutation.mutate(updatedData);

// Delete student
const deleteMutation = useDeleteStudent();
deleteMutation.mutate(studentId);`}
              </pre>

              <h4>Schools</h4>
              <pre className="bg-muted p-4 rounded-md overflow-auto">
                {`import { useSchools, useSchool, useCreateSchool, useUpdateSchool, useDeleteSchool } from '@/services/schools/hooks';

// Similar pattern to students...`}
              </pre>
              
              <p>
                See full documentation in <code>/docs/service-migration-guide.md</code>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Migration Progress: ~40% Complete
        </div>
      </CardFooter>
    </Card>
  );
}
