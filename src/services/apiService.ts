
/**
 * API Service
 * 
 * Provides endpoints for external application integration
 * and handles offline transaction support.
 */

import { supabase } from "@/integrations/supabase/client";
import { hashString } from "./encryptionService";

// API key type definition
export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  expires_at?: string;
  last_used_at?: string;
  scope: string[];
  status: 'active' | 'revoked' | 'expired';
}

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Types for offline transaction
export interface OfflineTransaction {
  id: string;
  transaction_id: string;
  student_id: string;
  amount: number;
  type: 'purchase' | 'topup';
  status: 'pending' | 'synced';
  created_at: string;
  synced_at?: string;
  device_id: string;
  vendor_id?: string;
  metadata?: any;
}

// Generate a new API key for external integrations
export const generateApiKey = async (name: string, scope: string[]): Promise<ApiResponse<{key: string}>> => {
  try {
    // Generate a random key
    const bytes = new Uint8Array(32);
    window.crypto.getRandomValues(bytes);
    const key = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Hash the key for storage
    const hashedKey = await hashString(key);
    const keyPrefix = key.substring(0, 8);
    
    // Set expiration to one year from now
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    // Store the key in the database (only the hash)
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        name,
        key_prefix: keyPrefix,
        key_hash: hashedKey,
        scope,
        status: 'active',
        expires_at: oneYearFromNow.toISOString() // Convert Date to ISO string
      })
      .select('id, name, key_prefix, created_at, expires_at, scope, status')
      .single();
    
    if (error) throw error;
    
    // Return the full key only once
    return {
      success: true,
      data: {
        key: `${keyPrefix}.${key.substring(8)}`,
        ...(data as any)
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to generate API key:', error);
    return {
      success: false,
      error: 'Failed to generate API key',
      timestamp: new Date().toISOString()
    };
  }
};

// List API keys (without the actual keys, only metadata)
export const listApiKeys = async (): Promise<ApiResponse<ApiKey[]>> => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, created_at, expires_at, last_used_at, scope, status')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      success: true,
      data: data as unknown as ApiKey[],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to list API keys:', error);
    return {
      success: false,
      error: 'Failed to list API keys',
      timestamp: new Date().toISOString()
    };
  }
};

// Revoke an API key
export const revokeApiKey = async (keyId: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase
      .from('api_keys')
      .update({ status: 'revoked' })
      .eq('id', keyId);
    
    if (error) throw error;
    
    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to revoke API key:', error);
    return {
      success: false,
      error: 'Failed to revoke API key',
      timestamp: new Date().toISOString()
    };
  }
};

// Store an offline transaction to be synced later
export const storeOfflineTransaction = (transaction: Omit<OfflineTransaction, 'id' | 'created_at' | 'status'>): Promise<OfflineTransaction> => {
  // Generate a local ID
  const id = `offline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  // Create the transaction object
  const offlineTransaction: OfflineTransaction = {
    id,
    ...transaction,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  
  // Store in local storage
  const existingTransactions = getStoredOfflineTransactions();
  const updatedTransactions = [...existingTransactions, offlineTransaction];
  localStorage.setItem('offline_transactions', JSON.stringify(updatedTransactions));
  
  return Promise.resolve(offlineTransaction);
};

// Retrieve stored offline transactions
export const getStoredOfflineTransactions = (): OfflineTransaction[] => {
  try {
    const storedData = localStorage.getItem('offline_transactions');
    if (!storedData) return [];
    return JSON.parse(storedData) as OfflineTransaction[];
  } catch (error) {
    console.error('Error retrieving offline transactions:', error);
    return [];
  }
};

// Sync offline transactions with the server
export const syncOfflineTransactions = async (): Promise<ApiResponse<{synced: number, failed: number}>> => {
  try {
    const offlineTransactions = getStoredOfflineTransactions();
    
    if (offlineTransactions.length === 0) {
      return {
        success: true,
        data: { synced: 0, failed: 0 },
        timestamp: new Date().toISOString()
      };
    }
    
    let synced = 0;
    let failed = 0;
    const syncResults: Record<string, 'success' | 'failed'> = {};
    
    // Process each transaction
    for (const transaction of offlineTransactions) {
      try {
        // Send to server
        const { error } = await supabase
          .from('transactions')
          .insert({
            transaction_id: transaction.transaction_id,
            student_id: transaction.student_id,
            amount: transaction.amount,
            type: transaction.type,
            status: 'completed', // Mark as completed since we're syncing it now
            device_id: transaction.device_id,
            vendor_id: transaction.vendor_id,
            created_at: transaction.created_at,
            transaction_date: transaction.created_at,
            metadata: transaction.metadata
          });
        
        if (error) {
          console.error('Error syncing transaction:', error);
          syncResults[transaction.id] = 'failed';
          failed++;
        } else {
          syncResults[transaction.id] = 'success';
          synced++;
        }
      } catch (err) {
        console.error('Exception syncing transaction:', err);
        syncResults[transaction.id] = 'failed';
        failed++;
      }
    }
    
    // Update local storage with only failed transactions
    const remainingTransactions = offlineTransactions
      .filter(t => syncResults[t.id] === 'failed');
    
    localStorage.setItem('offline_transactions', JSON.stringify(remainingTransactions));
    
    return {
      success: true,
      data: { synced, failed },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to sync offline transactions:', error);
    return {
      success: false,
      error: 'Failed to sync offline transactions',
      timestamp: new Date().toISOString()
    };
  }
};

// Check if device is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Add event listeners for online/offline status
export const setupConnectivityListeners = (
  onOnline: () => void,
  onOffline: () => void
) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

// Automatically attempt to sync when coming back online
export const setupAutoSync = () => {
  const handleOnline = () => {
    console.log('Device is online. Attempting to sync offline transactions...');
    syncOfflineTransactions()
      .then(result => {
        if (result.success) {
          console.log(`Synced ${result.data?.synced} transactions, ${result.data?.failed} failed.`);
        } else {
          console.error('Auto-sync failed:', result.error);
        }
      });
  };
  
  const handleOffline = () => {
    console.log('Device is offline. Transactions will be stored locally.');
  };
  
  return setupConnectivityListeners(handleOnline, handleOffline);
};
