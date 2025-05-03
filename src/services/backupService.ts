
/**
 * Backup Service
 * 
 * Provides functionality for backing up critical data.
 */

import { supabase } from "@/integrations/supabase/client";
import { encryptWithPassword } from "./encryptionService";

// Define backup types
export type BackupType = 'full' | 'incremental' | 'data-only' | 'config-only';

export interface BackupMetadata {
  id: string;
  created_at: string;
  backup_type: BackupType;
  file_name: string;
  file_size: number;
  encrypted: boolean;
  tables_included: string[];
  created_by: string;
}

export interface BackupOptions {
  backupType: BackupType;
  tables?: string[];
  encrypt?: boolean;
  encryptionPassword?: string;
  includeAuditLogs?: boolean;
}

/**
 * Create a backup of selected database tables
 */
export const createBackup = async (options: BackupOptions): Promise<{ success: boolean; metadata?: BackupMetadata }> => {
  try {
    // Determine which tables to export based on backup type
    let tablesToBackup: string[] = [];
    
    switch (options.backupType) {
      case 'full':
        tablesToBackup = [
          'schools', 'students', 'parents', 'devices', 'tablets', 
          'transactions', 'vendors', 'vendor_products', 'student_balances'
        ];
        if (options.includeAuditLogs) {
          tablesToBackup.push('audit_logs');
        }
        break;
      case 'data-only':
        tablesToBackup = [
          'students', 'parents', 'devices', 'tablets', 
          'transactions', 'vendors', 'vendor_products', 'student_balances'
        ];
        break;
      case 'config-only':
        tablesToBackup = [
          'system_configs', 'payment_provider_configs', 'payment_gateway_configs'
        ];
        break;
      case 'incremental':
        // For incremental backups, use the provided tables or default to common data tables
        tablesToBackup = options.tables || [
          'students', 'transactions', 'devices', 'tablets'
        ];
        break;
    }
    
    // Fetch data from each table
    const backupData: Record<string, any[]> = {};
    
    for (const table of tablesToBackup) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching data from ${table}:`, error);
        continue;
      }
      
      backupData[table] = data || [];
    }
    
    // Create backup JSON
    const backupJson = JSON.stringify(backupData);
    
    // Encrypt backup if requested
    let finalBackupData = backupJson;
    let isEncrypted = false;
    
    if (options.encrypt && options.encryptionPassword) {
      const encryptedData = await encryptWithPassword(backupJson, options.encryptionPassword);
      finalBackupData = JSON.stringify(encryptedData);
      isEncrypted = true;
    }
    
    // Create a file name for the backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `backup_${options.backupType}_${timestamp}.json`;
    
    // Create metadata record in the backups table
    const { data: metadataRecord, error: metadataError } = await supabase
      .from('backups')
      .insert({
        backup_type: options.backupType,
        file_name: fileName,
        file_size: new Blob([finalBackupData]).size,
        encrypted: isEncrypted,
        tables_included: tablesToBackup,
      })
      .select()
      .single();
    
    if (metadataError) {
      console.error('Error creating backup metadata:', metadataError);
      return { success: false };
    }
    
    // For now, initiate a download in the browser
    // In a real production app, this would be uploaded to secure storage
    const blob = new Blob([finalBackupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    return { 
      success: true, 
      metadata: metadataRecord as unknown as BackupMetadata 
    };
  } catch (error) {
    console.error('Backup creation failed:', error);
    return { success: false };
  }
};

/**
 * Get list of available backups
 */
export const getBackupHistory = async (): Promise<BackupMetadata[]> => {
  try {
    const { data, error } = await supabase
      .from('backups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as BackupMetadata[];
  } catch (error) {
    console.error('Failed to fetch backup history:', error);
    return [];
  }
};

/**
 * Schedule recurring backups
 * Note: This would typically be handled by a server-side cron job or workflow
 */
export const scheduleRecurringBackup = async (
  frequency: 'daily' | 'weekly' | 'monthly',
  options: Omit<BackupOptions, 'encryptionPassword'>
): Promise<boolean> => {
  try {
    // In a real application, this would create a record in a backup_schedules table
    // and a server-side process would handle the actual scheduling
    const { error } = await supabase
      .from('backup_schedules')
      .insert({
        frequency,
        backup_type: options.backupType,
        tables: options.tables,
        encrypt: options.encrypt,
        include_audit_logs: options.includeAuditLogs,
        next_run: calculateNextRunDate(frequency),
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to schedule recurring backup:', error);
    return false;
  }
};

/**
 * Helper function to calculate the next run date based on frequency
 */
const calculateNextRunDate = (frequency: 'daily' | 'weekly' | 'monthly'): string => {
  const now = new Date();
  let nextRun: Date;
  
  switch (frequency) {
    case 'daily':
      nextRun = new Date(now.setDate(now.getDate() + 1));
      break;
    case 'weekly':
      nextRun = new Date(now.setDate(now.getDate() + 7));
      break;
    case 'monthly':
      nextRun = new Date(now.setMonth(now.getMonth() + 1));
      break;
  }
  
  // Set time to 2 AM
  nextRun.setHours(2, 0, 0, 0);
  
  return nextRun.toISOString();
};
