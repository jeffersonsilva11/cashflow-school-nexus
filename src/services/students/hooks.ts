
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchStudentById,
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  Student
} from './api';

// Hook to fetch all students
export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents
  });
};

// Hook to fetch a single student by ID
export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => fetchStudentById(id),
    enabled: !!id
  });
};

// Hook to create a new student
export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => createStudent(student),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};

// Hook to update an existing student
export const useUpdateStudent = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<Student>) => updateStudent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', id] });
    }
  });
};

// Hook to delete a student
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};
