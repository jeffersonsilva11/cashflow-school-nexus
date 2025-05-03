
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import {
  FinancialReport,
  FinancialReportOverviewData,
  RevenueByPlanItemData,
  MonthlyTrendItemData,
  FinancialReportCompleteData,
  CreateFinancialReportParams,
  UpdateFinancialReportFields,
  UpdateFinancialReportParams
} from './financialReportTypes';

// Function to fetch all financial reports
export async function fetchFinancialReports(): Promise<FinancialReport[]> {
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

// Function to fetch financial reports by type
export async function fetchFinancialReportsByType(type: string): Promise<FinancialReport[]> {
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

// Function to fetch the latest financial report by type
export async function fetchLatestFinancialReport(type: string): Promise<FinancialReport | null> {
  try {
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', type)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
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

// Function to create a new financial report
export async function createFinancialReport(
  report: CreateFinancialReportParams
): Promise<FinancialReport> {
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

// Function to update a financial report
export async function updateFinancialReport(
  id: string, 
  updates: UpdateFinancialReportFields
): Promise<FinancialReport> {
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

// Function to delete a financial report
export async function deleteFinancialReport(id: string): Promise<boolean> {
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

// React Query hooks
export function useFinancialReports() {
  return useQuery<FinancialReport[], Error>({
    queryKey: ['financial-reports'],
    queryFn: fetchFinancialReports,
  });
}

export function useFinancialReportsByType(type: string) {
  return useQuery<FinancialReport[], Error>({
    queryKey: ['financial-reports', type],
    queryFn: () => fetchFinancialReportsByType(type),
  });
}

export function useLatestFinancialReport(type: string) {
  return useQuery<FinancialReport | null, Error>({
    queryKey: ['financial-reports', 'latest', type],
    queryFn: () => fetchLatestFinancialReport(type),
  });
}

export function useCreateFinancialReport() {
  const queryClient = useQueryClient();
  
  return useMutation<FinancialReport, Error, CreateFinancialReportParams>({
    mutationFn: (params: CreateFinancialReportParams) => createFinancialReport(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', data.report_type] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', 'latest', data.report_type] });
      toast({ title: "Relatório financeiro criado com sucesso" });
    },
    onError: (error: Error) => {
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
  
  return useMutation<FinancialReport, Error, UpdateFinancialReportParams>({
    mutationFn: ({ id, updates }: UpdateFinancialReportParams) => updateFinancialReport(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', data.report_type] });
      queryClient.invalidateQueries({ queryKey: ['financial-reports', 'latest', data.report_type] });
      toast({ title: "Relatório financeiro atualizado com sucesso" });
    },
    onError: (error: Error) => {
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
  
  return useMutation<boolean, Error, string>({
    mutationFn: (id: string) => deleteFinancialReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-reports'] });
      toast({ title: "Relatório financeiro removido com sucesso" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao remover relatório financeiro", 
        description: error.message || "Ocorreu um erro ao remover o relatório",
        variant: "destructive" 
      });
    }
  });
}
