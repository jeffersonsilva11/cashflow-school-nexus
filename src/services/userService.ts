
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
  } | null;
};

// Fetch all user profiles
export async function fetchUserProfiles() {
  try {
    // First, fetch profiles without the school join
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform the data and handle schools separately if needed
    const transformedData = data.map(profile => {
      return {
        ...profile,
        school: null // Default to null
      };
    }) as UserProfile[];
    
    // For profiles with school_id, try to fetch the school names
    const profilesWithSchoolId = transformedData.filter(profile => profile.school_id);
    
    if (profilesWithSchoolId.length > 0) {
      // Get unique school IDs
      const schoolIds = [...new Set(profilesWithSchoolId.map(profile => profile.school_id))];
      
      // Fetch schools data
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('id, name')
        .in('id', schoolIds);
      
      if (!schoolsError && schoolsData) {
        // Create a map for quick school lookup
        const schoolsMap = new Map(schoolsData.map(school => [school.id, school]));
        
        // Update profiles with school data
        transformedData.forEach(profile => {
          if (profile.school_id && schoolsMap.has(profile.school_id)) {
            profile.school = { name: schoolsMap.get(profile.school_id)!.name };
          }
        });
      } else {
        console.error("Error fetching schools:", schoolsError);
      }
    }
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    throw error;
  }
}

// Fetch a single user profile by ID
export async function fetchUserProfileById(id: string) {
  try {
    // Fetch the profile first
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Initialize result with profile data
    const result: UserProfile = {
      ...profile,
      school: null
    };
    
    // If profile has a school_id, fetch the school
    if (profile.school_id) {
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('name')
        .eq('id', profile.school_id)
        .single();
      
      if (!schoolError && schoolData) {
        result.school = { name: schoolData.name };
      } else {
        console.error(`Error fetching school for profile ${id}:`, schoolError);
      }
    }
    
    return result;
  } catch (error) {
    console.error(`Error fetching user profile ${id}:`, error);
    throw error;
  }
}

// Update a user profile
export async function updateUserProfile(id: string, updates: Partial<UserProfile>) {
  try {
    // Remove the school property if it exists in the updates
    // as we cannot update a joined field directly
    const { school, ...updatableFields } = updates;
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updatableFields)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { ...data, school: null } as UserProfile;
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
