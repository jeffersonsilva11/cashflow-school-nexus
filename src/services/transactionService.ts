
import { supabase } from "@/integrations/supabase/client";

// Define a type for transaction data based on the Database type
export type Transaction = {
  id: string;
  transaction_id: string;
  student_id?: string;
  device_id?: string;
  vendor_id?: string;
  amount: number;
  type: 'purchase' | 'topup' | 'refund';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transaction_date: Date | string;
  payment_method?: string;
  payment_gateway_id?: string;
  notes?: string;
  student?: {
    name: string;
  };
  vendor?: {
    name: string;
    type: string;
  };
  school?: {
    name: string;
  };
};

// Function to fetch recent transactions
export async function fetchRecentTransactions(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        student:student_id (name),
        vendor:vendor_id (name, type)
      `)
      .order('transaction_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }

    return data as Transaction[];
  } catch (error) {
    console.error("Error in fetchRecentTransactions:", error);
    return [];
  }
}

// Function to fetch transactions for a specific device
export async function fetchDeviceTransactions(deviceId: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        student:student_id (name),
        vendor:vendor_id (name, type)
      `)
      .eq('device_id', deviceId)
      .order('transaction_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(`Error fetching transactions for device ${deviceId}:`, error);
      throw error;
    }

    return data as Transaction[];
  } catch (error) {
    console.error(`Error in fetchDeviceTransactions for device ${deviceId}:`, error);
    return [];
  }
}

// Function to fetch all transactions with pagination and filters
export async function fetchTransactions(
  page = 0,
  pageSize = 20,
  filters: {
    searchTerm?: string;
    type?: string;
    vendorType?: string;
  } = {}
) {
  try {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        student:student_id (name),
        vendor:vendor_id (name, type),
        device:device_id (serial_number),
        student!inner (
          name,
          school:school_id (name)
        )
      `, { count: 'exact' });

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    
    if (filters.vendorType && filters.vendorType !== 'all') {
      query = query.eq('vendor.type', filters.vendorType);
    }

    if (filters.searchTerm) {
      const term = `%${filters.searchTerm}%`;
      query = query.or(`student.name.ilike.${term},transaction_id.ilike.${term},vendor.name.ilike.${term},student.school.name.ilike.${term}`);
    }

    // Apply pagination
    const from = page * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await query
      .order('transaction_date', { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching transactions with filters:", error);
      throw error;
    }

    return { 
      data: data as Transaction[], 
      count: count || 0,
      currentPage: page,
      pageSize
    };
  } catch (error) {
    console.error("Error in fetchTransactions:", error);
    return { 
      data: [], 
      count: 0,
      currentPage: page,
      pageSize
    };
  }
}
