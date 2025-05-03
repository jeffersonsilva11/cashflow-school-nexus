
import { supabase } from "@/integrations/supabase/client";
import { VendorTransfer, VendorProduct, Vendor } from "./vendorService";
import { PaymentInfo, PaymentStatus } from "./paymentService";

// Types for payment gateway transactions
export interface PaymentGatewayTransaction {
  id: string;
  transaction_id: string;
  payment_gateway: 'stone' | 'mercadopago' | 'pagseguro' | 'other';
  terminal_id: string;
  device_id?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  type: 'purchase' | 'refund' | 'cancellation';
  payment_method: 'credit' | 'debit' | 'pix' | 'voucher' | 'other';
  card_brand?: string;
  installments?: number;
  authorization_code?: string;
  nsu?: string; // Transaction NSU (Number Sequence Unique) - specific to some gateways
  transaction_date: string | Date;
  vendor_id: string;
  student_id?: string;
  school_id: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Interface for payment terminal device
export interface PaymentTerminal {
  id: string;
  terminal_id: string;
  serial_number: string;
  model: string;
  gateway: 'stone' | 'mercadopago' | 'pagseguro' | 'other';
  vendor_id: string;
  school_id: string;
  status: 'active' | 'inactive' | 'maintenance';
  last_sync_at?: Date | string;
  firmware_version?: string;
  battery_level?: number;
  connection_status?: 'online' | 'offline';
  created_at?: string;
  updated_at?: string;
}

// API Configuration for different payment gateways
interface PaymentGatewayConfig {
  baseUrl: string;
  apiKey?: string;
  stoneCode?: string; // Stone specific
  merchantId?: string;
  appKey?: string; // PagSeguro/Mercado Pago specific
  appToken?: string;
  timeout: number;
}

// Base gateway service to be extended by specific implementations
class BasePaymentGateway {
  protected config: PaymentGatewayConfig;
  
  constructor(config: PaymentGatewayConfig) {
    this.config = config;
  }
  
  // This will be implemented by specific gateway integrations
  async processPayment(paymentData: any): Promise<any> {
    throw new Error("Method not implemented by base class");
  }
  
  // This will be implemented by specific gateway integrations
  async refundPayment(transactionId: string, amount?: number): Promise<any> {
    throw new Error("Method not implemented by base class");
  }
  
  // This will be implemented by specific gateway integrations
  async getTransactionStatus(transactionId: string): Promise<any> {
    throw new Error("Method not implemented by base class");
  }
}

// Stone Gateway implementation
export class StonePaymentGateway extends BasePaymentGateway {
  constructor(config: PaymentGatewayConfig) {
    super({
      ...config,
      baseUrl: 'https://api.stone.com.br/v1', // Example URL, replace with actual Stone API
    });
  }
  
