
// Fix only the TypeScript errors without changing any functionality
import { supabase } from "@/integrations/supabase/client";

// Mock audit log data for development
const mockAuditLogs = [
  {
    id: "1",
    action: "create",
    table_name: "schools",
    record_id: "abc123",
    changed_at: new Date().toISOString(),
    changed_by: "user1",
    ip_address: "192.168.1.1",
    old_data: null,
    new_data: { name: "School A", active: true },
    user: {
      name: "John Doe",
      email: "john@example.com",
      role: "admin"
    }
  },
  {
    id: "2",
    action: "update",
    table_name: "students",
    record_id: "def456",
    changed_at: new Date().toISOString(),
    changed_by: "user2",
    ip_address: "192.168.1.2",
    old_data: { grade: "10", guardian: "Jane Smith" },
    new_data: { grade: "11", guardian: "Jane Smith" },
    user: {
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "school_admin"
    }
  },
  {
    id: "3",
    action: "delete",
    table_name: "users",
    record_id: "ghi789",
    changed_at: new Date().toISOString(),
    changed_by: "user3",
    ip_address: "192.168.1.3",
    old_data: { name: "Bob Williams", role: "staff" },
    new_data: null,
    user: {
      name: "Admin User",
      email: "admin@example.com",
      role: "admin"
    }
  },
  {
    id: "4",
    action: "login",
    table_name: "auth",
    record_id: null,
    changed_at: new Date().toISOString(),
    changed_by: "user4",
    ip_address: "192.168.1.4",
    old_data: null,
    new_data: { session_id: "session123" },
    user: {
      name: "Eve Brown",
      email: "eve@example.com",
      role: "parent"
    }
  },
  {
    id: "5",
    action: "logout",
    table_name: "auth",
    record_id: null,
    changed_at: new Date().toISOString(),
    changed_by: "user4",
    ip_address: "192.168.1.4",
    old_data: { session_id: "session123" },
    new_data: null,
    user: {
      name: "Eve Brown",
      email: "eve@example.com",
      role: "parent"
    }
  }
];

// Interfaces for audit logs
export interface AuditLog {
  id: string;
  action: string;
  table_name: string;
  record_id?: string;
  changed_at: string;
  changed_by?: string;
  ip_address?: string;
  old_data?: any;
  new_data?: any;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
}

export interface AuditLogFilters {
  searchTerm?: string;
  actionType?: string;
  tableName?: string;
  dateRange?: { from: Date | null; to: Date | null };
}

// fetchAuditLogs function with pagination support
export const fetchAuditLogs = async (
  page: number = 0, 
  pageSize: number = 20, 
  filters?: AuditLogFilters
) => {
  try {
    let query = supabase.from('audit_logs').select('*', { count: 'exact' });

    if (filters?.searchTerm) {
      query = query.ilike('record_id', `%${filters.searchTerm}%`);
    }

    if (filters?.actionType && filters.actionType !== 'all') {
      query = query.eq('action', filters.actionType);
    }

    if (filters?.tableName && filters.tableName !== 'all') {
      query = query.eq('table_name', filters.tableName);
    }

    if (filters?.dateRange?.from && filters?.dateRange?.to) {
      query = query.gte('changed_at', filters.dateRange.from.toISOString());
      query = query.lte('changed_at', filters.dateRange.to.toISOString());
    }

    // Add pagination
    const from = page * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }
    
    // Handle fetched data
    const processedLogs = (data || []).map((log: any) => {
      // Fix TypeScript null errors by ensuring values are defined before accessing properties
      // Create a user object if it doesn't exist in the database response
      const userInfo = typeof log.user === 'object' ? log.user : {};
      const userName = userInfo?.name || log.changed_by || 'Unknown User';
      const userEmail = userInfo?.email || 'unknown@email.com';
      const userRole = userInfo?.role || 'unknown';
      
      return {
        ...log,
        // Use the safely processed values
        user: {
          name: userName,
          email: userEmail,
          role: userRole
        }
      };
    });

    console.log("Processed audit logs:", processedLogs);
    return {
      data: processedLogs,
      count: count || processedLogs.length
    };

  } catch (error) {
    console.error("Error fetching audit logs:", error);
    // Return mock data in development or when there's an error
    const filteredMockLogs = mockAuditLogs.filter((log) => {
      if (filters?.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        if (
          !(log.record_id?.toLowerCase().includes(searchTermLower) ||
            log.user?.name?.toLowerCase().includes(searchTermLower) ||
            log.user?.email?.toLowerCase().includes(searchTermLower))
        ) {
          return false;
        }
      }
      if (filters?.actionType && filters.actionType !== 'all' && log.action !== filters.actionType) {
        return false;
      }
      if (filters?.tableName && filters.tableName !== 'all' && log.table_name !== filters.tableName) {
        return false;
      }
      if (filters?.dateRange?.from && filters?.dateRange?.to) {
        const logDate = new Date(log.changed_at);
        if (logDate < filters.dateRange.from || logDate > filters.dateRange.to) {
          return false;
        }
      }
      return true;
    });

    // Apply pagination to mock data
    const page = 0;
    const pageSize = 20;
    const from = page * pageSize;
    const to = from + pageSize;
    const paginatedMockLogs = filteredMockLogs.slice(from, to);

    return {
      data: paginatedMockLogs,
      count: filteredMockLogs.length
    };
  }
};

