
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchSubscriptions, 
  fetchSubscriptionById, 
  createSubscription, 
  updateSubscription, 
  deleteSubscription,
  fetchSubscriptionBySchool,
  fetchSubscriptionStatistics,
  fetchPlans,
  Subscription
} from './api';

// Hook to fetch all subscriptions
export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: fetchSubscriptions
  });
};

// Hook to fetch subscription by school
export const useSubscriptionBySchool = (schoolId: string) => {
  return useQuery({
    queryKey: ['subscription', 'school', schoolId],
    queryFn: () => fetchSubscriptionBySchool(schoolId),
    enabled: !!schoolId
  });
};

// Hook to fetch a single subscription by ID
export const useSubscription = (id: string) => {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => fetchSubscriptionById(id),
    enabled: !!id
  });
};

// Hook to create a new subscription
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => createSubscription(subscription),
    onSuccess: (newSubscription) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      if (newSubscription.school_id) {
        queryClient.invalidateQueries({ queryKey: ['subscription', 'school', newSubscription.school_id] });
      }
    }
  });
};

// Hook to update an existing subscription
export const useUpdateSubscription = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<Subscription>) => updateSubscription(id, updates),
    onSuccess: (updatedSubscription) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
      if (updatedSubscription.school_id) {
        queryClient.invalidateQueries({ queryKey: ['subscription', 'school', updatedSubscription.school_id] });
      }
    }
  });
};

// Hook to delete a subscription
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    }
  });
};

// Hook to fetch all plans
export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans
  });
};

// Hook to fetch subscription statistics
export const useSubscriptionStatistics = () => {
  return useQuery({
    queryKey: ['subscription-statistics'],
    queryFn: fetchSubscriptionStatistics
  });
};
