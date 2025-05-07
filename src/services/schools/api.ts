
import { supabase } from "@/integrations/supabase/client";

export interface School {
  id: string;
  name: string;
  city?: string;
  state?: string;
  address?: string;
  zipcode?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  active: boolean;
  subscription_status?: string;
  subscription_plan?: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch all schools
export const fetchSchools = async (): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name');
    
    if (error) {
      console.error("Error fetching schools:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchSchools:", error);
    throw error;
  }
};

// Fetch a single school by ID
export const fetchSchoolById = async (id: string): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching school with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in fetchSchoolById for ${id}:`, error);
    throw error;
  }
};

// Create a new school
export const createSchool = async (school: Omit<School, 'id' | 'created_at' | 'updated_at'>): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .insert(school)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating school:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createSchool:", error);
    throw error;
  }
};

// Update an existing school
export const updateSchool = async (id: string, updates: Partial<School>): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating school with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in updateSchool for ${id}:`, error);
    throw error;
  }
};

// Delete a school
export const deleteSchool = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting school with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in deleteSchool for ${id}:`, error);
    throw error;
  }
};

// Fetch school statistics (count of active/inactive)
export const fetchSchoolStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('subscription_status');
    
    if (error) {
      console.error("Error fetching school statistics:", error);
      throw error;
    }
    
    const stats = {
      total: data.length,
      active: data.filter(s => s.subscription_status === 'active').length,
      inactive: data.filter(s => s.subscription_status !== 'active').length
    };
    
    return stats;
  } catch (error) {
    console.error("Error in fetchSchoolStatistics:", error);
    throw error;
  }
};
