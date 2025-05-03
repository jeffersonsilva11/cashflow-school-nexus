
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Define types
export type Subscription = {
  id: string;
  subscription_id: string;
  school_id: string;
  plan_id: string;
  start_date: string;
  current_period_start: string;
  current_period_end: string;
  monthly_fee: number;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  payment_method?: string;
  auto_renew?: boolean;
  created_at?: string;
  updated_at?: string;
  // Include these when using joins
  school?: { 
    name: string;
    subscription_plan?: string; 
  };
  plan?: {
    name: string;
    price_per_student: number;
  };
};

// Fetch all subscriptions
export async function fetchSubscriptions() {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        school:school_id (name, subscription_plan),
        plan:plan_id (name, price_per_student)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Subscription[];
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw error;
  }
}

// Fetch subscriptions for a specific school
export async function fetchSchoolSubscriptions(schoolId: string) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:plan_id (name, price_per_student)
      `)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Subscription[];
  } catch (error) {
    console.error(`Error fetching subscriptions for school ${schoolId}:`, error);
    throw error;
  }
}

// Fetch a single subscription
export async function fetchSubscriptionById(id: string) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        school:school_id (name, subscription_plan),
        plan:plan_id (name, price_per_student)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Subscription;
  } catch (error) {
    console.error(`Error fetching subscription ${id}:`, error);
    throw error;
  }
}

// Create a new subscription
export async function createSubscription(subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'school' | 'plan'>) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();
    
    if (error) throw error;
    return data as Subscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

// Update a subscription
export async function updateSubscription(id: string, updates: Partial<Omit<Subscription, 'school' | 'plan'>>) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Subscription;
  } catch (error) {
    console.error(`Error updating subscription ${id}:`, error);
    throw error;
  }
}

// Delete a subscription
export async function deleteSubscription(id: string) {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting subscription ${id}:`, error);
    throw error;
  }
}

// React Query Hooks
export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: fetchSubscriptions,
  });
}

export function useSchoolSubscriptions(schoolId: string | undefined) {
  return useQuery({
    queryKey: ['subscriptions', 'school', schoolId],
    queryFn: () => fetchSchoolSubscriptions(schoolId as string),
    enabled: !!schoolId,
  });
}

export function useSubscription(id: string | undefined) {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => fetchSubscriptionById(id as string),
    enabled: !!id,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSubscription,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'school', data.school_id] });
      toast({ title: "Assinatura criada com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar assinatura", 
        description: error.message || "Ocorreu um erro ao criar a assinatura",
        variant: "destructive" 
      });
    }
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Omit<Subscription, 'school' | 'plan'>> }) => 
      updateSubscription(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', data.id] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'school', data.school_id] });
      toast({ title: "Assinatura atualizada com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar assinatura", 
        description: error.message || "Ocorreu um erro ao atualizar a assinatura",
        variant: "destructive" 
      });
    }
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({ title: "Assinatura removida com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao remover assinatura", 
        description: error.message || "Ocorreu um erro ao remover a assinatura",
        variant: "destructive" 
      });
    }
  });
}
