
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, CircleDashed, FileWarning, RefreshCw } from 'lucide-react';
import { useMigrationTracker, MigrationEntity, MigrationStatus } from '@/hooks/use-migration-tracker';
import { MigrationHelper } from '@/components/admin/MigrationHelper';

const getStatusBadge = (status: MigrationStatus) => {
  switch (status) {
    case 'completed':
      return <Badge variant="success" className="bg-green-500">Completed</Badge>;
    case 'in-progress':
      return <Badge variant="warning" className="bg-yellow-500">In Progress</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
};

const getStatusIcon = (status: MigrationStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'in-progress':
      return <RefreshCw className="h-5 w-5 text-yellow-500" />;
    case 'failed':
      return <FileWarning className="h-5 w-5 text-red-500" />;
    default:
      return <CircleDashed className="h-5 w-5 text-gray-500" />;
  }
};

export default function MigrationStatus() {
  const { entities, overallProgress } = useMigrationTracker();
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Migration Status</h1>
          <p className="text-muted-foreground">
            Track the progress of migrating services to the new architecture
          </p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Migration completion percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {overallProgress}% Complete
              </div>
              <div className="text-sm text-muted-foreground">
                {entities.filter(e => e.status === 'completed').length} of {entities.length} entities
              </div>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Entity Migration Status</h2>
          
          <div className="space-y-4">
            {entities.map((entity) => (
              <Card key={entity.name} className="overflow-hidden">
                <div className="flex items-center">
                  <div className="p-4 flex-grow">
                    <div className="flex items-center">
                      {getStatusIcon(entity.status)}
                      <h3 className="text-lg font-medium ml-2">{entity.name}</h3>
                      <div className="ml-3">
                        {getStatusBadge(entity.status)}
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Progress: {entity.progressPercentage}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last updated: {entity.lastUpdated.toLocaleDateString()}
                        </div>
                      </div>
                      <Progress value={entity.progressPercentage} className="h-1.5" />
                    </div>
                    
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className={`text-xs px-2 py-1 rounded-md ${entity.apiMigrated ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                        API: {entity.apiMigrated ? 'Done' : 'Pending'}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-md ${entity.hooksMigrated ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                        Hooks: {entity.hooksMigrated ? 'Done' : 'Pending'}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-md ${entity.componentsMigrated ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                        UI: {entity.componentsMigrated ? 'Done' : 'Pending'}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" className="h-full rounded-l-none px-3 border-l" asChild>
                    <a href={`/admin/migration/${entity.name.toLowerCase()}`}>
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Migration Tools</h2>
          <MigrationHelper />
        </div>
      </div>
    </div>
  );
}
