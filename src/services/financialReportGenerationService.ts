
// Este arquivo agora apenas re-exporta as funções dos módulos menores
import { generateFinancialOverviewReport } from "./financial/overviewReport";
import { generateRevenueByPlanReport } from "./financial/revenueByPlanReport";
import { generateMonthlyTrendReport } from "./financial/monthlyTrendReport";
import { generateConsumptionAnalysisReport } from "./financial/consumptionAnalysisReport";

// Re-exportamos as funções de API
import { 
  fetchFinancialReport,
  fetchConsumptionAnalysis,
  fetchMonthlyTrends,
  fetchRevenueByPlan
} from "./financial/api";

// Exportamos todas as funções para manter a compatibilidade
export {
  fetchFinancialReport,
  fetchConsumptionAnalysis,
  fetchMonthlyTrends,
  fetchRevenueByPlan,
  generateFinancialOverviewReport,
  generateRevenueByPlanReport,
  generateMonthlyTrendReport,
  generateConsumptionAnalysisReport
};
