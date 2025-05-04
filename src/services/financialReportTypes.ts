
import { Json } from "@/integrations/supabase/types";

// Basic data type definitions
export interface FinancialReportOverviewData {
  totalActiveSchools: number;
  totalRevenueMonth: number;
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

// Composite data type
export interface FinancialReportCompleteData {
  overview: FinancialReportOverviewData;
  revenueByPlan: RevenueByPlanItemData[];
  monthlyTrend: MonthlyTrendItemData[];
}

// Report type
export interface FinancialReport {
  id: string;
  report_type: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  data: Json;
  created_at?: string;
  updated_at?: string;
}

export type CreateFinancialReportParams = {
  report_type: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  data: Json;
};

export type UpdateFinancialReportFields = {
  report_type?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date?: string;
  end_date?: string;
  data?: Json;
};

export type UpdateFinancialReportParams = {
  id: string;
  updates: UpdateFinancialReportFields;
};
