
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "./transactionService";

/**
 * Fetches transactions for a specific student
 */
export async function fetchStudentTransactions(
  studentId: string,
  limit: number = 10
): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        vendor:vendor_id (
          name,
          type
        )
      `)
      .eq('student_id', studentId)
      .order('transaction_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data as Transaction[];
  } catch (error) {
    console.error(`Error fetching transactions for student ${studentId}:`, error);
    return [];
  }
}

/**
 * React Query hook for fetching student transactions
 */
export function useStudentTransactions(studentId: string | undefined, limit: number = 10) {
  return useQuery<Transaction[], Error>({
    queryKey: ['student-transactions', studentId, limit],
    queryFn: () => fetchStudentTransactions(studentId as string, limit),
    enabled: !!studentId,
    staleTime: 1000 * 60, // 1 minute
  });
}
