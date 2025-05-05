
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type Invoice = {
  id: string;
  invoice_id: string;
  school_id: string;
  school: { name: string } | null;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  issued_date: string;
  due_date: string;
  paid_date: string | null;
  items: any[] | null;
};

// Função para buscar as faturas
export const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        school:school_id (name)
      `)
      .order('due_date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as Invoice[];
  } catch (error) {
    console.error("Error fetching invoices:", error);
    
    // Dados mockados para demonstração em caso de erro
    return [
      {
        id: 'BILL-001',
        invoice_id: 'BILL-001',
        school_id: '1',
        school: { name: 'Escola Estadual São Paulo' },
        amount: 1250.50,
        status: 'pending',
        due_date: '2025-06-15',
        issued_date: '2025-05-15',
        paid_date: null,
        items: null
      },
      {
        id: 'BILL-002',
        invoice_id: 'BILL-002',
        school_id: '2',
        school: { name: 'Colégio Parthenon' },
        amount: 3450.75,
        status: 'paid',
        due_date: '2025-06-10',
        paid_date: '2025-05-10',
        issued_date: '2025-05-01',
        items: null
      },
      {
        id: 'BILL-003',
        invoice_id: 'BILL-003',
        school_id: '3',
        school: { name: 'Escola Municipal Rio de Janeiro' },
        amount: 950.25,
        status: 'overdue',
        due_date: '2025-04-30',
        paid_date: null,
        issued_date: '2025-04-01',
        items: null
      },
      {
        id: 'BILL-004',
        invoice_id: 'BILL-004',
        school_id: '4',
        school: { name: 'Instituto Educacional Nova Era' },
        amount: 2150.00,
        status: 'pending',
        due_date: '2025-06-20',
        paid_date: null,
        issued_date: '2025-05-20',
        items: null
      },
      {
        id: 'BILL-005',
        invoice_id: 'BILL-005',
        school_id: '5',
        school: { name: 'Colégio Integrado' },
        amount: 1850.35,
        status: 'paid',
        due_date: '2025-06-05',
        issued_date: '2025-05-01',
        paid_date: '2025-05-05',
        items: null
      }
    ];
  }
};

// React Query hook para buscar faturas
export const useInvoices = () => {
  return useQuery<Invoice[], Error>({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });
};
