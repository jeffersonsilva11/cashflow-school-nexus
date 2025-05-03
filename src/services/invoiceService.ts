
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Define types
export type InvoiceItem = {
  description: string;
  amount: number;
  quantity?: number;
};

export type Invoice = {
  id: string;
  invoice_id: string;
  school_id: string;
  amount: number;
  issued_date: string;
  due_date: string;
  paid_date?: string | null;
  status: 'paid' | 'pending' | 'overdue' | 'canceled';
  items?: InvoiceItem[];
  subscription_id?: string | null;
  created_at?: string;
  updated_at?: string;
  // Include these when using joins
  school?: { name: string };
};

// Fetch all invoices
export async function fetchInvoices() {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        school:school_id (name)
      `)
      .order('issued_date', { ascending: false });
    
    if (error) throw error;
    return data as Invoice[];
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
}

// Fetch invoices for a specific school
export async function fetchSchoolInvoices(schoolId: string) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        school:school_id (name)
      `)
      .eq('school_id', schoolId)
      .order('issued_date', { ascending: false });
    
    if (error) throw error;
    return data as Invoice[];
  } catch (error) {
    console.error(`Error fetching invoices for school ${schoolId}:`, error);
    throw error;
  }
}

// Fetch a single invoice
export async function fetchInvoiceById(id: string) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        school:school_id (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Invoice;
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    throw error;
  }
}

// Create a new invoice
export async function createInvoice(invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'school'>) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();
    
    if (error) throw error;
    return data as Invoice;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
}

// Update an invoice
export async function updateInvoice(id: string, updates: Partial<Omit<Invoice, 'school'>>) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Invoice;
  } catch (error) {
    console.error(`Error updating invoice ${id}:`, error);
    throw error;
  }
}

// Delete an invoice
export async function deleteInvoice(id: string) {
  try {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting invoice ${id}:`, error);
    throw error;
  }
}

// Mark invoice as paid
export async function markInvoiceAsPaid(id: string, paidDate: string = new Date().toISOString().split('T')[0]) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        paid_date: paidDate
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Invoice;
  } catch (error) {
    console.error(`Error marking invoice ${id} as paid:`, error);
    throw error;
  }
}

// React Query Hooks
export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });
}

export function useSchoolInvoices(schoolId: string | undefined) {
  return useQuery({
    queryKey: ['invoices', 'school', schoolId],
    queryFn: () => fetchSchoolInvoices(schoolId as string),
    enabled: !!schoolId,
  });
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => fetchInvoiceById(id as string),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'school', data.school_id] });
      toast({ title: "Fatura criada com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar fatura", 
        description: error.message || "Ocorreu um erro ao criar a fatura",
        variant: "destructive" 
      });
    }
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Omit<Invoice, 'school'>> }) => 
      updateInvoice(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'school', data.school_id] });
      toast({ title: "Fatura atualizada com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar fatura", 
        description: error.message || "Ocorreu um erro ao atualizar a fatura",
        variant: "destructive" 
      });
    }
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ title: "Fatura removida com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover fatura", 
        description: error.message || "Ocorreu um erro ao remover a fatura",
        variant: "destructive" 
      });
    }
  });
}

export function useMarkInvoiceAsPaid() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, paidDate }: { id: string, paidDate?: string }) => 
      markInvoiceAsPaid(id, paidDate),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
      queryClient.invalidateQueries({ queryKey: ['invoices', 'school', data.school_id] });
      toast({ title: "Fatura marcada como paga com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao marcar fatura como paga", 
        description: error.message || "Ocorreu um erro ao atualizar o status da fatura",
        variant: "destructive" 
      });
    }
  });
}
