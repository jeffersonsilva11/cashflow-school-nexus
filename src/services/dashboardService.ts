
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Define dashboard statistics types
export type DashboardStatistics = {
  activeSchools: number;
  totalStudents: number;
  dailyTransactions: number;
  monthlyVolume: number;
  growthRate: {
    schools: number;
    transactions: number;
    volume: number;
  };
  transactionByType: {
    purchase: number;
    reload: number;
  };
};

export type TransactionTrend = {
  date: string;
  volume: number;
}[];

export type TransactionTypeData = {
  name: string;
  value: number;
}[];

// Helper function to calculate growth rate
async function calculateGrowthRate(table: string, currentPeriodStart: Date, previousPeriodStart: Date) {
  try {
    // Get current period count
    const { count: currentCount, error: currentError } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .gte('created_at', currentPeriodStart.toISOString());
    
    if (currentError) throw currentError;
    
    // Get previous period count
    const { count: previousCount, error: previousError } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .gte('created_at', previousPeriodStart.toISOString())
      .lt('created_at', currentPeriodStart.toISOString());
    
    if (previousError) throw previousError;
    
    // Calculate growth rate
    if (previousCount && previousCount > 0) {
      return ((currentCount - previousCount) / previousCount) * 100;
    }
    
    return 0; // No previous data to compare
  } catch (error) {
    console.error(`Error calculating growth rate for ${table}:`, error);
    return 0;
  }
}

// Calculate volume growth rate
async function calculateVolumeGrowthRate(currentPeriodStart: Date, previousPeriodStart: Date) {
  try {
    // Get current period volume
    const { data: currentData, error: currentError } = await supabase
      .from('transactions')
      .select('amount')
      .gte('transaction_date', currentPeriodStart.toISOString());
    
    if (currentError) throw currentError;
    
    // Get previous period volume
    const { data: previousData, error: previousError } = await supabase
      .from('transactions')
      .select('amount')
      .gte('transaction_date', previousPeriodStart.toISOString())
      .lt('transaction_date', currentPeriodStart.toISOString());
    
    if (previousError) throw previousError;
    
    const currentVolume = currentData?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    const previousVolume = previousData?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    
    // Calculate growth rate
    if (previousVolume > 0) {
      return ((currentVolume - previousVolume) / previousVolume) * 100;
    }
    
    return 0; // No previous data to compare
  } catch (error) {
    console.error("Error calculating volume growth rate:", error);
    return 0;
  }
}

// Fetch the main dashboard statistics
export async function fetchDashboardStatistics(): Promise<DashboardStatistics> {
  try {
    // Get count of active schools
    const { count: activeSchools, error: schoolError } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);
    
    if (schoolError) throw schoolError;
    
    // Get total students count
    const { count: totalStudents, error: studentError } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);
    
    if (studentError) throw studentError;
    
    // Get today's transactions count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: dailyTransactions, error: dailyTransError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .gte('transaction_date', today.toISOString());
    
    if (dailyTransError) throw dailyTransError;
    
    // Get this month's transactions total volume
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const { data: monthTransactions, error: monthlyError } = await supabase
      .from('transactions')
      .select('amount')
      .gte('transaction_date', firstDayOfMonth.toISOString());
    
    if (monthlyError) throw monthlyError;
    
    const monthlyVolume = monthTransactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;
    
    // Calculate growth rates by comparing current month with previous month
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const schoolsGrowthRate = await calculateGrowthRate('schools', firstDayOfMonth, previousMonth);
    const transactionsGrowthRate = await calculateGrowthRate('transactions', firstDayOfMonth, previousMonth);
    const volumeGrowthRate = await calculateVolumeGrowthRate(firstDayOfMonth, previousMonth);
    
    // Get transaction distribution by type
    const { data: transTypes, error: typesError } = await supabase
      .from('transactions')
      .select('type')
      .in('type', ['purchase', 'topup']);
    
    if (typesError) throw typesError;
    
    const purchaseCount = transTypes?.filter(t => t.type === 'purchase').length || 0;
    const reloadCount = transTypes?.filter(t => t.type === 'topup').length || 0;
    const total = purchaseCount + reloadCount;
    
    const transactionByType = {
      purchase: total ? Math.round((purchaseCount / total) * 100) : 0,
      reload: total ? Math.round((reloadCount / total) * 100) : 0,
    };
    
    return {
      activeSchools: activeSchools || 0,
      totalStudents: totalStudents || 0,
      dailyTransactions: dailyTransactions || 0,
      monthlyVolume,
      growthRate: {
        schools: parseFloat(schoolsGrowthRate.toFixed(1)),
        transactions: parseFloat(transactionsGrowthRate.toFixed(1)),
        volume: parseFloat(volumeGrowthRate.toFixed(1)),
      },
      transactionByType,
    };
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    // Provide fallback data in case of error
    return {
      activeSchools: 0,
      totalStudents: 0,
      dailyTransactions: 0,
      monthlyVolume: 0,
      growthRate: {
        schools: 0,
        transactions: 0,
        volume: 0,
      },
      transactionByType: {
        purchase: 50,
        reload: 50,
      },
    };
  }
}

// Fetch transaction trend data
export async function fetchTransactionTrend(): Promise<TransactionTrend> {
  try {
    // Get transactions for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, transaction_date')
      .gte('transaction_date', thirtyDaysAgo.toISOString())
      .order('transaction_date');
    
    if (error) throw error;
    
    // Group by date and sum amounts
    const groupedByDate = data?.reduce((acc, tx) => {
      const date = new Date(tx.transaction_date);
      const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!acc[dateStr]) {
        acc[dateStr] = 0;
      }
      
      acc[dateStr] += tx.amount || 0;
      return acc;
    }, {} as Record<string, number>) || {};
    
    // Convert to array format needed by the chart
    return Object.entries(groupedByDate).map(([date, volume]) => ({ 
      date, 
      volume 
    }));
  } catch (error) {
    console.error("Error fetching transaction trend:", error);
    return [];
  }
}

// Fetch transaction type distribution
export async function fetchTransactionTypeDistribution(): Promise<TransactionTypeData> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('type')
      .in('type', ['purchase', 'topup']);
    
    if (error) throw error;
    
    const purchaseCount = data?.filter(t => t.type === 'purchase').length || 0;
    const reloadCount = data?.filter(t => t.type === 'topup').length || 0;
    const total = purchaseCount + reloadCount;
    
    if (total === 0) {
      return [
        { name: 'Compras', value: 50 },
        { name: 'Recargas', value: 50 }
      ];
    }
    
    return [
      { name: 'Compras', value: Math.round((purchaseCount / total) * 100) },
      { name: 'Recargas', value: Math.round((reloadCount / total) * 100) }
    ];
  } catch (error) {
    console.error("Error fetching transaction type distribution:", error);
    return [
      { name: 'Compras', value: 50 },
      { name: 'Recargas', value: 50 }
    ];
  }
}

// React Query hooks
export function useDashboardStatistics() {
  return useQuery({
    queryKey: ['dashboard', 'statistics'],
    queryFn: fetchDashboardStatistics,
  });
}

export function useTransactionTrend() {
  return useQuery({
    queryKey: ['dashboard', 'transactionTrend'],
    queryFn: fetchTransactionTrend,
  });
}

export function useTransactionTypeDistribution() {
  return useQuery({
    queryKey: ['dashboard', 'transactionTypes'],
    queryFn: fetchTransactionTypeDistribution,
  });
}
