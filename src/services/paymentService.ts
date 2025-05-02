
// Tipos para pagamentos
export type PaymentMethod = 'credit_card' | 'bank_slip' | 'pix';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'canceled';

export interface PaymentInfo {
  id: string;
  amount: number;
  description: string;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
  paidAt?: string;
  dueDate?: string;
  studentId?: string;
  studentName?: string;
  parentId?: string;
  parentName?: string;
  schoolId?: string;
  schoolName?: string;
  metadata?: Record<string, any>;
}

export interface CreatePaymentData {
  amount: number;
  description: string;
  method: PaymentMethod;
  dueDate?: string;
  studentId?: string;
  studentName?: string;
  parentId?: string;
  parentName?: string;
  schoolId?: string;
  schoolName?: string;
  metadata?: Record<string, any>;
}

// Simula um gateway de pagamentos
class PaymentService {
  private payments: PaymentInfo[] = [];

  // Cria um novo pagamento
  async createPayment(data: CreatePaymentData): Promise<PaymentInfo> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const id = `PMT${Math.floor(10000 + Math.random() * 90000)}`;
    
    const payment: PaymentInfo = {
      id,
      amount: data.amount,
      description: data.description,
      status: 'pending',
      method: data.method,
      createdAt: new Date().toISOString(),
      dueDate: data.dueDate,
      studentId: data.studentId,
      studentName: data.studentName,
      parentId: data.parentId,
      parentName: data.parentName,
      schoolId: data.schoolId,
      schoolName: data.schoolName,
      metadata: data.metadata,
    };
    
    this.payments.push(payment);
    return payment;
  }

  // Processa um pagamento (simula pagamento bem-sucedido)
  async processPayment(paymentId: string): Promise<PaymentInfo> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const payment = this.payments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error(`Payment with ID ${paymentId} not found`);
    }
    
    // Simula 90% de sucesso e 10% de falha
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      payment.status = 'paid';
      payment.paidAt = new Date().toISOString();
    } else {
      payment.status = 'failed';
    }
    
    return payment;
  }

  // Cancela um pagamento
  async cancelPayment(paymentId: string): Promise<PaymentInfo> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const payment = this.payments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error(`Payment with ID ${paymentId} not found`);
    }
    
    if (payment.status !== 'pending') {
      throw new Error(`Cannot cancel payment with status: ${payment.status}`);
    }
    
    payment.status = 'canceled';
    return payment;
  }

  // Reembolsa um pagamento
  async refundPayment(paymentId: string): Promise<PaymentInfo> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const payment = this.payments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error(`Payment with ID ${paymentId} not found`);
    }
    
    if (payment.status !== 'paid') {
      throw new Error(`Cannot refund payment with status: ${payment.status}`);
    }
    
    payment.status = 'refunded';
    return payment;
  }

  // Obtém um pagamento pelo ID
  async getPayment(paymentId: string): Promise<PaymentInfo | null> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const payment = this.payments.find(p => p.id === paymentId);
    return payment || null;
  }

  // Lista pagamentos com filtragem simples
  async listPayments(filters?: {
    status?: PaymentStatus;
    method?: PaymentMethod;
    studentId?: string;
    parentId?: string;
    schoolId?: string;
  }): Promise<PaymentInfo[]> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!filters) return this.payments;
    
    return this.payments.filter(payment => {
      if (filters.status && payment.status !== filters.status) return false;
      if (filters.method && payment.method !== filters.method) return false;
      if (filters.studentId && payment.studentId !== filters.studentId) return false;
      if (filters.parentId && payment.parentId !== filters.parentId) return false;
      if (filters.schoolId && payment.schoolId !== filters.schoolId) return false;
      return true;
    });
  }
  
  // Adiciona alguns pagamentos mockados para demonstração
  seedMockPayments() {
    const mockPayments: PaymentInfo[] = [
      {
        id: 'PMT12345',
        amount: 12990,
        description: 'Mensalidade Maio 2025 - Plano Premium',
        status: 'paid',
        method: 'credit_card',
        createdAt: '2025-05-01T08:15:00Z',
        paidAt: '2025-05-01T08:17:30Z',
        schoolId: 'SCH001',
        schoolName: 'Colégio São Paulo'
      },
      {
        id: 'PMT12346',
        amount: 8990,
        description: 'Mensalidade Maio 2025 - Plano Básico',
        status: 'pending',
        method: 'bank_slip',
        createdAt: '2025-05-01T10:20:00Z',
        dueDate: '2025-05-10T23:59:59Z',
        schoolId: 'SCH002',
        schoolName: 'Escola Maria Eduarda'
      },
      {
        id: 'PMT12347',
        amount: 5000,
        description: 'Recarga Cantina',
        status: 'paid',
        method: 'pix',
        createdAt: '2025-05-02T09:10:00Z',
        paidAt: '2025-05-02T09:10:30Z',
        studentId: 'STD001',
        studentName: 'Lucas Silva',
        parentId: 'PAR001',
        parentName: 'José Silva'
      },
      {
        id: 'PMT12348',
        amount: 3500,
        description: 'Recarga Cantina',
        status: 'failed',
        method: 'credit_card',
        createdAt: '2025-05-02T14:30:00Z',
        studentId: 'STD002',
        studentName: 'Maria Oliveira',
        parentId: 'PAR002',
        parentName: 'Ana Oliveira'
      },
      {
        id: 'PMT12349',
        amount: 15990,
        description: 'Mensalidade Maio 2025 - Plano Enterprise',
        status: 'paid',
        method: 'credit_card',
        createdAt: '2025-04-28T11:45:00Z',
        paidAt: '2025-04-28T11:47:20Z',
        schoolId: 'SCH003',
        schoolName: 'Colégio São Pedro'
      }
    ];
    
    this.payments = [...mockPayments, ...this.payments];
  }
}

// Exporta uma instância única do serviço
export const paymentService = new PaymentService();

// Adiciona dados mockados para demonstração
paymentService.seedMockPayments();
