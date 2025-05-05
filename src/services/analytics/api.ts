
import { supabase } from "@/integrations/supabase/client";

// Função para buscar relatórios de tendências de transação
export const fetchTransactionTrendsReport = async () => {
  try {
    // Modificando para buscar da tabela financial_reports com o tipo específico
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', 'transaction_trends')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    // Se encontrar um relatório, retorne os dados específicos dele
    if (data && data.length > 0 && data[0].data) {
      return data[0].data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching transaction trends report:", error);
    return null;
  }
};

// Função para buscar relatórios de comportamento do usuário
export const fetchUserBehaviorReport = async () => {
  try {
    // Modificando para buscar da tabela financial_reports com o tipo específico
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', 'user_behavior')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    // Se encontrar um relatório, retorne os dados específicos dele
    if (data && data.length > 0 && data[0].data) {
      return data[0].data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user behavior report:", error);
    return null;
  }
};

// Função para buscar relatórios de categoria de produto
export const fetchProductCategoryReport = async () => {
  try {
    // Modificando para buscar da tabela financial_reports com o tipo específico
    const { data, error } = await supabase
      .from('financial_reports')
      .select('*')
      .eq('report_type', 'product_category')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    // Se encontrar um relatório, retorne os dados específicos dele
    if (data && data.length > 0 && data[0].data) {
      return data[0].data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching product category report:", error);
    return null;
  }
};
