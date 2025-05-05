
import { useQuery } from "@tanstack/react-query";
import {
  generateTransactionTrendsReport,
  generateUserBehaviorReport,
  generateProductCategoryReport,
  TransactionTrendData,
  UserBehaviorData,
  ProductCategoryData
} from './analytics/reportService';

// React Query hooks for analytics report generation
export function useTransactionTrendsReport() {
  return useQuery<TransactionTrendData[], Error>({
    queryKey: ['transaction-trends'],
    queryFn: generateTransactionTrendsReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUserBehaviorReport() {
  return useQuery<UserBehaviorData[], Error>({
    queryKey: ['user-behavior'],
    queryFn: generateUserBehaviorReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProductCategoryReport() {
  return useQuery<ProductCategoryData[], Error>({
    queryKey: ['product-category'],
    queryFn: generateProductCategoryReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
