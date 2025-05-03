
import { supabase } from "@/integrations/supabase/client";

// Types for transactions
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type TransactionType = 'purchase' | 'topup' | 'monthly_fee';

export interface Transaction {
  id: string;
  transaction_id: string;
  student_id: string;
  amount: number;
  transaction_date: string;
  type: TransactionType;
  status: TransactionStatus;
  device_id?: string;
  vendor_id?: string;
  school_id?: string;
  metadata?: Record<string, any>;
}

// Function to fetch transactions from Supabase
export const fetchTransactions = async (startDate: Date, endDate: Date): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('transaction_date', startDate.toISOString())
      .lte('transaction_date', endDate.toISOString());
    
    if (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
    
    return data as Transaction[];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Refactor the calculateRevenueBySchool function to avoid excessive recursion
export const calculateRevenueBySchool = (transactions: Transaction[], startDate: Date, endDate: Date): Record<string, number> => {
  // Use a simple approach without recursion
  const revenueBySchool: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.transaction_date);
    if (transactionDate >= startDate && transactionDate <= endDate && transaction.status === 'completed') {
      const schoolId = transaction.school_id || 'unknown';
      if (!revenueBySchool[schoolId]) {
        revenueBySchool[schoolId] = 0;
      }
      revenueBySchool[schoolId] += Number(transaction.amount) || 0;
    }
  });
  
  return revenueBySchool;
};

// Function to calculate total revenue
export const calculateTotalRevenue = (transactions: Transaction[], startDate: Date, endDate: Date): number => {
  let totalRevenue = 0;
  
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.transaction_date);
    if (transactionDate >= startDate && transactionDate <= endDate && transaction.status === 'completed') {
      totalRevenue += Number(transaction.amount) || 0;
    }
  });
  
  return totalRevenue;
};

// Function to calculate revenue by payment method
export const calculateRevenueByPaymentMethod = (transactions: Transaction[], startDate: Date, endDate: Date): Record<string, number> => {
  const revenueByMethod: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.transaction_date);
    if (transactionDate >= startDate && transactionDate <= endDate && transaction.status === 'completed') {
      const method = transaction.metadata?.payment_method || 'unknown';
      if (!revenueByMethod[method]) {
        revenueByMethod[method] = 0;
      }
      revenueByMethod[method] += Number(transaction.amount) || 0;
    }
  });
  
  return revenueByMethod;
};

// Function to calculate transaction count by type
export const calculateTransactionCountByType = (transactions: Transaction[], startDate: Date, endDate: Date): Record<string, number> => {
  const transactionCountByType: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.transaction_date);
    if (transactionDate >= startDate && transactionDate <= endDate) {
      const type = transaction.type || 'unknown';
      if (!transactionCountByType[type]) {
        transactionCountByType[type] = 0;
      }
      transactionCountByType[type]++;
    }
  });
  
  return transactionCountByType;
};

// Function to generate a comprehensive financial report
export const generateFinancialReport = async (startDate: Date, endDate: Date): Promise<any> => {
  try {
    const transactions = await fetchTransactions(startDate, endDate);
    
    const totalRevenue = calculateTotalRevenue(transactions, startDate, endDate);
    const revenueBySchool = calculateRevenueBySchool(transactions, startDate, endDate);
    const revenueByPaymentMethod = calculateRevenueByPaymentMethod(transactions, startDate, endDate);
    const transactionCountByType = calculateTransactionCountByType(transactions, startDate, endDate);
    
    return {
      totalRevenue,
      revenueBySchool,
      revenueByPaymentMethod,
      transactionCountByType,
      transactions
    };
  } catch (error) {
    console.error("Error generating financial report:", error);
    throw error;
  }
};

// Add the missing exported functions needed by financialReportHooks.ts
export const generateFinancialOverviewReport = async (): Promise<any> => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  try {
    return await generateFinancialReport(startOfMonth, today);
  } catch (error) {
    console.error("Error generating financial overview report:", error);
    throw error;
  }
};

export const generateRevenueByPlanReport = async (): Promise<any[]> => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  try {
    const transactions = await fetchTransactions(startOfMonth, today);
    
    // Group transactions by plan
    const planData: Record<string, number> = {};
    transactions.forEach(transaction => {
      if (transaction.status === 'completed') {
        const plan = transaction.metadata?.plan || 'Standard Plan';
        if (!planData[plan]) {
          planData[plan] = 0;
        }
        planData[plan] += Number(transaction.amount) || 0;
      }
    });
    
    // Convert to array format for charts
    return Object.entries(planData).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error("Error generating revenue by plan report:", error);
    return [];
  }
};

export const generateMonthlyTrendReport = async (): Promise<any[]> => {
  // Get data for the last 6 months
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  
  try {
    const transactions = await fetchTransactions(sixMonthsAgo, today);
    
    // Group by month
    const monthlyData: Record<string, number> = {};
    
    // Initialize all months with zero
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = 0;
    }
    
    // Fill with actual data
    transactions.forEach(transaction => {
      if (transaction.status === 'completed') {
        const transactionDate = new Date(transaction.transaction_date);
        const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyData[monthKey] !== undefined) {
          monthlyData[monthKey] += Number(transaction.amount) || 0;
        }
      }
    });
    
    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([month, value]) => ({
        month,
        revenue: value
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  } catch (error) {
    console.error("Error generating monthly trend report:", error);
    return [];
  }
};