  // Process a payment through Stone gateway
  async processPayment(paymentData: {
    amount: number;
    payment_method: 'credit' | 'debit' | 'pix' | 'voucher';
    terminal_id: string;
    order_id?: string;
    installments?: number;
    description?: string;
  }): Promise<any> {
    // In a real implementation, this would make an API call to Stone
    console.log('Stone payment processing', paymentData);
    
    // Mock implementation for now - this would actually call the Stone API
    const mockResponse = {
      transaction_id: `ST${Math.floor(100000 + Math.random() * 900000)}`,
      amount: paymentData.amount,
      status: Math.random() > 0.1 ? 'completed' : 'failed',
      authorization_code: `AUT${Math.floor(100000 + Math.random() * 900000)}`,
      nsu: `${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
    };
    
    return mockResponse;
  }
  
  // Refund a payment through Stone gateway
  async refundPayment(transactionId: string, amount?: number): Promise<any> {
    console.log('Stone refund processing', { transactionId, amount });
    
    // Mock implementation for now
    const mockResponse = {
      refund_id: `RF${Math.floor(100000 + Math.random() * 900000)}`,
      original_transaction_id: transactionId,
      amount: amount,
      status: Math.random() > 0.1 ? 'completed' : 'failed',
      date: new Date().toISOString(),
    };
    
    return mockResponse;
  }
  
  // Get transaction status from Stone gateway
  async getTransactionStatus(transactionId: string): Promise<any> {
    console.log('Stone transaction status check', { transactionId });
    
    // Mock implementation for now
    const mockResponse = {
      transaction_id: transactionId,
      status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
      last_updated: new Date().toISOString(),
    };
    
    return mockResponse;
  }
  
  // Specific Stone API methods
  async reconcileTransactions(terminalId: string, date: string): Promise<any> {
    console.log('Stone reconciliation', { terminalId, date });
    
    // Mock implementation for reconciliation
    const mockResponse = {
      reconciliation_id: `RC${Math.floor(100000 + Math.random() * 900000)}`,
      terminal_id: terminalId,
      date: date,
      status: 'completed',
      transactions_count: Math.floor(5 + Math.random() * 20),
      total_amount: Math.floor(1000 + Math.random() * 9000),
      mismatches: [],
    };
    
    return mockResponse;
  }
}

// Mercado Pago Gateway implementation (stub for future implementation)
export class MercadoPagoGateway extends BasePaymentGateway {
  constructor(config: PaymentGatewayConfig) {
    super({
      ...config,
      baseUrl: 'https://api.mercadopago.com/v1',
    });
  }
  
  // Basic methods that would be implemented with Mercado Pago SDK
  async processPayment(paymentData: any): Promise<any> {
    console.log('Mercado Pago payment processing', paymentData);
    // Mock implementation - would use Mercado Pago API in real implementation
    return {
      transaction_id: `MP${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'completed',
    };
  }
  
  async refundPayment(transactionId: string): Promise<any> {
    console.log('Mercado Pago refund', { transactionId });
    return { status: 'completed' };
  }
  
  async getTransactionStatus(transactionId: string): Promise<any> {
    console.log('Mercado Pago status check', { transactionId });
    return { status: 'completed' };
  }
}

// PagSeguro Gateway implementation (stub for future implementation)
export class PagSeguroGateway extends BasePaymentGateway {
  constructor(config: PaymentGatewayConfig) {
    super({
      ...config,
      baseUrl: 'https://api.pagseguro.com/v1',
    });
  }
  
