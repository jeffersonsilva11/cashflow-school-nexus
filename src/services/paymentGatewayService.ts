
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface PaymentTerminal {
  id: string;
  terminal_id: string;
  serial_number: string;
  model: string;
  gateway: 'stone' | 'pagseguro' | 'other';
  vendor_id: string;
  school_id: string;
  status: 'active' | 'inactive' | 'maintenance';
  last_sync_at?: Date | string;
  firmware_version?: string;
  battery_level?: number;
  connection_status: 'online' | 'offline';
  app_version?: string;
  mac_address?: string;
  ip_address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentGatewayTransaction {
  id: string;
  transaction_id: string;
  terminal_id: string;
  device_id?: string;
  payment_gateway: 'stone' | 'pagseguro' | 'other';
  type: 'credit' | 'debit' | 'pix' | 'voucher';
  amount: number;
  status: 'pending' | 'approved' | 'declined' | 'cancelled' | 'error';
  payment_method: 'credit' | 'debit' | 'pix' | 'voucher';
  card_brand?: string;
  installments?: number;
  nsu?: string;
  authorization_code?: string;
  transaction_date: Date | string;
  metadata?: Json;
  student_id?: string;
  school_id?: string;
  vendor_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TerminalRegistrationPayload {
  terminal_id: string;
  serial_number: string;
  model: string;
  gateway: 'stone' | 'pagseguro' | 'other';
  vendor_id?: string;
  school_id: string;
  firmware_version?: string;
  app_version?: string;
  mac_address?: string;
  ip_address?: string;
}

export interface TerminalHeartbeatPayload {
  terminal_id: string;
  connection_status: 'online' | 'offline';
  battery_level?: number;
  ip_address?: string;
}

export interface TransactionPayload {
  terminal_id: string;
  transaction_id: string;
  payment_gateway: 'stone' | 'pagseguro' | 'other';
  type: 'credit' | 'debit' | 'pix' | 'voucher';
  amount: number;
  status: 'pending' | 'approved' | 'declined' | 'cancelled' | 'error';
  payment_method: 'credit' | 'debit' | 'pix' | 'voucher';
  card_brand?: string;
  installments?: number;
  nsu?: string;
  authorization_code?: string;
  student_id?: string;
  vendor_id?: string;
  metadata?: Record<string, any>;
}

// Helper function to ensure transaction_date is a string for Supabase
const formatTransactionDateToString = (transaction: PaymentGatewayTransaction): Record<string, any> => {
  const result: Record<string, any> = { ...transaction };
  
  // Convert Date objects to ISO strings for Supabase
  if (result.transaction_date instanceof Date) {
    result.transaction_date = result.transaction_date.toISOString();
  }
  
  return result;
};

// Payment Gateway Service
export const paymentGatewayService = {
  // Register a new terminal
  async registerTerminal(payload: TerminalRegistrationPayload): Promise<PaymentTerminal> {
    try {
      const { data, error } = await supabase
        .from('payment_terminals')
        .insert({
          terminal_id: payload.terminal_id,
          serial_number: payload.serial_number,
          model: payload.model,
          gateway: payload.gateway,
          vendor_id: payload.vendor_id,
          school_id: payload.school_id,
          firmware_version: payload.firmware_version,
          app_version: payload.app_version,
          mac_address: payload.mac_address,
          ip_address: payload.ip_address,
          status: 'active',
          connection_status: 'offline',
        })
        .select()
        .single();

      if (error) throw error;
      return data as PaymentTerminal;
    } catch (error) {
      console.error('Error registering terminal:', error);
      throw error;
    }
  },

  // Update terminal status
  async updateTerminalStatus(terminal_id: string, status: 'active' | 'inactive' | 'maintenance'): Promise<void> {
    try {
      const { error } = await supabase
        .from('payment_terminals')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('terminal_id', terminal_id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating terminal status:', error);
      throw error;
    }
  },

  // Update terminal heartbeat
  async updateHeartbeat(payload: TerminalHeartbeatPayload): Promise<void> {
    try {
      const { error } = await supabase
        .from('payment_terminals')
        .update({
          connection_status: payload.connection_status,
          battery_level: payload.battery_level,
          ip_address: payload.ip_address,
          last_sync_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('terminal_id', payload.terminal_id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating terminal heartbeat:', error);
      throw error;
    }
  },

  // Process a new transaction
  async processTransaction(payload: TransactionPayload): Promise<PaymentGatewayTransaction> {
    try {
      // Find terminal to get vendor_id and school_id if not provided
      if (!payload.vendor_id) {
        const { data: terminal, error: terminalError } = await supabase
          .from('payment_terminals')
          .select('vendor_id, school_id')
          .eq('terminal_id', payload.terminal_id)
          .single();

        if (terminalError) throw terminalError;
        payload.vendor_id = terminal.vendor_id;
      }

      // Create transaction record with the correct types for Supabase
      const transactionData = {
        transaction_id: payload.transaction_id,
        terminal_id: payload.terminal_id,
        payment_gateway: payload.payment_gateway,
        type: payload.type,
        amount: payload.amount,
        status: payload.status,
        payment_method: payload.payment_method,
        card_brand: payload.card_brand,
        installments: payload.installments,
        nsu: payload.nsu,
        authorization_code: payload.authorization_code,
        transaction_date: new Date().toISOString(),
        student_id: payload.student_id,
        vendor_id: payload.vendor_id,
        metadata: payload.metadata as Json,
      };

      const { data, error } = await supabase
        .from('payment_gateway_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) throw error;
      return data as PaymentGatewayTransaction;
    } catch (error) {
      console.error('Error processing transaction:', error);
      throw error;
    }
  },

  // Get all terminals
  async getTerminals(filters: { vendorId?: string; schoolId?: string; status?: string } = {}): Promise<PaymentTerminal[]> {
    try {
      let query = supabase.from('payment_terminals').select('*');

      if (filters.vendorId) {
        query = query.eq('vendor_id', filters.vendorId);
      }

      if (filters.schoolId) {
        query = query.eq('school_id', filters.schoolId);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PaymentTerminal[];
    } catch (error) {
      console.error('Error getting terminals:', error);
      return [];
    }
  },

  // Get terminal transactions
  async getTerminalTransactions(terminalId: string, limit = 50): Promise<PaymentGatewayTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('payment_gateway_transactions')
        .select('*')
        .eq('terminal_id', terminalId)
        .order('transaction_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as PaymentGatewayTransaction[];
    } catch (error) {
      console.error('Error getting terminal transactions:', error);
      return [];
    }
  },
};
