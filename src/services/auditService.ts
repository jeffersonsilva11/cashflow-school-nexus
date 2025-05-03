
import { supabase } from "@/integrations/supabase/client";

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_data: any;
  new_data: any;
  changed_by: string;
  changed_at: string;
  ip_address: string;
  user?: {
    name: string;
    email: string;
  };
}

export async function fetchAuditLogs(
  page = 0,
  pageSize = 20,
  filters: {
    table?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
  } = {}
) {
  try {
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:changed_by (
          name,
          email
        )
      `, { count: 'exact' });

    // Aplicar filtros
    if (filters.table && filters.table !== 'all') {
      query = query.eq('table_name', filters.table);
    }

    if (filters.action && filters.action !== 'all') {
      query = query.eq('action', filters.action);
    }

    if (filters.startDate) {
      query = query.gte('changed_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('changed_at', filters.endDate);
    }

    if (filters.searchTerm) {
      query = query.or(`table_name.ilike.%${filters.searchTerm}%,record_id.ilike.%${filters.searchTerm}%`);
    }

    // Aplicar paginação
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order('changed_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Erro ao buscar logs de auditoria:", error);
      throw error;
    }

    return {
      data: data as AuditLog[],
      count: count || 0,
      currentPage: page,
      pageSize
    };
  } catch (error) {
    console.error("Erro em fetchAuditLogs:", error);
    return {
      data: [],
      count: 0,
      currentPage: page,
      pageSize
    };
  }
}

// Função para buscar as tabelas disponíveis para filtro
export async function fetchAuditableTables() {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('table_name')
      .limit(1000); // Um limite alto para garantir todas as tabelas

    if (error) {
      console.error("Erro ao buscar tabelas auditáveis:", error);
      throw error;
    }

    // Obter valores únicos de table_name
    const uniqueTables = Array.from(
      new Set(data.map(log => log.table_name))
    ).sort();

    return uniqueTables;
  } catch (error) {
    console.error("Erro em fetchAuditableTables:", error);
    return [];
  }
}

// Função para buscar detalhes de um log específico
export async function fetchAuditLogDetails(logId: string) {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        user:changed_by (
          name,
          email,
          role
        )
      `)
      .eq('id', logId)
      .single();

    if (error) {
      console.error(`Erro ao buscar detalhes do log ${logId}:`, error);
      throw error;
    }

    return data as AuditLog;
  } catch (error) {
    console.error(`Erro em fetchAuditLogDetails para ${logId}:`, error);
    return null;
  }
}
