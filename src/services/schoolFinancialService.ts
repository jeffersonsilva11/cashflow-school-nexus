
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export type SchoolFinancial = {
  id: string;
  name: string;
  plan: string;
  monthlyFee: number;
  activeStudents: number;
  totalStudents: number;
  activeDevices: number;
  lastPayment: string;
  status: 'active' | 'pending' | 'overdue';
  totalRevenue?: number;
};

// Função para buscar os dados financeiros de todas as escolas
export async function fetchSchoolsFinancial() {
  try {
    // Buscar informações básicas das escolas
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name, subscription_status, subscription_plan');
    
    if (schoolsError) throw schoolsError;
    
    // Para cada escola, vamos buscar informações adicionais
    const financialData: SchoolFinancial[] = await Promise.all(
      schools.map(async (school) => {
        // Buscar estudantes ativos por escola
        const { count: activeStudents } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', school.id)
          .eq('active', true);
        
        // Buscar total de estudantes por escola
        const { count: totalStudents } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', school.id);
        
        // Buscar dispositivos ativos por escola
        const { count: activeDevices } = await supabase
          .from('devices')
          .select('*', { count: 'exact', head: true })
          .eq('school_id', school.id)
          .eq('status', 'active');
        
        // Buscar a fatura mais recente
        const { data: latestInvoice } = await supabase
          .from('invoices')
          .select('paid_date, amount')
          .eq('school_id', school.id)
          .order('issued_date', { ascending: false })
          .limit(1)
          .single();
        
        // Calcular receita total
        const { data: invoices } = await supabase
          .from('invoices')
          .select('amount')
          .eq('school_id', school.id)
          .eq('status', 'paid');
        
        const totalRevenue = invoices ? invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0) : 0;
        
        // Buscar assinatura atual
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('monthly_fee')
          .eq('school_id', school.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        // Mapear os dados para o formato esperado
        return {
          id: school.id,
          name: school.name,
          plan: school.subscription_plan || 'Basic',
          monthlyFee: subscription?.monthly_fee || 0,
          activeStudents: activeStudents || 0,
          totalStudents: totalStudents || 0,
          activeDevices: activeDevices || 0,
          lastPayment: latestInvoice?.paid_date || new Date().toISOString(),
          status: (school.subscription_status as 'active' | 'pending' | 'overdue') || 'pending',
          totalRevenue: totalRevenue
        };
      })
    );
    
    return financialData;
  } catch (error) {
    console.error("Error fetching schools financial data:", error);
    toast({
      title: "Erro ao carregar dados financeiros",
      description: "Não foi possível obter os dados financeiros das escolas.",
      variant: "destructive"
    });
    return [];
  }
}

// Função para buscar dados de tendências financeiras
export async function fetchFinancialTrends() {
  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('amount, paid_date, status')
      .eq('status', 'paid')
      .order('paid_date', { ascending: true });
    
    if (error) throw error;
    
    // Agrupar por mês
    const monthlyData = invoices.reduce((acc: any, invoice) => {
      if (!invoice.paid_date) return acc;
      
      const monthYear = new Date(invoice.paid_date).toLocaleDateString('pt-BR', {
        month: 'short',
        year: 'numeric'
      });
      
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      
      acc[monthYear] += Number(invoice.amount);
      return acc;
    }, {});
    
    // Converter para o formato esperado pelo gráfico
    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    }));
  } catch (error) {
    console.error("Error fetching financial trends:", error);
    return [];
  }
}

// Função para buscar distribuição de receita por plano
export async function fetchRevenueByPlan() {
  try {
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('plan_id, monthly_fee, status')
      .eq('status', 'active');
    
    if (error) throw error;
    
    // Buscar detalhes dos planos
    const { data: plans } = await supabase
      .from('plans')
      .select('id, name');
    
    if (!plans) return [];
    
    // Criar um mapa de id para nome do plano
    const planMap = new Map(plans.map(plan => [plan.id, plan.name]));
    
    // Agrupar por plano
    const planData = subscriptions.reduce((acc: any, subscription) => {
      const planName = planMap.get(subscription.plan_id) || 'Desconhecido';
      
      if (!acc[planName]) {
        acc[planName] = 0;
      }
      
      acc[planName] += Number(subscription.monthly_fee);
      return acc;
    }, {});
    
    // Converter para o formato esperado pelo gráfico
    return Object.entries(planData).map(([plan, revenue]) => ({
      plan,
      revenue,
      percentage: 0 // Será calculado no componente
    }));
  } catch (error) {
    console.error("Error fetching revenue by plan:", error);
    return [];
  }
}

// React Query hooks
export function useSchoolsFinancial() {
  return useQuery({
    queryKey: ['schoolsFinancial'],
    queryFn: fetchSchoolsFinancial,
  });
}

export function useFinancialTrends() {
  return useQuery({
    queryKey: ['financialTrends'],
    queryFn: fetchFinancialTrends,
  });
}

export function useRevenueByPlan() {
  return useQuery({
    queryKey: ['revenueByPlan'],
    queryFn: fetchRevenueByPlan,
  });
}
