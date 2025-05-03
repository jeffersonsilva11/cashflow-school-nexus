
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Get the request path and extract the endpoint
  const url = new URL(req.url)
  const path = url.pathname.split('/').pop()
  const authHeader = req.headers.get('Authorization')

  // Simple authentication check
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid authorization token' }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  // Extract the API key
  const apiKey = authHeader.replace('Bearer ', '')

  // In a real implementation, we would validate the API key against authorized terminals
  // For this demo, we'll just check if the key format is correct
  if (apiKey !== 'sk_test_sample_key') {
    console.log('Invalid API key provided:', apiKey)
    return new Response(
      JSON.stringify({ error: 'Invalid API key' }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    // Process endpoint requests
    switch (path) {
      case 'process':
        if (req.method !== 'POST') {
          return methodNotAllowed()
        }
        return await processTransaction(req, supabase)

      case 'sync':
        if (req.method !== 'POST') {
          return methodNotAllowed()
        }
        return await syncTransactions(req, supabase)

      case 'status':
        if (req.method !== 'POST') {
          return methodNotAllowed()
        }
        return await updateStatus(req, supabase)

      case 'config':
        if (req.method !== 'GET') {
          return methodNotAllowed()
        }
        return await getConfig(req, supabase)

      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Process a new transaction from a terminal
async function processTransaction(req: Request, supabase: any) {
  const data = await req.json()
  
  console.log('Processing transaction:', data)
  
  // Validate required fields
  if (!data.terminal_id || !data.transaction_id || !data.amount || 
      !data.payment_method || !data.vendor_id || !data.school_id) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
  
  try {
    // Save the transaction to the database
    const { data: transaction, error } = await supabase
      .from('payment_gateway_transactions')
      .insert({
        transaction_id: data.transaction_id,
        payment_gateway: data.payment_gateway || 'stone',
        terminal_id: data.terminal_id,
        device_id: data.device_id,
        amount: data.amount,
        status: data.status || 'completed',
        type: data.type || 'purchase',
        payment_method: data.payment_method,
        card_brand: data.card_brand,
        installments: data.installments,
        authorization_code: data.authorization_code,
        nsu: data.nsu,
        transaction_date: data.timestamp || new Date().toISOString(),
        vendor_id: data.vendor_id,
        student_id: data.student_id,
        school_id: data.school_id,
        metadata: data.metadata
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error saving transaction:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save transaction', details: error }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Update terminal last sync time
    await supabase
      .from('payment_terminals')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('terminal_id', data.terminal_id)
    
    // Here we would also update vendor financials and student balance if needed
    
    return new Response(
      JSON.stringify({ success: true, data: transaction }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in processTransaction:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// Sync transactions from a terminal
async function syncTransactions(req: Request, supabase: any) {
  const data = await req.json()
  
  console.log('Syncing transactions:', data)
  
  // Validate required fields
  if (!data.terminal_id || !data.transactions || !Array.isArray(data.transactions)) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
  
  try {
    const processed = []
    const mismatched = []
    
    // Process each transaction and check if it already exists in our system
    for (const transaction of data.transactions) {
      if (!transaction.transaction_id) continue
      
      // Check if transaction already exists
      const { data: existingTransaction } = await supabase
        .from('payment_gateway_transactions')
        .select('*')
        .eq('transaction_id', transaction.transaction_id)
        .single()
      
      if (!existingTransaction) {
        // New transaction, save it
        if (transaction.amount && transaction.payment_method && 
            transaction.vendor_id && transaction.school_id) {
          const { data: saved, error } = await supabase
            .from('payment_gateway_transactions')
            .insert({
              transaction_id: transaction.transaction_id,
              payment_gateway: transaction.payment_gateway || 'stone',
              terminal_id: data.terminal_id,
              amount: transaction.amount,
              status: transaction.status || 'completed',
              type: transaction.type || 'purchase',
              payment_method: transaction.payment_method,
              card_brand: transaction.card_brand,
              installments: transaction.installments,
              authorization_code: transaction.authorization_code,
              nsu: transaction.nsu,
              transaction_date: transaction.timestamp || new Date().toISOString(),
              vendor_id: transaction.vendor_id,
              student_id: transaction.student_id,
              school_id: transaction.school_id,
              metadata: transaction.metadata
            })
            .select()
            .single()
          
          if (!error) {
            processed.push(saved)
          } else {
            mismatched.push({
              transaction_id: transaction.transaction_id,
              reason: 'Failed to save',
              error: error.message
            })
          }
        } else {
          mismatched.push({
            transaction_id: transaction.transaction_id,
            reason: 'Incomplete transaction data'
          })
        }
      } else if (existingTransaction.status !== transaction.status && transaction.status) {
        // Status mismatch, update our record
        const { error: updateError } = await supabase
          .from('payment_gateway_transactions')
          .update({ status: transaction.status })
          .eq('transaction_id', transaction.transaction_id)
        
        if (updateError) {
          mismatched.push({
            transaction_id: transaction.transaction_id,
            reason: 'Failed to update status',
            error: updateError.message
          })
        } else {
          processed.push(existingTransaction)
        }
      }
    }
    
    // Update terminal last sync time
    await supabase
      .from('payment_terminals')
      .update({ 
        last_sync_at: new Date().toISOString(),
        status: 'active'
      })
      .eq('terminal_id', data.terminal_id)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: processed.length,
        mismatched
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in syncTransactions:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// Update terminal status
async function updateStatus(req: Request, supabase: any) {
  const data = await req.json()
  
  console.log('Updating terminal status:', data)
  
  // Validate required fields
  if (!data.terminal_id || !data.status) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
  
  try {
    // Check if terminal exists
    const { data: terminal, error: findError } = await supabase
      .from('payment_terminals')
      .select('*')
      .eq('terminal_id', data.terminal_id)
      .single()
    
    if (findError || !terminal) {
      return new Response(
        JSON.stringify({ error: 'Terminal not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Update terminal status and other fields
    const updateData = {
      status: data.status,
      last_sync_at: new Date().toISOString(),
    }
    
    // Add optional fields if provided
    if (data.firmware_version) updateData.firmware_version = data.firmware_version
    if (data.battery_level !== undefined) updateData.battery_level = data.battery_level
    if (data.connection_status) updateData.connection_status = data.connection_status
    
    const { error } = await supabase
      .from('payment_terminals')
      .update(updateData)
      .eq('terminal_id', data.terminal_id)
    
    if (error) {
      console.error('Error updating terminal status:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to update terminal status', details: error }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in updateStatus:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// Get terminal configuration
async function getConfig(req: Request, supabase: any) {
  const url = new URL(req.url)
  const terminalId = url.searchParams.get('terminal_id')
  
  if (!terminalId) {
    return new Response(
      JSON.stringify({ error: 'Missing terminal_id parameter' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
  
  console.log('Getting configuration for terminal:', terminalId)
  
  try {
    // Check if terminal exists
    const { data: terminal, error: findError } = await supabase
      .from('payment_terminals')
      .select('*')
      .eq('terminal_id', terminalId)
      .single()
    
    if (findError || !terminal) {
      return new Response(
        JSON.stringify({ error: 'Terminal not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // In a real implementation, this would be fetched from a configuration table
    // For now, we return a hardcoded configuration
    const config = {
      terminal_id: terminalId,
      server_endpoint: `${supabaseUrl}/functions/v1/terminal-api`,
      api_key: 'sk_test_sample_key', // In production, this would be a secure, per-terminal key
      auto_sync_interval_minutes: 15,
      print_receipt: true,
      allowed_payment_methods: ['credit', 'debit', 'pix'],
      timeout_seconds: 30,
      debug_mode: false
    }
    
    return new Response(
      JSON.stringify({ success: true, config }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in getConfig:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}

// Helper function for method not allowed responses
function methodNotAllowed() {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}
