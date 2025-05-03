
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

// Define user profile type
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  school_id?: string;
  created_at?: string;
  updated_at?: string;
  school?: {
    name: string;
  };
};

// Fetch all user profiles
export async function fetchUserProfiles() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        school:school_id (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as UserProfile[];
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    throw error;
  }
}

// Fetch a single user profile by ID
export async function fetchUserProfileById(id: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        school:school_id (name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    console.error(`Error fetching user profile ${id}:`, error);
    throw error;
  }
}

// Update a user profile
export async function updateUserProfile(id: string, updates: Partial<UserProfile>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    console.error(`Error updating user profile ${id}:`, error);
    throw error;
  }
}

// React Query hooks
export function useUserProfiles() {
  return useQuery({
    queryKey: ['userProfiles'],
    queryFn: fetchUserProfiles,
  });
}

export function useUserProfile(id: string | undefined) {
  return useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => fetchUserProfileById(id as string),
    enabled: !!id,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<UserProfile> }) => 
      updateUserProfile(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', data.id] });
      toast({ title: "Perfil atualizado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao atualizar perfil", 
        description: error.message || "Ocorreu um erro ao atualizar o perfil",
        variant: "destructive" 
      });
    }
  });
}
