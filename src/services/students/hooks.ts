
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchStudents, 
  fetchStudentById, 
  createStudent, 
  updateStudent, 
  deleteStudent,
  fetchStudentsBySchool,
  fetchStudentStatistics,
  Student
} from './service';

// Hook to fetch all students
export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents
  });
};

// Hook to fetch students by school
export const useStudentsBySchool = (schoolId: string) => {
  return useQuery({
    queryKey: ['students', 'school', schoolId],
    queryFn: () => fetchStudentsBySchool(schoolId),
    enabled: !!schoolId
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
    onSuccess: (newStudent) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      if (newStudent.school_id) {
        queryClient.invalidateQueries({ queryKey: ['students', 'school', newStudent.school_id] });
      }
    }
  });
};

// Hook to update an existing student
export const useUpdateStudent = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<Student>) => updateStudent(id, updates),
    onSuccess: (updatedStudent) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', id] });
      if (updatedStudent.school_id) {
        queryClient.invalidateQueries({ queryKey: ['students', 'school', updatedStudent.school_id] });
      }
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

// Hook to fetch student statistics
export const useStudentStatistics = () => {
  return useQuery({
    queryKey: ['student-statistics'],
    queryFn: fetchStudentStatistics
  });
};
