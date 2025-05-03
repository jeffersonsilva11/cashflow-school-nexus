
// Terminal API Edge Function to handle requests from Android POS terminals

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';
import { corsHeaders } from '../_shared/cors.ts';

// Create a Supabase client with the Auth context of the function
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request
    const { path, method } = new URL(req.url);
    const body = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    // Validate API key for terminal auth
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const apiKey = authHeader.split(' ')[1];
    
    // In a real implementation, validate API key against terminal credentials in database
    // For now, simple validation for demo purposes
    const { data: terminal, error: terminalError } = await supabase
      .from('payment_terminals')
      .select('*')
      .eq('terminal_id', body.terminal_id)
      .single();
      
    if (terminalError || !terminal) {
      return new Response(
        JSON.stringify({ error: 'Terminal not found or unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Handle different endpoints
    const pathSegments = path.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1];
    
    switch (endpoint) {
      // Handle transaction processing
      case 'process':
        return await handleProcessTransaction(body, terminal);
        
      // Handle transaction sync
      case 'sync':
        return await handleSyncTransactions(body, terminal);
        
      // Handle terminal status update
      case 'status':
        return await handleStatusUpdate(body, terminal);
        
      // Handle terminal configuration request
      case 'config':
        return await handleConfigRequest(body, terminal);
        
      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Terminal API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Handle new transaction from terminal
async function handleProcessTransaction(data, terminal) {
  try {
    const {
      transaction_id,
      amount,
      payment_method,
      card_brand,
      installments,
      authorization_code,
      nsu,
      student_id,
      vendor_id,
      school_id,
    } = data;
    
    // Validate required fields
    if (!transaction_id || !amount || !payment_method || !vendor_id || !school_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Insert transaction into database
    const { data: transactionData, error: transactionError } = await supabase
      .from('payment_gateway_transactions')
      .insert({
        transaction_id,
        payment_gateway: terminal.gateway,
        terminal_id: terminal.terminal_id,
        amount,
        status: 'completed',
        type: 'purchase',
        payment_method,
        card_brand,
        installments,
        authorization_code,
        nsu,
        transaction_date: new Date(),
        vendor_id,
        student_id,
        school_id,
        metadata: {
          processed_by: 'terminal',
          device_timestamp: data.timestamp
        }
      })
      .select()
      .single();
    
    if (transactionError) {
      console.error('Error saving transaction:', transactionError);
      return new Response(
        JSON.stringify({ error: 'Error saving transaction', details: transactionError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Update related systems (student balance, vendor financials)
    await updateRelatedSystems(transactionData);
    
    // Update terminal last sync time
    await supabase
      .from('payment_terminals')
      .update({
        last_sync: new Date(),
        status: 'active'
      })
      .eq('terminal_id', terminal.terminal_id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        transaction: transactionData,
        message: 'Transaction processed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Process transaction error:', error);
    return new Response(
      JSON.stringify({ error: 'Transaction processing failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Handle transaction sync from terminal
async function handleSyncTransactions(data, terminal) {
  try {
    const { transactions, terminal_id } = data;
    
    if (!transactions || !Array.isArray(transactions)) {
      return new Response(
        JSON.stringify({ error: 'Invalid transactions data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const processed = [];
    const failed = [];
    
    // Process each transaction
    for (const transaction of transactions) {
      // Check if transaction already exists
      const { data: existingTransaction } = await supabase
        .from('payment_gateway_transactions')
        .select('*')
        .eq('transaction_id', transaction.transaction_id)
        .single();
      
      if (!existingTransaction) {
        // Add required fields
        transaction.payment_gateway = terminal.gateway;
        transaction.terminal_id = terminal_id;
        transaction.transaction_date = new Date(transaction.timestamp || Date.now());
        
        // Insert new transaction
        const { data: newTransaction, error } = await supabase
          .from('payment_gateway_transactions')
          .insert(transaction)
          .select()
          .single();
        
        if (error) {
          failed.push({ 
            transaction_id: transaction.transaction_id, 
            error: error.message 
          });
        } else {
          processed.push(newTransaction);
          
          // Update related systems if status is completed
          if (transaction.status === 'completed') {
            await updateRelatedSystems(newTransaction);
          }
        }
      } else {
        // Transaction already exists, check if status needs updating
        if (existingTransaction.status !== transaction.status) {
          const { error } = await supabase
            .from('payment_gateway_transactions')
            .update({ status: transaction.status })
            .eq('transaction_id', transaction.transaction_id);
          
          if (error) {
            failed.push({ 
              transaction_id: transaction.transaction_id, 
              error: error.message 
            });
          } else {
            processed.push(existingTransaction);
          }
        } else {
          // Already exists with same status
          processed.push(existingTransaction);
        }
      }
    }
    
    // Update terminal sync time
    await supabase
      .from('payment_terminals')
      .update({
        last_sync: new Date(),
        status: 'active'
      })
      .eq('terminal_id', terminal.terminal_id);
    
    return new Response(
      JSON.stringify({
        success: true,
        processed: processed.length,
        failed: failed.length,
        message: `Synced ${processed.length} transactions, ${failed.length} failed`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sync transactions error:', error);
    return new Response(
      JSON.stringify({ error: 'Transaction sync failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Handle terminal status update
async function handleStatusUpdate(data, terminal) {
  try {
    const { status, battery_level, firmware_version, connection_status } = data;
    
    // Update terminal status
    const { error } = await supabase
      .from('payment_terminals')
      .update({
        status: status || terminal.status,
        last_sync: new Date(),
        battery_level: battery_level !== undefined ? battery_level : terminal.battery_level,
        firmware_version: firmware_version || terminal.firmware_version,
        connection_status: connection_status || terminal.connection_status
      })
      .eq('terminal_id', terminal.terminal_id);
    
    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to update terminal status', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Terminal status updated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Terminal status update error:', error);
    return new Response(
      JSON.stringify({ error: 'Status update failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Handle terminal configuration request
async function handleConfigRequest(data, terminal) {
  try {
    // Get terminal configuration options
    // In a real system, this would pull from a configuration database
    const config = {
      terminal_id: terminal.terminal_id,
      server_endpoint: `${supabaseUrl}/functions/v1/terminal-api`,
      auto_sync_interval_minutes: 15,
      print_receipt: true,
      allowed_payment_methods: ['credit', 'debit', 'pix'],
      timeout_seconds: 30,
      debug_mode: process.env.NODE_ENV !== 'production',
      // Gateway-specific settings
      gateway_settings: {
        stone: {
          merchant_key: 'MERCHANT_KEY_PLACEHOLDER',
          stone_code: 'STONE_CODE_PLACEHOLDER',
          environment: 'production'
        },
        mercadopago: {
          public_key: 'PUBLIC_KEY_PLACEHOLDER',
          access_token: 'ACCESS_TOKEN_PLACEHOLDER',
        },
        pagseguro: {
          app_id: 'APP_ID_PLACEHOLDER',
          app_key: 'APP_KEY_PLACEHOLDER',
        }
      }[terminal.gateway] || {}
    };
    
    return new Response(
      JSON.stringify({ 
        success: true,
        config
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Terminal configuration error:', error);
    return new Response(
      JSON.stringify({ error: 'Configuration request failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Helper function to update related systems
async function updateRelatedSystems(transaction) {
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
          // Get vendor type to determine commission
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
