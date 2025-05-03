
import { useQuery } from "@tanstack/react-query";
import { 
  generateFinancialOverviewReport, 
  generateRevenueByPlanReport, 
  generateMonthlyTrendReport 
} from './financialReportGenerationService';
import { 
  FinancialReportOverviewData,
  RevenueByPlanItemData,
  MonthlyTrendItemData
} from './financialReportTypes';

// React Query hooks for report generation
export function useFinancialOverview() {
  return useQuery<FinancialReportOverviewData, Error>({
    queryKey: ['financial-overview'],
    queryFn: generateFinancialOverviewReport,
  });
}

export function useRevenueByPlan() {
  return useQuery<RevenueByPlanItemData[], Error>({
    queryKey: ['revenue-by-plan'],
    queryFn: generateRevenueByPlanReport,
  });
}

export function useMonthlyTrend() {
  return useQuery<MonthlyTrendItemData[], Error>({
    queryKey: ['monthly-trend'],
    queryFn: () => generateMonthlyTrendReport(),
  });
}
