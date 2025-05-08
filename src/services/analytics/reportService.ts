
import { fetchTransactionTrendsReport, fetchUserBehaviorReport, fetchProductCategoryReport } from './api';

// Tipos de dados para os relatórios analíticos
export type TransactionTrendData = {
  date: string;
  count: number;
  amount: number;
};

export type UserBehaviorData = {
  hour: string;
  transactions: number;
};

export type ProductCategoryData = {
  category: string;
  value: number;
  count: number;
};

// Função para gerar relatório de tendências de transação
export const generateTransactionTrendsReport = async (): Promise<TransactionTrendData[]> => {
  try {
    const reportData = await fetchTransactionTrendsReport();
    
    if (reportData && Array.isArray(reportData)) {
      // Garantir que os dados correspondam ao tipo TransactionTrendData
      return reportData.map((item: any) => ({
        date: item.date || '',
        count: item.count || 0,
        amount: item.amount || 0
      })) as TransactionTrendData[];
    }
    
    // Se não houver relatório no banco, retornar array vazio
    console.info("No transaction trends report data found");
    return [];
  } catch (error) {
    console.error("Error generating transaction trends report:", error);
    return [];
  }
};

// Função para gerar relatório de comportamento do usuário
export const generateUserBehaviorReport = async (): Promise<UserBehaviorData[]> => {
  try {
    const reportData = await fetchUserBehaviorReport();
    
    if (reportData && Array.isArray(reportData)) {
      // Garantir que os dados correspondam ao tipo UserBehaviorData
      return reportData.map((item: any) => ({
        hour: item.hour || '',
        transactions: item.transactions || 0
      })) as UserBehaviorData[];
    }
    
    // Se não houver relatório no banco, retornar array vazio
    console.info("No user behavior report data found");
    return [];
  } catch (error) {
    console.error("Error generating user behavior report:", error);
    return [];
  }
};

// Função para gerar relatório de categoria de produto
export const generateProductCategoryReport = async (): Promise<ProductCategoryData[]> => {
  try {
    const reportData = await fetchProductCategoryReport();
    
    if (reportData && Array.isArray(reportData)) {
      // Garantir que os dados correspondam ao tipo ProductCategoryData
      return reportData.map((item: any) => ({
        category: item.category || '',
        value: item.value || 0,
        count: item.count || 0
      })) as ProductCategoryData[];
    }
    
    // Se não houver relatório no banco, retornar array vazio
    console.info("No product category report data found");
    return [];
  } catch (error) {
    console.error("Error generating product category report:", error);
    return [];
  }
};
