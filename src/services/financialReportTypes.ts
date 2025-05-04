
import { Json } from "@/integrations/supabase/types";

// Basic data type definitions
export interface FinancialReportOverviewData {
  totalRevenueMonth: number;
  totalActiveSchools: number;
  totalActiveSubscriptions: number;
  totalPendingPayments: number;
  averageRevenuePerSchool: number;
  growthRate: number;
  monthlyData: {
    month: string;
    revenue: number;
  }[];
}

export interface RevenueByPlanItemData {
  name: string;
  value: number;
  plan: string;
  revenue: number;
  percentage: number;
}

export interface MonthlyTrendItemData {
  month: string;
  revenue: number;
}

export interface ConsumptionAnalysisItemData {
  schoolId: string;
  schoolName: string;
  productType: string;
  amount: number;
  quantity: number;
  studentCount: number;
  averagePerStudent: number;
}

// Composite data type
export interface FinancialReportCompleteData {
  overview: FinancialReportOverviewData;
  revenueByPlan: RevenueByPlanItemData[];
  monthlyTrend: MonthlyTrendItemData[];
  consumptionAnalysis: ConsumptionAnalysisItemData[];
}

// Report type
export interface FinancialReport {
  id: string;
  report_type: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  period_name?: string;
  total_revenue: number;
  active_schools: number;
  active_subscriptions: number;
  pending_payments: number;
  average_revenue: number;
  growth_rate: number;
  data: Json;
  created_at?: string;
  updated_at?: string;
}

export type CreateFinancialReportParams = {
  report_type: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  period_name?: string;
  total_revenue?: number;
  active_schools?: number;
  active_subscriptions?: number;
  pending_payments?: number;
  average_revenue?: number;
  growth_rate?: number;
  data: Json;
};

export type UpdateFinancialReportFields = {
  report_type?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date?: string;
  end_date?: string;
  period_name?: string;
  total_revenue?: number;
  active_schools?: number;
  active_subscriptions?: number;
  pending_payments?: number;
  average_revenue?: number;
  growth_rate?: number;
  data?: Json;
};

export type UpdateFinancialReportParams = {
  id: string;
  updates: UpdateFinancialReportFields;
};

// Consumption Analysis Types
export interface ConsumptionAnalysis {
  id: string;
  report_date: string;
  school_id: string;
  product_type: string;
  amount: number;
  quantity: number;
  student_count: number;
  average_per_student: number;
  created_at?: string;
  updated_at?: string;
}

// Monthly Trends Types
export interface MonthlyTrend {
  id: string;
  month: string;
  year: number;
  revenue: number;
  commission: number;
  transaction_count: number;
  created_at?: string;
  updated_at?: string;
}

// Revenue By Plan Types
export interface RevenueByPlan {
  id: string;
  report_date: string;
  plan_id: string;
  plan_name: string;
  revenue: number;
  percentage: number;
  school_count: number;
  created_at?: string;
  updated_at?: string;
}
