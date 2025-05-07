
import { useState, useEffect } from 'react';

export type MigrationStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface MigrationEntity {
  name: string;
  status: MigrationStatus;
  progressPercentage: number;
  apiMigrated: boolean;
  hooksMigrated: boolean;
  componentsMigrated: boolean;
  lastUpdated: Date;
}

const defaultEntities: MigrationEntity[] = [
  {
    name: 'Students',
    status: 'completed',
    progressPercentage: 100,
    apiMigrated: true,
    hooksMigrated: true,
    componentsMigrated: true,
    lastUpdated: new Date()
  },
  {
    name: 'Schools',
    status: 'completed',
    progressPercentage: 100,
    apiMigrated: true,
    hooksMigrated: true,
    componentsMigrated: true,
    lastUpdated: new Date()
  },
  {
    name: 'Invoices',
    status: 'in-progress',
    progressPercentage: 75,
    apiMigrated: true,
    hooksMigrated: true,
    componentsMigrated: false,
    lastUpdated: new Date()
  },
  {
    name: 'Transactions',
    status: 'in-progress',
    progressPercentage: 30,
    apiMigrated: true,
    hooksMigrated: false,
    componentsMigrated: false,
    lastUpdated: new Date()
  },
  {
    name: 'Users',
    status: 'pending',
    progressPercentage: 0,
    apiMigrated: false,
    hooksMigrated: false,
    componentsMigrated: false,
    lastUpdated: new Date()
  },
  {
    name: 'Devices',
    status: 'pending',
    progressPercentage: 0,
    apiMigrated: false,
    hooksMigrated: false,
    componentsMigrated: false,
    lastUpdated: new Date()
  }
];

export function useMigrationTracker() {
  // In a real implementation, this would be stored in a database or local storage
  const [entities, setEntities] = useState<MigrationEntity[]>(defaultEntities);
  
  const updateEntityStatus = (
    entityName: string, 
    updates: Partial<Omit<MigrationEntity, 'name' | 'lastUpdated'>>
  ) => {
    setEntities(prev => 
      prev.map(entity => 
        entity.name === entityName 
          ? { 
              ...entity, 
              ...updates, 
              lastUpdated: new Date() 
            } 
          : entity
      )
    );
  };
  
  const addEntity = (entity: Omit<MigrationEntity, 'lastUpdated'>) => {
    setEntities(prev => [
      ...prev, 
      { 
        ...entity, 
        lastUpdated: new Date() 
      }
    ]);
  };
  
  const calculateOverallProgress = (): number => {
    if (entities.length === 0) return 0;
    
    const total = entities.reduce(
      (sum, entity) => sum + entity.progressPercentage, 
      0
    );
    
    return Math.round(total / entities.length);
  };
  
  return {
    entities,
    updateEntityStatus,
    addEntity,
    overallProgress: calculateOverallProgress()
  };
}
