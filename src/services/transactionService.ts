
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
    school?: {
      name: string;
    };
  };
  vendor?: {
    name: string;
    type: string;
  };
  device?: {
    serial_number: string;
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
        student:student_id (
          name,
          school:school_id (name)
        ),
        vendor:vendor_id (name, type),
        device:device_id (serial_number)
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
    startDate?: string;
    endDate?: string;
  } = {}
) {
  try {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        student:student_id (
          name,
          school:school_id (name)
        ),
        vendor:vendor_id (name, type),
        device:device_id (serial_number)
      `, { count: 'exact' });

    // Apply date range filter
    if (filters.startDate) {
      query = query.gte('transaction_date', filters.startDate);
    }
    
    if (filters.endDate) {
      // Add one day to include the end date fully
      const endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1);
      query = query.lt('transaction_date', endDate.toISOString());
    }

    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    
    // Apply vendor type filter
    if (filters.vendorType && filters.vendorType !== 'all') {
      // This requires a join, so we need to modify our approach
      // We'll get all matching vendor IDs first and then filter transactions
      if (filters.vendorType) {
        const { data: vendorIds } = await supabase
          .from('vendors')
          .select('id')
          .eq('type', filters.vendorType);
        
        if (vendorIds && vendorIds.length > 0) {
          const ids = vendorIds.map(v => v.id);
          query = query.in('vendor_id', ids);
        } else {
          // No vendors match the filter, return empty result
          return { 
            data: [], 
            count: 0,
            currentPage: page,
            pageSize
          };
        }
      }
    }

    // Apply search filter
    if (filters.searchTerm) {
      // We need a more complex approach for searching related tables
      // First, find student IDs that match the search term
      const { data: studentMatches } = await supabase
        .from('students')
        .select('id')
        .ilike('name', `%${filters.searchTerm}%`);
      
      // Find vendor IDs that match the search term
      const { data: vendorMatches } = await supabase
        .from('vendors')
        .select('id')
        .ilike('name', `%${filters.searchTerm}%`);
      
      // Find device IDs that match the search term
      const { data: deviceMatches } = await supabase
        .from('devices')
        .select('id')
        .ilike('serial_number', `%${filters.searchTerm}%`);
      
      // Build OR conditions for the search
      const searchConditions = [];
      
      // Transaction ID search
      searchConditions.push(`transaction_id.ilike.%${filters.searchTerm}%`);
      
      // Student ID filter
      if (studentMatches && studentMatches.length > 0) {
        const studentIds = studentMatches.map(s => s.id);
        searchConditions.push(`student_id.in.(${studentIds.join(',')})`);
      }
      
      // Vendor ID filter
      if (vendorMatches && vendorMatches.length > 0) {
        const vendorIds = vendorMatches.map(v => v.id);
        searchConditions.push(`vendor_id.in.(${vendorIds.join(',')})`);
      }
      
      // Device ID filter
      if (deviceMatches && deviceMatches.length > 0) {
        const deviceIds = deviceMatches.map(d => d.id);
        searchConditions.push(`device_id.in.(${deviceIds.join(',')})`);
      }
      
      // Apply OR filter if we have any conditions
      if (searchConditions.length > 0) {
        query = query.or(searchConditions.join(','));
      }
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

// Create a transaction
export async function createTransaction(transaction: Omit<Transaction, 'id'>) {
  try {
    // Convert Date objects to ISO strings if present
    const formattedTransaction = {
      ...transaction,
      transaction_date: transaction.transaction_date instanceof Date 
        ? transaction.transaction_date.toISOString() 
        : transaction.transaction_date
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(formattedTransaction)
      .select()
      .single();
    
    if (error) throw error;
    return data as Transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

// React Query hooks
export function useRecentTransactions(limit = 10) {
  return useQuery({
    queryKey: ['transactions', 'recent', limit],
    queryFn: () => fetchRecentTransactions(limit),
  });
}

export function useDeviceTransactions(deviceId: string | undefined, limit = 10) {
  return useQuery({
    queryKey: ['transactions', 'device', deviceId, limit],
    queryFn: () => fetchDeviceTransactions(deviceId as string, limit),
    enabled: !!deviceId,
  });
}

export function useTransactions(
  page = 0,
  pageSize = 20,
  filters: {
    searchTerm?: string;
    type?: string;
    vendorType?: string;
    startDate?: string;
    endDate?: string;
  } = {}
) {
  return useQuery({
    queryKey: ['transactions', 'all', page, pageSize, filters],
    queryFn: () => fetchTransactions(page, pageSize, filters),
  });
}