// Add fetchAuditableTables function that was missing
export const fetchAuditableTables = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('table_name')
      .distinct();

    if (error) {
      throw error;
    }

    return (data || []).map((item: any) => item.table_name);
  } catch (error) {
    console.error("Error fetching auditable tables:", error);
    // Return unique table names from mock data
    const uniqueTables = Array.from(
      new Set(mockAuditLogs.map(log => log.table_name))
    );
    return uniqueTables;
  }
};

// createAuditLog function
export const createAuditLog = async (
  action: string,
  tableName: string,
  recordId?: string,
  oldData?: any,
  newData?: any,
  userId?: string,
  ipAddress?: string
) => {
  try {
    const { data, error } = await supabase.from('audit_logs').insert([
      {
        action,
        table_name: tableName,
        record_id: recordId,
        changed_at: new Date().toISOString(),
        changed_by: userId,
        ip_address: ipAddress,
        old_data: oldData,
        new_data: newData,
      },
    ]);

    if (error) {
      console.error("Error creating audit log:", error);
      return { error };
    }

    return { data };
  } catch (error) {
    console.error("Error creating audit log:", error);
    return { error };
  }
};

// Helper functions 
export const formatLogAction = (action: string): string => {
  switch (action) {
    case 'create':
      return 'Criado';
    case 'update':
      return 'Atualizado';
    case 'delete':
      return 'Excluído';
    case 'login':
      return 'Login';
    case 'logout':
      return 'Logout';
    default:
      return 'Desconhecido';
  }
};

export const getActionColor = (action: string): string => {
  switch (action) {
    case 'create':
      return 'text-green-500';
    case 'update':
      return 'text-blue-500';
    case 'delete':
      return 'text-red-500';
    case 'login':
      return 'text-purple-500';
    case 'logout':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};

// fetchAuditLogDetails function
export const fetchAuditLogDetails = async (id: string): Promise<AuditLog | null> => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching audit log details:", error);
      return null;
    }
    
    // Process and return the data, ensuring we handle null values for user properties
    if (data) {
      // Create a user object if it doesn't exist in the response
      const userInfo = typeof data.user === 'object' ? data.user : {};
      
      return {
        ...data,
        user: {
          name: userInfo?.name || data.changed_by || 'Unknown User',
          email: userInfo?.email || 'unknown@email.com',
          role: userInfo?.role || 'unknown'
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching audit log details:", error);
    // Return mock data for the requested ID
    const mockLog = mockAuditLogs.find(log => log.id === id);
    return mockLog || null;
  }
};

// Function to get recent activity
export const getRecentActivity = async (limit: number = 5): Promise<AuditLog[]> => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('changed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent activity:", error);
      return [];
    }

    // Process user data 
    const processedData = (data || []).map((log: any) => {
      // Create a user object if it doesn't exist in the response
      const userInfo = typeof log.user === 'object' ? log.user : {};
      
      return {
        ...log,
        user: {
          name: userInfo?.name || log.changed_by || 'Unknown User',
          email: userInfo?.email || 'unknown@email.com',
          role: userInfo?.role || 'unknown'
        }
      };
    });

    return processedData;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return mockAuditLogs.slice(0, limit);
  }
};
