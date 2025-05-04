
import { financialReports } from "../financialMockData";

// Funções para fornecer dados mockados quando necessário
export const getMockOverviewData = () => {
  return financialReports.overview;
};

export const getMockRevenueByPlanData = () => {
  return financialReports.revenueByPlan;
};

export const getMockMonthlyTrendData = () => {
  return financialReports.monthlyTrend;
};

export const getMockConsumptionAnalysisData = () => {
  const mockConsumptionData = [
    {
      schoolId: "1",
      schoolName: "Colégio Integrado",
      productType: "Lanches",
      amount: 8750.50,
      quantity: 1250,
      studentCount: 350,
      averagePerStudent: 25.00
    },
    {
      schoolId: "2",
      schoolName: "Escola Maria Eduarda",
      productType: "Refeições",
      amount: 12540.75,
      quantity: 980,
      studentCount: 290,
      averagePerStudent: 43.24
    },
    {
      schoolId: "3",
      schoolName: "Colégio São Pedro",
      productType: "Bebidas",
      amount: 3250.25,
      quantity: 850,
      studentCount: 210,
      averagePerStudent: 15.48
    }
  ];
  
  return mockConsumptionData;
};
