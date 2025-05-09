
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export type StudentBalance = {
  id: string;
  student_id: string;
  balance: number;
  last_topup_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Fetches the balance for a specific student
 */
export async function fetchStudentBalance(studentId: string): Promise<StudentBalance | null> {
  try {
    const { data, error } = await supabase
      .from('student_balances')
      .select('*')
      .eq('student_id', studentId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned, student has no balance record yet
        return {
          id: '', // Will be generated on creation
          student_id: studentId,
          balance: 0,
          last_topup_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      throw error;
    }
    
    return data as StudentBalance;
  } catch (error) {
    console.error(`Error fetching student balance for ${studentId}:`, error);
    // Return a default balance object with zero
    return {
      id: '', // Will be generated on creation
      student_id: studentId,
      balance: 0,
      last_topup_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

/**
 * Adds balance to a student and records a topup transaction
 */
export async function addStudentBalance(
  studentId: string, 
  amount: number, 
  paymentMethod: string = 'pix'
): Promise<StudentBalance> {
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('id, name, school_id, school:school_id(name)')
    .eq('id', studentId)
    .single();
  
  if (studentError) {
    throw new Error(`Estudante não encontrado: ${studentError.message}`);
  }

  // Start a transaction
  try {
    // Create a topup transaction
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        student_id: studentId,
        amount: amount,
        type: 'topup',
        status: 'completed',
        transaction_date: new Date().toISOString(),
        payment_method: paymentMethod,
        transaction_id: `TOPUP-${Date.now()}`,
        notes: `Recarga via ${paymentMethod}`
      })
      .select()
      .single();
    
    if (txError) {
      throw new Error(`Erro ao registrar transação: ${txError.message}`);
    }
    
    // The student_balance will be automatically updated via a database trigger
    // (See the update_student_balance function in the database functions)
    
    // Fetch the updated balance
    const updatedBalance = await fetchStudentBalance(studentId);
    if (!updatedBalance) {
      throw new Error("Erro ao atualizar saldo do estudante");
    }
    
    return updatedBalance;
  } catch (error: any) {
    console.error("Error adding student balance:", error);
    throw new Error(`Erro ao processar recarga: ${error.message}`);
  }
}

/**
 * React Query hook for fetching student balance
 */
export function useStudentBalance(studentId: string | undefined) {
  return useQuery<StudentBalance | null, Error>({
    queryKey: ['student-balance', studentId],
    queryFn: () => fetchStudentBalance(studentId as string),
    enabled: !!studentId,
    staleTime: 1000 * 60, // 1 minute
  });
}
