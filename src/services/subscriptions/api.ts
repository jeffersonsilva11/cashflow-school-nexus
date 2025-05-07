
import { supabase } from "@/integrations/supabase/client";

export interface Subscription {
  id: string;
  subscription_id: string;
  school_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  current_period_start: string;
  current_period_end: string;
  monthly_fee: number;
  payment_method?: string;
  auto_renew?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Fetch all subscriptions
export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, schools(name), plans(name)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching subscriptions:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchSubscriptions:", error);
    throw error;
  }
};

// Fetch subscription by school ID
export const fetchSubscriptionBySchool = async (schoolId: string): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, plans(name)')
      .eq('school_id', schoolId)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching subscription for school ${schoolId}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in fetchSubscriptionBySchool for ${schoolId}:`, error);
    throw error;
  }
};

// Fetch a single subscription by ID
export const fetchSubscriptionById = async (id: string): Promise<Subscription | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, schools(name), plans(name)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching subscription with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in fetchSubscriptionById for ${id}:`, error);
    throw error;
  }
};

// Create a new subscription
export const createSubscription = async (subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>): Promise<Subscription> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createSubscription:", error);
    throw error;
  }
};

// Update an existing subscription
export const updateSubscription = async (id: string, updates: Partial<Subscription>): Promise<Subscription> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating subscription with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in updateSubscription for ${id}:`, error);
    throw error;
  }
};

// Delete a subscription
export const deleteSubscription = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting subscription with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in deleteSubscription for ${id}:`, error);
    throw error;
  }
};

// Fetch all plans
export const fetchPlans = async () => {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price_per_student');
    
    if (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchPlans:", error);
    throw error;
  }
};

// Fetch subscription statistics
export const fetchSubscriptionStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status, monthly_fee');
    
    if (error) {
      console.error("Error fetching subscription statistics:", error);
      throw error;
    }
    
    const stats = {
      total: data.length,
      active: data.filter(s => s.status === 'active').length,
      totalMontlyRevenue: data.filter(s => s.status === 'active').reduce((sum, sub) => sum + sub.monthly_fee, 0),
      inactive: data.filter(s => s.status !== 'active').length,
    };
    
    return stats;
  } catch (error) {
    console.error("Error in fetchSubscriptionStatistics:", error);
    throw error;
  }
};
