
import { supabase } from "@/integrations/supabase/client";

export interface Vendor {
  id: string;
  name: string;
  type: 'own' | 'third_party';
  location?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  active?: boolean;
  commission_rate?: number;
  school_id?: string;
  school?: {
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface VendorFinancials {
  id: string;
  vendor_id: string;
  balance: number;
  pending_transfer: number;
  last_transfer_date?: string;
  next_transfer_date?: string;
  transfer_frequency?: string;
  payment_method?: string;
  payment_details?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface CommissionTier {
  id: string;
  vendor_id: string;
  min_sales_amount: number;
  max_sales_amount?: number;
  commission_rate: number;
  created_at?: string;
  updated_at?: string;
}

export interface VendorProduct {
  id: string;
  vendor_id: string;
  name: string;
  description?: string;
  price: number;
  active?: boolean;
  category?: string;
  allergens?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SalesReport {
  id: string;
  vendor_id: string;
  reporting_period: string;
  start_date: string;
  end_date: string;
  total_sales: number;
  total_transactions: number;
  commission_amount: number;
  net_amount: number;
  report_generated_at?: string;
  report_status?: string;
  report_data?: Record<string, any>;
}

export interface VendorTransfer {
  id: string;
  vendor_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transfer_date?: string;
  payment_method?: string;
  payment_details?: Record<string, any>;
  reference_period_start?: string;
  reference_period_end?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Function to fetch third-party vendors
export const fetchVendors = async (type?: 'own' | 'third_party') => {
  try {
    let query = supabase
      .from('vendors')
      .select(`
        *,
        school:school_id (name)
      `);
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching vendors:", error);
      throw error;
    }
    
    return data as Vendor[];
  } catch (error) {
    console.error("Error in fetchVendors:", error);
    return [];
  }
};

// Function to fetch a specific vendor
export const fetchVendor = async (vendorId: string) => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select(`
        *,
        school:school_id (name)
      `)
      .eq('id', vendorId)
      .single();
    
    if (error) {
      console.error(`Error fetching vendor ${vendorId}:`, error);
      throw error;
    }
    
    return data as Vendor;
  } catch (error) {
    console.error(`Error in fetchVendor for ${vendorId}:`, error);
    return null;
  }
};

// Function to fetch vendor financials
export const fetchVendorFinancials = async (vendorId: string) => {
  try {
    const { data, error } = await supabase
      .from('vendors_financials')
      .select('*')
      .eq('vendor_id', vendorId)
      .single();
    
    if (error) {
      console.error(`Error fetching financials for vendor ${vendorId}:`, error);
      throw error;
    }
    
    return data as VendorFinancials;
  } catch (error) {
    console.error(`Error in fetchVendorFinancials for ${vendorId}:`, error);
    return null;
  }
};

// Function to fetch commission tiers for a vendor
export const fetchCommissionTiers = async (vendorId: string) => {
  try {
    const { data, error } = await supabase
      .from('vendor_commission_tiers')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('min_sales_amount', { ascending: true });
    
    if (error) {
      console.error(`Error fetching commission tiers for vendor ${vendorId}:`, error);
      throw error;
    }
    
    return data as CommissionTier[];
  } catch (error) {
    console.error(`Error in fetchCommissionTiers for ${vendorId}:`, error);
    return [];
  }
};

// Function to fetch products for a vendor
export const fetchVendorProducts = async (vendorId: string) => {
  try {
    const { data, error } = await supabase
      .from('vendor_products')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('name', { ascending: true });
    
    if (error) {
      console.error(`Error fetching products for vendor ${vendorId}:`, error);
      throw error;
    }
    
    return data as VendorProduct[];
  } catch (error) {
    console.error(`Error in fetchVendorProducts for ${vendorId}:`, error);
    return [];
  }
};

// Function to fetch sales reports for a vendor
export const fetchSalesReports = async (vendorId: string, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('vendor_sales_reports')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('start_date', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error(`Error fetching sales reports for vendor ${vendorId}:`, error);
      throw error;
    }
    
    return data as SalesReport[];
  } catch (error) {
    console.error(`Error in fetchSalesReports for ${vendorId}:`, error);
    return [];
  }
};

// Function to fetch transfers for a vendor
export const fetchVendorTransfers = async (vendorId: string, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('vendor_transfers')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('transfer_date', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error(`Error fetching transfers for vendor ${vendorId}:`, error);
      throw error;
    }
    
    return data as VendorTransfer[];
  } catch (error) {
    console.error(`Error in fetchVendorTransfers for ${vendorId}:`, error);
    return [];
  }
};

// Function to create or update commission tiers
export const updateCommissionTier = async (tier: Partial<CommissionTier>) => {
  try {
    const { data, error } = await supabase
      .from('vendor_commission_tiers')
      .upsert(tier)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating commission tier:", error);
      throw error;
    }
    
    return data as CommissionTier;
  } catch (error) {
    console.error("Error in updateCommissionTier:", error);
    throw error;
  }
};

// Function to create or update vendor product
export const updateVendorProduct = async (product: Partial<VendorProduct>) => {
  try {
    const { data, error } = await supabase
      .from('vendor_products')
      .upsert(product)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating vendor product:", error);
      throw error;
    }
    
    return data as VendorProduct;
  } catch (error) {
    console.error("Error in updateVendorProduct:", error);
    throw error;
  }
};

// Function to create a transfer for a vendor
export const createVendorTransfer = async (transfer: Omit<VendorTransfer, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('vendor_transfers')
      .insert(transfer)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating vendor transfer:", error);
      throw error;
    }
    
    return data as VendorTransfer;
  } catch (error) {
    console.error("Error in createVendorTransfer:", error);
    throw error;
  }
};

// Function to update vendor financials
export const updateVendorFinancials = async (financials: Partial<VendorFinancials>) => {
  try {
    const { data, error } = await supabase
      .from('vendors_financials')
      .upsert(financials)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating vendor financials:", error);
      throw error;
    }
    
    return data as VendorFinancials;
  } catch (error) {
    console.error("Error in updateVendorFinancials:", error);
    throw error;
  }
};
