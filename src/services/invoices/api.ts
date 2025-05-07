
import { supabase } from "@/integrations/supabase/client";

export interface Invoice {
  id: string;
  invoice_id: string;
  school_id: string;
  amount: number;
  status: string; // "pending", "paid", "overdue", "cancelled"
  issued_date: string;
  due_date: string;
  paid_date?: string | null;
  items?: any | null; // Changed from any[] to any to accommodate Json type from Supabase
  subscription_id?: string | null;
  created_at?: string;
  updated_at?: string;
  payment_method?: string | null;
  schools?: { name: string } | null;
}

// Fetch all invoices
export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, schools:school_id (name)')
      .order('issued_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
    
    return data as Invoice[];
  } catch (error) {
    console.error("Error in fetchInvoices:", error);
    throw error;
  }
};

// Fetch invoices by school ID
export const fetchInvoicesBySchool = async (schoolId: string): Promise<Invoice[]> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('school_id', schoolId)
      .order('issued_date', { ascending: false });
    
    if (error) {
      console.error(`Error fetching invoices for school ${schoolId}:`, error);
      throw error;
    }
    
    return data as Invoice[];
  } catch (error) {
    console.error(`Error in fetchInvoicesBySchool for ${schoolId}:`, error);
    throw error;
  }
};

// Fetch a single invoice by ID
export const fetchInvoiceById = async (id: string): Promise<Invoice | null> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, schools:school_id (name)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching invoice with ID ${id}:`, error);
      throw error;
    }
    
    return data as Invoice;
  } catch (error) {
    console.error(`Error in fetchInvoiceById for ${id}:`, error);
    throw error;
  }
};

// Create a new invoice
export const createInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
    
    return data as Invoice;
  } catch (error) {
    console.error("Error in createInvoice:", error);
    throw error;
  }
};

// Update an existing invoice
export const updateInvoice = async (id: string, updates: Partial<Invoice>): Promise<Invoice> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating invoice with ID ${id}:`, error);
      throw error;
    }
    
    return data as Invoice;
  } catch (error) {
    console.error(`Error in updateInvoice for ${id}:`, error);
    throw error;
  }
};

// Delete an invoice
export const deleteInvoice = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting invoice with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in deleteInvoice for ${id}:`, error);
    throw error;
  }
};

// Fetch invoice statistics
export const fetchInvoiceStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('status, amount');
    
    if (error) {
      console.error("Error fetching invoice statistics:", error);
      throw error;
    }
    
    const stats = {
      total: data.length,
      totalAmount: data.reduce((sum, invoice) => sum + invoice.amount, 0),
      paid: data.filter(i => i.status === 'paid').length,
      pending: data.filter(i => i.status === 'pending').length,
      overdue: data.filter(i => i.status === 'overdue').length,
      paidAmount: data.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0),
      pendingAmount: data.filter(i => i.status === 'pending').reduce((sum, invoice) => sum + invoice.amount, 0),
      overdueAmount: data.filter(i => i.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0)
    };
    
    return stats;
  } catch (error) {
    console.error("Error in fetchInvoiceStatistics:", error);
    throw error;
  }
};
