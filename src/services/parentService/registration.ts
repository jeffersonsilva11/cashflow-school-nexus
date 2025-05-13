
import { createParent } from '@/services/parentService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Generate a random password
const generatePassword = (length = 8) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// Register a parent with automatic user creation and email credentials
export const registerParentWithCredentials = async (parentData: {
  name: string;
  email: string;
  phone?: string;
  document_id?: string;
  address?: string;
  schoolName: string;
  schoolId?: string;
}) => {
  try {
    // Generate random password
    const password = generatePassword();
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parentData.email,
      password: password,
      options: {
        data: {
          name: parentData.name,
          role: 'parent',
        }
      }
    });
    
    if (authError) {
      console.error("Error creating auth user:", authError);
      throw authError;
    }
    
    // Create parent record
    const userId = authData?.user?.id;
    if (!userId) {
      throw new Error("Failed to get user ID from auth response");
    }
    
    const parent = await createParent({
      name: parentData.name,
      email: parentData.email,
      phone: parentData.phone,
      document_id: parentData.document_id,
      address: parentData.address,
      user_id: userId
    });
    
    // Send email with credentials
    const emailResponse = await fetch('/api/send-parent-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: parentData.name,
        email: parentData.email,
        password: password,
        schoolName: parentData.schoolName
      })
    });
    
    if (!emailResponse.ok) {
      console.warn("Failed to send credentials email, but parent was created");
    }
    
    return parent;
  } catch (error: any) {
    console.error("Error in registerParentWithCredentials:", error);
    toast({ 
      title: "Erro ao registrar responsável", 
      description: error.message || "Ocorreu um erro ao criar o cadastro",
      variant: "destructive" 
    });
    throw error;
  }
};
