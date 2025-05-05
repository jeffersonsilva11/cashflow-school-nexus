
import { fetchTransactionTrendsReport, fetchUserBehaviorReport, fetchProductCategoryReport } from './api';
import { getMockTransactionTrendsData, getMockUserBehaviorData, getMockProductCategoryData } from './mock';

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
    const report = await fetchTransactionTrendsReport();
    
    if (report && report.length > 0) {
      return report as TransactionTrendData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    return getMockTransactionTrendsData();
  } catch (error) {
    console.error("Error generating transaction trends report:", error);
    return getMockTransactionTrendsData();
  }
};

// Função para gerar relatório de comportamento do usuário
export const generateUserBehaviorReport = async (): Promise<UserBehaviorData[]> => {
  try {
    const report = await fetchUserBehaviorReport();
    
    if (report && report.length > 0) {
      return report as UserBehaviorData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    return getMockUserBehaviorData();
  } catch (error) {
    console.error("Error generating user behavior report:", error);
    return getMockUserBehaviorData();
  }
};

// Função para gerar relatório de categoria de produto
export const generateProductCategoryReport = async (): Promise<ProductCategoryData[]> => {
  try {
    const report = await fetchProductCategoryReport();
    
    if (report && report.length > 0) {
      return report as ProductCategoryData[];
    }
    
    // Se não houver relatório no banco, usar dados mockados
    return getMockProductCategoryData();
  } catch (error) {
    console.error("Error generating product category report:", error);
    return getMockProductCategoryData();
  }
};
