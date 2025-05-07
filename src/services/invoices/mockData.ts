
import { Invoice } from './api';

export const generateMockInvoices = (): Invoice[] => {
  const statuses = ['pending', 'paid', 'overdue', 'cancelled'];
  const paymentMethods = ['PIX', 'Credit Card', 'Bank Transfer', null];
  const schools = ['Escola São Paulo', 'Colégio Santa Maria', 'Instituto Educar', 'Escola Criativa'];
  
  return Array(10).fill(null).map((_, i) => {
    const now = new Date();
    const issuedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - Math.floor(Math.random() * 60));
    const dueDate = new Date(issuedDate);
    dueDate.setDate(dueDate.getDate() + 30);
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paidDate = status === 'paid' ? new Date(dueDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 15) : null;
    
    return {
      id: `inv-${i + 1}`,
      invoice_id: `INV-${2023}-${1000 + i}`,
      school_id: `school-${i % 4 + 1}`,
      amount: 1000 + Math.floor(Math.random() * 9000),
      status,
      issued_date: issuedDate.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      paid_date: paidDate ? paidDate.toISOString().split('T')[0] : null,
      items: [{ description: 'Monthly subscription', amount: 1000 }],
      subscription_id: `sub-${i % 4 + 1}`,
      created_at: issuedDate.toISOString(),
      updated_at: issuedDate.toISOString(),
      payment_method: status === 'paid' ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : null,
      schools: { name: schools[i % 4] }
    };
  });
};
