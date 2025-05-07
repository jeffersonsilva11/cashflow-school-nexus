
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchSchools, 
  fetchSchoolById, 
  createSchool, 
  updateSchool, 
  deleteSchool,
  fetchSchoolStatistics,
  School
} from './api';

// Hook to fetch all schools
export const useSchools = () => {
  return useQuery({
    queryKey: ['schools'],
    queryFn: fetchSchools
  });
};

// Hook to fetch a single school by ID
export const useSchool = (id: string) => {
  return useQuery({
    queryKey: ['school', id],
    queryFn: () => fetchSchoolById(id),
    enabled: !!id
  });
};

// Hook to create a new school
export const useCreateSchool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (school: Omit<School, 'id' | 'created_at' | 'updated_at'>) => createSchool(school),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    }
  });
};

// Hook to update an existing school
export const useUpdateSchool = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<School>) => updateSchool(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      queryClient.invalidateQueries({ queryKey: ['school', id] });
    }
  });
};

// Hook to delete a school
export const useDeleteSchool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    }
  });
};

// Hook to fetch school statistics
export const useSchoolStatistics = () => {
  return useQuery({
    queryKey: ['school-statistics'],
    queryFn: fetchSchoolStatistics
  });
};
