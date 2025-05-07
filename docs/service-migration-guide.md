# Service Migration Guide

This document serves as a guide for migrating our application to use the new service structure with Supabase.

## Current Progress

- ✅ Core API services for students, schools, and invoices
- ✅ React Query hooks for data fetching
- ✅ New components using the services
- ✅ Routes updated to use new components

## Migration Steps

### 1. Service Layer Migration

- ✅ Create basic API service files for data models
- ✅ Implement React Query hooks
- ⬜ Migrate remaining services (transactions, users, etc.)

### 2. Component Migration

- ✅ Implement new school and student detail pages
- ⬜ Update list views to use the new services
- ⬜ Migrate form components

### 3. Reusing the Pattern

To migrate additional entities, follow this pattern:

1. Create/update API service (`src/services/[entity]/api.ts`)
2. Create React Query hooks (`src/services/[entity]/hooks.ts`)
3. Update components to use new hooks
4. Update routes to use new components

### 4. Testing & Validation

Before considering an entity fully migrated:

- Ensure all CRUD operations work correctly
- Test error handling
- Verify data flow and state management
- Check for performance issues

## Example Migration Pattern

For each entity:

```typescript
// 1. Define types
export interface EntityType {
  id: string;
  name: string;
  // other properties
}

// 2. Create API functions
export const fetchEntities = async (): Promise<EntityType[]> => {
  try {
    const { data, error } = await supabase
      .from('entities')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// 3. Implement hooks
export const useEntities = () => {
  return useQuery({
    queryKey: ['entities'],
    queryFn: fetchEntities
  });
};
```

## Next Steps

1. Focus on migrating the remaining core entities
2. Update UI components to use the new data hooks
3. Gradually phase out old service implementations
4. Create a comprehensive testing plan