  // Basic methods that would be implemented with PagSeguro SDK
  async processPayment(paymentData: any): Promise<any> {
    console.log('PagSeguro payment processing', paymentData);
    // Mock implementation - would use PagSeguro API in real implementation
    return {
      transaction_id: `PS${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'completed',
    };
  }
  
  async refundPayment(transactionId: string): Promise<any> {
    console.log('PagSeguro refund', { transactionId });
    return { status: 'completed' };
  }
  
  async getTransactionStatus(transactionId: string): Promise<any> {
    console.log('PagSeguro status check', { transactionId });
    return { status: 'completed' };
  }
}

// Gateway Factory to create the appropriate gateway based on the provider
export class PaymentGatewayFactory {
  static createGateway(provider: 'stone' | 'mercadopago' | 'pagseguro' | 'other', config: Partial<PaymentGatewayConfig> = {}): BasePaymentGateway {
    const defaultConfig: PaymentGatewayConfig = {
      baseUrl: '',
      timeout: 30000,
      ...config
    };
    
    switch (provider) {
      case 'stone':
        return new StonePaymentGateway(defaultConfig);
      case 'mercadopago':
        return new MercadoPagoGateway(defaultConfig);
      case 'pagseguro':
        return new PagSeguroGateway(defaultConfig);
      default:
        throw new Error(`Payment gateway provider ${provider} not supported`);
    }
  }
}

// Service to manage transactions from payment gateways
export class PaymentGatewayService {
  // Save a transaction from a payment terminal to our database
  async saveTransaction(transaction: Omit<PaymentGatewayTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentGatewayTransaction | null> {
    try {
      // Convert Date objects to ISO strings for Supabase
      const transactionDate = transaction.transaction_date instanceof Date 
        ? transaction.transaction_date.toISOString() 
        : transaction.transaction_date;

      // Convert data for Supabase
      const { data, error } = await supabase
        .from('payment_gateway_transactions')
        .insert({
          transaction_id: transaction.transaction_id,
          payment_gateway: transaction.payment_gateway,
          terminal_id: transaction.terminal_id,
          device_id: transaction.device_id,
          amount: transaction.amount,
          status: transaction.status,
          type: transaction.type,
          payment_method: transaction.payment_method,
          card_brand: transaction.card_brand,
          installments: transaction.installments,
          authorization_code: transaction.authorization_code,
          nsu: transaction.nsu,
          transaction_date: transactionDate,
          vendor_id: transaction.vendor_id,
          student_id: transaction.student_id,
          school_id: transaction.school_id,
          metadata: transaction.metadata
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving gateway transaction:', error);
        return null;
      }
      
      // Update related systems (student balance, vendor financials)
      if (data && data.status === 'completed') {
        await this.updateRelatedSystems(data as unknown as PaymentGatewayTransaction);
      }
      
      return data as unknown as PaymentGatewayTransaction;
    } catch (error) {
      console.error('Error in saveTransaction:', error);
      return null;
    }
  }
  
  // Register a new payment terminal
  async registerTerminal(terminal: Omit<PaymentTerminal, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentTerminal | null> {
    try {
      // Convert last_sync to ISO string if it's a Date
      const lastSync = terminal.last_sync_at instanceof Date 
        ? terminal.last_sync_at.toISOString() 
        : terminal.last_sync_at;

      const { data, error } = await supabase
        .from('payment_terminals')
        .insert({
          terminal_id: terminal.terminal_id,
          serial_number: terminal.serial_number,
          model: terminal.model,
          gateway: terminal.gateway,
          vendor_id: terminal.vendor_id,
          school_id: terminal.school_id,
          status: terminal.status,
          last_sync_at: lastSync,
          firmware_version: terminal.firmware_version,
          battery_level: terminal.battery_level,
          connection_status: terminal.connection_status
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error registering terminal:', error);
        return null;
      }
      
      return data as unknown as PaymentTerminal;
    } catch (error) {
      console.error('Error in registerTerminal:', error);
      return null;
    }
  }
  
  // Update terminal status
  async updateTerminalStatus(terminalId: string, status: PaymentTerminal['status'], metadata?: Partial<PaymentTerminal>): Promise<boolean> {
    try {
      const updateData: Record<string, any> = {
        status: status,
        last_sync_at: new Date().toISOString()
      };
      
      // Add optional fields if provided
      if (metadata?.firmware_version) updateData.firmware_version = metadata.firmware_version;
      if (metadata?.battery_level !== undefined) updateData.battery_level = metadata.battery_level;
      if (metadata?.connection_status) updateData.connection_status = metadata.connection_status;
      
      const { error } = await supabase
        .from('payment_terminals')
        .update(updateData)
        .eq('terminal_id', terminalId);
      
      if (error) {
        console.error('Error updating terminal status:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateTerminalStatus:', error);
      return false;
    }
  }
  
  // Process a refund
  async processRefund(originalTransactionId: string, amount?: number): Promise<PaymentGatewayTransaction | null> {
    try {
      // First, find the original transaction
      const { data: originalTransactionData, error: findError } = await supabase
        .from('payment_gateway_transactions')
        .select('*')
        .eq('transaction_id', originalTransactionId)
        .single();
      
      if (findError || !originalTransactionData) {
        console.error('Original transaction not found:', originalTransactionId);
        return null;
      }
      
      const originalTransaction = originalTransactionData as unknown as PaymentGatewayTransaction;
      
      // Create the gateway based on the original transaction
      const gateway = PaymentGatewayFactory.createGateway(originalTransaction.payment_gateway);
      
      // Process the refund with the gateway
      const refundResult = await gateway.refundPayment(originalTransactionId, amount || originalTransaction.amount);
      
      if (refundResult.status !== 'completed') {
        console.error('Refund failed at gateway level:', refundResult);
        return null;
      }
      
      // Save the refund transaction
      return await this.saveTransaction({
        transaction_id: refundResult.refund_id || `RF-${originalTransactionId}`,
        payment_gateway: originalTransaction.payment_gateway,
        terminal_id: originalTransaction.terminal_id,
        device_id: originalTransaction.device_id,
        amount: -(amount || originalTransaction.amount), // Negative amount for refunds
        status: 'completed',
        type: 'refund',
        payment_method: originalTransaction.payment_method,
        card_brand: originalTransaction.card_brand,
        authorization_code: refundResult.authorization_code,
        nsu: refundResult.nsu,
        transaction_date: new Date().toISOString(),
        vendor_id: originalTransaction.vendor_id,
        student_id: originalTransaction.student_id,
        school_id: originalTransaction.school_id,
        metadata: {
          original_transaction_id: originalTransactionId,
          refund_reason: 'Customer requested'
        }
      });
    } catch (error) {
      console.error('Error in processRefund:', error);
      return null;
    }
  }
  
  // Reconcile transactions from terminal with database
  async reconcileTerminalTransactions(terminalId: string, transactions: Array<Partial<PaymentGatewayTransaction>>): Promise<{
    success: boolean;
    processed: number;
    mismatched: Array<any>;
  }> {
    try {
      const processed = [];
      const mismatched = [];
      
      // Process each transaction and check if it already exists in our system
      for (const transaction of transactions) {
        if (!transaction.transaction_id) continue;
        
        // Check if transaction already exists
        const { data: existingTransactionData } = await supabase
          .from('payment_gateway_transactions')
          .select('*')
          .eq('transaction_id', transaction.transaction_id)
          .single();
        
        const existingTransaction = existingTransactionData as unknown as PaymentGatewayTransaction | null;
        
        if (!existingTransaction) {
          // New transaction, save it
          if (transaction.amount && transaction.terminal_id && transaction.payment_method && 
              transaction.vendor_id && transaction.school_id) {
            const saved = await this.saveTransaction({
              transaction_id: transaction.transaction_id,
              payment_gateway: transaction.payment_gateway || 'stone',
              terminal_id: transaction.terminal_id,
              amount: transaction.amount,
              status: transaction.status || 'completed',
              type: transaction.type || 'purchase',
              payment_method: transaction.payment_method,
              card_brand: transaction.card_brand,
              installments: transaction.installments,
              authorization_code: transaction.authorization_code,
              nsu: transaction.nsu,
              transaction_date: transaction.transaction_date || new Date().toISOString(),
              vendor_id: transaction.vendor_id,
              student_id: transaction.student_id,
              school_id: transaction.school_id,
              metadata: transaction.metadata
            });
            if (saved) processed.push(saved);
          } else {
            mismatched.push({
              transaction_id: transaction.transaction_id,
              reason: 'Incomplete transaction data'
            });
          }
        } else if (existingTransaction.status !== transaction.status && transaction.status) {
          // Status mismatch, update our record
          const { error: updateError } = await supabase
            .from('payment_gateway_transactions')
            .update({ status: transaction.status })
            .eq('transaction_id', transaction.transaction_id);
          
          if (updateError) {
            mismatched.push({
              transaction_id: transaction.transaction_id,
              reason: 'Failed to update status',
              error: updateError.message
            });
          } else {
            processed.push(existingTransaction);
          }
        }
      }
      
      // Update terminal last sync time
      await this.updateTerminalStatus(terminalId, 'active');
      
      return {
        success: true,
        processed: processed.length,
        mismatched
      };
    } catch (error) {
      console.error('Error in reconcileTerminalTransactions:', error);
      return {
        success: false,
        processed: 0,
        mismatched: [{ reason: 'Server error', error: String(error) }]
      };
    }
  }
  
  // Private method to update related systems when a transaction is completed
  private async updateRelatedSystems(transaction: PaymentGatewayTransaction): Promise<void> {
    try {
      // If this is a student purchase, update the student's balance
      if (transaction.student_id && transaction.type === 'purchase') {
        // This would update the student's balance in a real system
        console.log(`Updating student ${transaction.student_id} balance after purchase of ${transaction.amount}`);
      }
      
      // Update vendor financial records
      if (transaction.vendor_id) {
        // If purchase, add to vendor balance
        if (transaction.type === 'purchase') {
          // Get vendor financials
          const { data: financials } = await supabase
            .from('vendors_financials')
            .select('*')
            .eq('vendor_id', transaction.vendor_id)
            .single();
          
          if (financials) {
            // Calculate commission if this is a third-party vendor
            const { data: vendor } = await supabase
              .from('vendors')
              .select('type, commission_rate')
              .eq('id', transaction.vendor_id)
              .single();
            
            if (vendor && vendor.type === 'third_party') {
              const commissionRate = vendor.commission_rate || 0.1; // Default 10% if not specified
              const commission = transaction.amount * commissionRate;
              const netAmount = transaction.amount - commission;
              
              // Update vendor financials
              await supabase
                .from('vendors_financials')
                .update({
                  balance: (financials.balance || 0) + netAmount,
                  pending_transfer: (financials.pending_transfer || 0) + netAmount
                })
                .eq('vendor_id', transaction.vendor_id);
            } else {
              // Own vendor, no commission
              await supabase
                .from('vendors_financials')
                .update({
                  balance: (financials.balance || 0) + transaction.amount
                })
                .eq('vendor_id', transaction.vendor_id);
            }
          }
        }
        // If refund, subtract from vendor balance
        else if (transaction.type === 'refund') {
          // Similar logic for refunds
          console.log(`Updating vendor ${transaction.vendor_id} balance after refund of ${Math.abs(transaction.amount)}`);
        }
      }
    } catch (error) {
      console.error('Error updating related systems:', error);
    }
  }
  
  // Get all transactions for a vendor
  async getVendorTransactions(vendorId: string, limit = 100): Promise<PaymentGatewayTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('payment_gateway_transactions')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('transaction_date', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching vendor transactions:', error);
        return [];
      }
      
      return data as unknown as PaymentGatewayTransaction[];
    } catch (error) {
      console.error('Error in getVendorTransactions:', error);
      return [];
    }
  }
  
  // Get all terminals for a vendor or school
  async getTerminals(filter: { vendorId?: string, schoolId?: string }): Promise<PaymentTerminal[]> {
    try {
      let query = supabase.from('payment_terminals').select('*');
      
      if (filter.vendorId) {
        query = query.eq('vendor_id', filter.vendorId);
      }
      
      if (filter.schoolId) {
        query = query.eq('school_id', filter.schoolId);
      }
      
      const { data, error } = await query.order('terminal_id', { ascending: true });
      
      if (error) {
        console.error('Error fetching terminals:', error);
        return [];
      }
      
      return data as unknown as PaymentTerminal[];
    } catch (error) {
      console.error('Error in getTerminals:', error);
      return [];
    }
  }
}

// Singleton instance
export const paymentGatewayService = new PaymentGatewayService();

// Function to simulate a payment from the Android app at the cafeteria
export const simulateTerminalPayment = async (
  terminalId: string,
  studentId: string,
  amount: number,
  vendorId: string,
  schoolId: string,
  paymentMethod: 'credit' | 'debit' | 'pix' | 'voucher' = 'debit'
): Promise<PaymentGatewayTransaction | null> => {
  try {
    // Get terminal to determine gateway
    const { data: terminal } = await supabase
      .from('payment_terminals')
      .select('*')
      .eq('terminal_id', terminalId)
      .single();
    
    if (!terminal) {
      console.error('Terminal not found:', terminalId);
      return null;
    }
    
    // Create gateway instance
    const gateway = PaymentGatewayFactory.createGateway(terminal.gateway as any);
    
    // Process payment with payment gateway
    const paymentResult = await gateway.processPayment({
      amount,
      payment_method: paymentMethod,
      terminal_id: terminalId,
      description: `Student purchase at vendor ${vendorId}`
    });
    
    if (paymentResult.status !== 'completed') {
      console.error('Payment failed at gateway level:', paymentResult);
      return null;
    }
    
    // Save transaction to our system
    return await paymentGatewayService.saveTransaction({
      transaction_id: paymentResult.transaction_id,
      payment_gateway: terminal.gateway as 'stone' | 'mercadopago' | 'pagseguro' | 'other',
      terminal_id: terminalId,
      amount,
      status: 'completed',
      type: 'purchase',
      payment_method: paymentMethod,
      authorization_code: paymentResult.authorization_code,
      nsu: paymentResult.nsu,
      transaction_date: new Date().toISOString(),
      vendor_id: vendorId,
      student_id: studentId,
      school_id: schoolId,
      metadata: {
        processed_by: 'terminal',
        receipt_printed: true
      }
    });
  } catch (error) {
    console.error('Error simulating terminal payment:', error);
    return null;
  }
};

// Export a configuration template for Android app settings
export const getTerminalConfiguration = (terminalId: string): Promise<Record<string, any>> => {
  // This would be populated from the database in a real implementation
  return Promise.resolve({
    terminal_id: terminalId,
    server_endpoint: 'https://api.app.com/terminal',
    api_key: 'sk_test_sample_key',
    auto_sync_interval_minutes: 15,
    print_receipt: true,
    allowed_payment_methods: ['credit', 'debit', 'pix'],
    timeout_seconds: 30,
    debug_mode: false
  });
};
