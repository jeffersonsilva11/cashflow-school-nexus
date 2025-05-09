
import { RevenueByPlanItemData } from "../financialReportTypes";
import { fetchFinancialReport } from "./api";
import { supabase } from "@/integrations/supabase/client";

export const generateRevenueByPlanReport = async (vendorId?: string): Promise<RevenueByPlanItemData[]> => {
  try {
    // Se não for especificado um vendorId, verificamos se existe um relatório geral
    if (!vendorId) {
      const report = await fetchFinancialReport('revenue_by_plan');
      
      if (report && report.data) {
        return report.data;
      }
    }
    
    // Para vendedores específicos, consultamos os produtos e suas vendas
    if (vendorId) {
      // Buscamos todos os produtos desse vendedor
      const { data: products, error: productsError } = await supabase
        .from('vendor_products')
        .select('id, name, category')
        .eq('vendor_id', vendorId);
        
      if (productsError || !products || products.length === 0) {
        console.error("Error fetching vendor products:", productsError);
        return [];
      }
      
      // Buscamos todas as transações desse vendedor (vendas)
      const { data: sales, error: salesError } = await supabase
        .from('transactions')
        .select('*')
        .eq('vendor_id', vendorId)
        .eq('status', 'completed')
        .eq('type', 'purchase');
        
      if (salesError) {
        console.error("Error fetching vendor sales:", salesError);
        return [];
      }
      
      // Agrupamos vendas por categoria de produto
      const categoryRevenue: Record<string, number> = {};
      const productCategoryMap = products.reduce((map: Record<string, string>, product) => {
        map[product.id] = product.category || 'Sem categoria';
        return map;
      }, {});
      
      // Para cada venda, somamos o valor na categoria correspondente
      let totalRevenue = 0;
      
      sales?.forEach(sale => {
        // Para vendas sem produto específico, usamos "Outros"
        const category = sale.product_id ? 
          productCategoryMap[sale.product_id] || 'Outros' : 
          'Outros';
          
        if (!categoryRevenue[category]) {
          categoryRevenue[category] = 0;
        }
        categoryRevenue[category] += Number(sale.amount);
        totalRevenue += Number(sale.amount);
      });
      
      // Calculamos as percentagens e formatamos para o objeto de retorno
      return Object.entries(categoryRevenue).map(([category, revenue]) => ({
        name: category,
        value: revenue,
        plan: category,
        revenue,
        percentage: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0
      }));
    }
    
    // Se não temos vendorId nem dados de relatório existente, tentamos buscar do revenue_by_plan
    const { data: revByPlan, error } = await supabase
      .from('revenue_by_plan')
      .select('*')
      .order('revenue', { ascending: false })
      .limit(5);
      
    if (error) {
      console.error("Error fetching revenue by plan data:", error);
      return [];
    }
      
    if (!revByPlan || revByPlan.length === 0) {
      console.info("No revenue by plan data found in database");
      return [];
    }
    
    return revByPlan.map(item => ({
      name: item.plan_name,
      value: item.revenue,
      plan: item.plan_name,
      revenue: item.revenue,
      percentage: item.percentage
    }));
  } catch (error) {
    console.error("Error in generateRevenueByPlanReport:", error);
    return [];
  }
};
