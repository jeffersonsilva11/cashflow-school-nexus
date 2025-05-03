
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Define types
export type FinancialReport = {
  id: string;
  report_type: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  data: any;
  created_at?: string;
  updated_at?: string;
};

// Fetch all financial reports
export async function fetchFinancialReports() {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as FinancialReport[];
  } catch (error) {
    console.error("Error fetching financial reports:", error);
    throw error;
  }
}

// Fetch financial reports by type
export async function fetchFinancialReportsByType(type: string) {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as FinancialReport[];
  } catch (error) {
    console.error(`Error fetching financial reports of type ${type}:`, error);
    throw error;
  }
}

// Fetch the latest financial report by type
export async function fetchLatestFinancialReport(type: string) {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', type)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      throw error;
    }
    return data as FinancialReport;
  } catch (error) {
    console.error(`Error fetching latest financial report of type ${type}:`, error);
    throw error;
  }
}

// Create a new financial report
export async function createFinancialReport(report: Omit<FinancialReport, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .insert(report)
      .select()
      .single();
    
    if (error) throw error;
    return data as FinancialReport;
  } catch (error) {
    console.error("Error creating financial report:", error);
    throw error;
  }
}

// Update a financial report
export async function updateFinancialReport(id: string, updates: Partial<FinancialReport>) {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as FinancialReport;
  } catch (error) {
    console.error(`Error updating financial report ${id}:`, error);
    throw error;
  }
}

// Delete a financial report
export async function deleteFinancialReport(id: string) {
  try {
    const { error } = await supabase
      .from('financial_reports')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting financial report ${id}:`, error);
    throw error;
  }
}

// React Query Hooks
export function useFinancialReports() {
  return useQuery({
    queryKey: ['financial-reports'],
    queryFn: fetchFinancialReports,
  });
}

export function useFinancialReportsByType(type: string) {
  return useQuery({
    queryKey: ['financial-reports', type],
    queryFn: () => fetchFinancialReportsByType(type),
  });
}

export function useLatestFinancialReport(type: string) {
  return useQuery({
    queryKey: ['financial-reports', 'latest', type],
    queryFn: () => fetchLatestFinancialReport(type),
  });
}

export function useCreateFinancialReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFinancialReport,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', data.report_type] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', 'latest', data.report_type] });
      toast({ title: "Relatório financeiro criado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar relatório financeiro", 
        description: error.message || "Ocorreu um erro ao criar o relatório",
        variant: "destructive" 
      });
    }
  });
}

export function useUpdateFinancialReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<FinancialReport> }) => 
      updateFinancialReport(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', data.report_type] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', 'latest', data.report_type] });
      toast({ title: "Relatório financeiro atualizado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar relatório financeiro", 
        description: error.message || "Ocorreu um erro ao atualizar o relatório",
        variant: "destructive" 
      });
    }
  });
}

export function useDeleteFinancialReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteFinancialReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      toast({ title: "Relatório financeiro removido com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover relatório financeiro", 
        description: error.message || "Ocorreu um erro ao remover o relatório",
        variant: "destructive" 
      });
    }
  });
}
