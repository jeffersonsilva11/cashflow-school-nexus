
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchInvoices, 
  fetchInvoiceById, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice,
  fetchInvoicesBySchool,
  fetchInvoiceStatistics,
  Invoice
} from './api';

// Hook to fetch all invoices
export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices
  });
};

// Hook to fetch invoices by school
export const useInvoicesBySchool = (schoolId: string) => {
  return useQuery({
    queryKey: ['invoices', 'school', schoolId],
    queryFn: () => fetchInvoicesBySchool(schoolId),
    enabled: !!schoolId
  });
};

// Hook to fetch a single invoice by ID
export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => fetchInvoiceById(id),
    enabled: !!id
  });
};

// Hook to create a new invoice
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => createInvoice(invoice),
    onSuccess: (newInvoice) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      if (newInvoice.school_id) {
        queryClient.invalidateQueries({ queryKey: ['invoices', 'school', newInvoice.school_id] });
      }
    }
  });
};

// Hook to update an existing invoice
export const useUpdateInvoice = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<Invoice>) => updateInvoice(id, updates),
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      if (updatedInvoice.school_id) {
        queryClient.invalidateQueries({ queryKey: ['invoices', 'school', updatedInvoice.school_id] });
      }
    }
  });
};

// Hook to delete an invoice
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });
};

// Hook to fetch invoice statistics
export const useInvoiceStatistics = () => {
  return useQuery({
    queryKey: ['invoice-statistics'],
    queryFn: fetchInvoiceStatistics
  });
};
