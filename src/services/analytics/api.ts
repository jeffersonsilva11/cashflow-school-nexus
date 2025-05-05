
import { supabase } from "@/integrations/supabase/client";

// Função para buscar relatórios de tendências de transação
export const fetchTransactionTrendsReport = async () => {
  try {
    const { data, error } = await supabase
      .from('transaction_trends')
      .select('*')
      .order('date', { ascending: true })
      .limit(30);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching transaction trends report:", error);
    return null;
  }
};

// Função para buscar relatórios de comportamento do usuário
export const fetchUserBehaviorReport = async () => {
  try {
    const { data, error } = await supabase
      .from('user_behavior_reports')
      .select('*')
      .order('hour', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user behavior report:", error);
    return null;
  }
};

// Função para buscar relatórios de categoria de produto
export const fetchProductCategoryReport = async () => {
  try {
    const { data: categoryData, error: categoryError } = await supabase
      .from('product_category_reports')
      .select('*')
      .order('value', { ascending: false });
    
    if (categoryError) throw categoryError;
    return categoryData;
  } catch (error) {
    console.error("Error fetching product category report:", error);
    return null;
  }
};
