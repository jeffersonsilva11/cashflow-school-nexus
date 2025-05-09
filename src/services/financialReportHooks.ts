
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

export function useRevenueByPlan(vendorId?: string) {
  return useQuery<RevenueByPlanItemData[], Error>({
    queryKey: ['revenue-by-plan', vendorId],
    queryFn: () => generateRevenueByPlanReport(vendorId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMonthlyTrend(vendorId?: string) {
  return useQuery<MonthlyTrendItemData[], Error>({
    queryKey: ['monthly-trend', vendorId],
    queryFn: () => generateMonthlyTrendReport(vendorId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useConsumptionAnalysis(vendorId?: string) {
  return useQuery<ConsumptionAnalysisItemData[], Error>({
    queryKey: ['consumption-analysis', vendorId],
    queryFn: () => generateConsumptionAnalysisReport(vendorId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
