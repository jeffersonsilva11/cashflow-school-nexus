
import { useQuery } from "@tanstack/react-query";
import { 
  generateFinancialOverviewReport, 
  generateRevenueByPlanReport, 
  generateMonthlyTrendReport,
  generateConsumptionAnalysisReport
} from './financialReportGenerationService';
import { 
  FinancialReportOverviewData,
  RevenueByPlanItemData,
  MonthlyTrendItemData,
  ConsumptionAnalysisItemData
} from './financialReportTypes';

// React Query hooks for report generation
export function useFinancialOverview() {
  return useQuery<FinancialReportOverviewData, Error>({
    queryKey: ['financial-overview'],
    queryFn: generateFinancialOverviewReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRevenueByPlan() {
  return useQuery<RevenueByPlanItemData[], Error>({
    queryKey: ['revenue-by-plan'],
    queryFn: generateRevenueByPlanReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMonthlyTrend() {
  return useQuery<MonthlyTrendItemData[], Error>({
    queryKey: ['monthly-trend'],
    queryFn: () => generateMonthlyTrendReport(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useConsumptionAnalysis() {
  return useQuery<ConsumptionAnalysisItemData[], Error>({
    queryKey: ['consumption-analysis'],
    queryFn: generateConsumptionAnalysisReport,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
