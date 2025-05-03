
/**
 * Audit Export Service
 * 
 * Provides functionality for exporting and managing audit logs.
 */

import { supabase } from "@/integrations/supabase/client";

// Types for audit logs
export interface AuditLog {
  id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_data?: any;
  new_data?: any;
  changed_by?: string;
  changed_at: string;
  ip_address?: string;
}

// Enums for audit log filtering
export enum AuditAction {
  ALL = 'all',
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ACCESS = 'ACCESS'
}

export type AuditLogFilter = {
  startDate?: Date;
  endDate?: Date;
  action?: AuditAction;
  tableName?: string;
  userId?: string;
};

/**
 * Fetch audit logs with optional filtering
 */
export const fetchAuditLogs = async (filters?: AuditLogFilter): Promise<AuditLog[]> => {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('changed_at', { ascending: false });
    
    // Apply filters if provided
    if (filters) {
      if (filters.startDate) {
        query = query.gte('changed_at', filters.startDate.toISOString());
      }
      
      if (filters.endDate) {
        query = query.lte('changed_at', filters.endDate.toISOString());
      }
      
      if (filters.action && filters.action !== AuditAction.ALL) {
        query = query.eq('action', filters.action);
      }
      
      if (filters.tableName) {
        query = query.eq('table_name', filters.tableName);
      }
      
      if (filters.userId) {
        query = query.eq('changed_by', filters.userId);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as AuditLog[];
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    throw error;
  }
};

/**
 * Get unique table names for filtering
 */
export const getAuditTableNames = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('table_name')
      .limit(1000);
    
    if (error) throw error;
    
    // Extract unique table names
    const tableNames = Array.from(new Set((data || []).map(log => log.table_name)));
    return tableNames as string[];
  } catch (error) {
    console.error('Failed to get audit table names:', error);
    return [];
  }
};

/**
 * Export audit logs to CSV format
 */
export const exportAuditLogsToCSV = (logs: AuditLog[]): string => {
  if (!logs || logs.length === 0) {
    return '';
  }
  
  // Define CSV headers
  const headers = ['ID', 'Action', 'Table', 'Record ID', 'Changed By', 'Timestamp', 'IP Address', 'Old Data', 'New Data'];
  
  // Format log data for CSV
  const rows = logs.map(log => {
    // Format JSON data for readability
    const oldData = log.old_data ? JSON.stringify(log.old_data) : '';
    const newData = log.new_data ? JSON.stringify(log.new_data) : '';
    
    return [
      log.id,
      log.action,
      log.table_name,
      log.record_id || '',
      log.changed_by || '',
      log.changed_at,
      log.ip_address || '',
      `"${oldData.replace(/"/g, '""')}"`, // Escape quotes for CSV
      `"${newData.replace(/"/g, '""')}"` // Escape quotes for CSV
    ].join(',');
  });
  
  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n');
};

/**
 * Export audit logs to JSON format
 */
export const exportAuditLogsToJSON = (logs: AuditLog[]): string => {
  return JSON.stringify(logs, null, 2);
};

/**
 * Download audit logs as a file
 */
export const downloadAuditLogs = (content: string, fileType: 'csv' | 'json'): void => {
  // Create file blob
  const blob = new Blob(
    [content], 
    { type: fileType === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;' }
  );
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.${fileType}`);
  link.style.visibility = 'hidden';
  
  // Add to body, click and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Purge old audit logs (admin function)
 * 
 * Note: This should be restricted to admin users only
 * and typically used in compliance with data retention policies
 */
export const purgeOldAuditLogs = async (olderThan: Date): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .delete()
      .lt('changed_at', olderThan.toISOString());
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to purge old audit logs:', error);
    return false;
  }
};
