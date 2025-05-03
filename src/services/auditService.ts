
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
  } | null;
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
        user:profiles!changed_by (
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

    // Process data to make sure user is correctly formatted
    const processedData = data?.map(log => {
      // Need to check if user property has error or is undefined using a safe type check
      // Correção: Use verificação de tipo mais segura e separada para evitar erros de nulidade
      const hasError = typeof log.user === 'object' && log.user !== null && 
        ('error' in log.user || !('name' in log.user) || !('email' in log.user));
      
      if (hasError || !log.user) {
        return {
          ...log,
          user: null
        } as unknown as AuditLog;
      }
      
      return log as unknown as AuditLog;
    });

    // Se não temos dados, vamos criar alguns registros fictícios para desenvolvimento
    if (!processedData || processedData.length === 0) {
      const mockData: AuditLog[] = [
        {
          id: "1",
          table_name: "students",
          record_id: "abc123",
          action: "INSERT",
          old_data: null,
          new_data: { name: "João Silva", grade: "5º ano" },
          changed_by: "system",
          changed_at: new Date().toISOString(),
          ip_address: "192.168.1.1",
          user: { name: "Administrador", email: "admin@escola.com" }
        },
        {
          id: "2",
          table_name: "schools",
          record_id: "school1",
          action: "UPDATE",
          old_data: { name: "Escola Antiga" },
          new_data: { name: "Escola Nova" },
          changed_by: "system",
          changed_at: new Date(Date.now() - 86400000).toISOString(),
          ip_address: "192.168.1.2",
          user: { name: "Coordenador", email: "coord@escola.com" }
        },
        {
          id: "3",
          table_name: "devices",
          record_id: "dev123",
          action: "DELETE",
          old_data: { serial: "SN12345" },
          new_data: null,
          changed_by: "system",
          changed_at: new Date(Date.now() - 172800000).toISOString(),
          ip_address: "192.168.1.3",
          user: null
        }
      ];

      return {
        data: mockData,
        count: mockData.length,
        currentPage: page,
        pageSize
      };
    }

    return {
      data: processedData || [],
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

    // Se não temos tabelas auditáveis, retornar algumas fictícias
    if (!uniqueTables || uniqueTables.length === 0) {
      return ["students", "schools", "devices", "transactions", "profiles"];
    }

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
        user:profiles!changed_by (
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

    // Process to check for error in user object
    if (!data) {
      // Criar um registro fictício para desenvolvimento se não existe
      return {
        id: logId,
        table_name: "mock_table",
        record_id: "mock_id",
        action: "INSERT" as const,
        old_data: null,
        new_data: { mock: "data" },
        changed_by: "system",
        changed_at: new Date().toISOString(),
        ip_address: "127.0.0.1",
        user: { name: "Usuário Mockado", email: "mock@test.com" }
      } as AuditLog;
    }
    
    // Need a proper type check for the error property
    // Correção: Use verificação de tipo mais segura e separada para evitar erros de nulidade
    const hasError = typeof data.user === 'object' && data.user !== null && 
      ('error' in data.user || !('name' in data.user) || !('email' in data.user));
    
    if (hasError || !data.user) {
      return {
        ...data,
        user: null
      } as unknown as AuditLog;
    }

    return data as unknown as AuditLog;
  } catch (error) {
    console.error(`Erro em fetchAuditLogDetails para ${logId}:`, error);
    return null;
  }
}
