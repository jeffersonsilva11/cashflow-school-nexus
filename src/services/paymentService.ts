// Tipos para pagamentos
export type PaymentMethod = 'credit_card' | 'bank_slip' | 'pix' | 'student_card' | 'student_wristband';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'canceled';
export type VendorType = 'own' | 'third_party';

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
  vendorId?: string;
  vendorName?: string;
  vendorType?: VendorType;
  terminalId?: string;
  deviceId?: string; // ID da pulseira/cartão do estudante
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
  vendorId?: string;
  vendorName?: string;
  vendorType?: VendorType;
  terminalId?: string;
  deviceId?: string;
  metadata?: Record<string, any>;
}

// Configuração para integração com Stripe (simulada)
// Usando import.meta.env ao invés de process.env para compatibilidade com Vite
const stripeConfig = {
  apiKey: import.meta.env.VITE_STRIPE_API_KEY || 'sk_test_simulado', // Em produção, usar variável de ambiente
  apiVersion: '2023-10-16',
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || 'whsec_simulado',
};

// Simula um gateway de pagamentos
class PaymentService {
  private payments: PaymentInfo[] = [];

  // Cria um novo pagamento
  async createPayment(data: CreatePaymentData): Promise<PaymentInfo> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const id = `PMT${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Em um ambiente real, enviaríamos os dados para o Stripe
    // Exemplo de como ficaria a integração real comentada abaixo
    /*
    const stripe = new Stripe(stripeConfig.apiKey, {
      apiVersion: stripeConfig.apiVersion as any,
    });
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: 'brl',
      description: data.description,
      metadata: {
        studentId: data.studentId,
        schoolId: data.schoolId,
        parentId: data.parentId,
      },
      payment_method_types: this.mapPaymentMethodToStripe(data.method),
    });
    
    // Usar o ID do Stripe
    // id = paymentIntent.id;
    */
    
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
    
    // Em um ambiente real, confirmaríamos o pagamento no Stripe
    /*
    const stripe = new Stripe(stripeConfig.apiKey, {
      apiVersion: stripeConfig.apiVersion as any,
    });
    
    // Confirmar o pagamento
    const paymentIntent = await stripe.paymentIntents.confirm(paymentId, {
      payment_method: 'pm_card_visa', // Na prática, viria do frontend
    });
    
    const isSuccess = paymentIntent.status === 'succeeded';
    */
    
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
    
    // Em um ambiente real, cancelaríamos o pagamento no Stripe
    /*
    const stripe = new Stripe(stripeConfig.apiKey, {
      apiVersion: stripeConfig.apiVersion as any,
    });
    
    await stripe.paymentIntents.cancel(paymentId);
    */
    
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
    
    // Em um ambiente real, reembolsaríamos o pagamento no Stripe
    /*
    const stripe = new Stripe(stripeConfig.apiKey, {
      apiVersion: stripeConfig.apiVersion as any,
    });
    
    await stripe.refunds.create({
      payment_intent: paymentId,
    });
    */
    
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

  // Processa um pagamento de cantina via dispositivo estudantil
  async processCanteenPayment(data: {
    studentId: string;
    studentName: string;
    deviceId: string;
    amount: number;
    vendorId: string;
    vendorName: string;
    vendorType: VendorType;
    terminalId: string;
    schoolId: string;
    schoolName: string;
  }): Promise<PaymentInfo> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const id = `CNT${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Aqui teríamos integração com gateway de pagamento da Stone
    // para registrar a transação no sistema deles
    
    const payment: PaymentInfo = {
      id,
      amount: data.amount,
      description: `Compra na cantina ${data.vendorName}`,
      status: 'paid',
      method: 'student_wristband',
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      studentId: data.studentId,
      studentName: data.studentName,
      schoolId: data.schoolId,
      schoolName: data.schoolName,
      vendorId: data.vendorId,
      vendorName: data.vendorName,
      vendorType: data.vendorType,
      terminalId: data.terminalId,
      deviceId: data.deviceId,
      metadata: {
        transactionType: 'canteen_purchase',
        terminalProvider: 'Stone',
      },
    };
    
    this.payments.push(payment);
    return payment;
  }

  // Método para obter pagamentos de cantina por vendedor
  async getPaymentsByVendor(vendorId: string): Promise<PaymentInfo[]> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return this.payments.filter(p => p.vendorId === vendorId);
  }

  // Método para obter pagamentos feitos por um dispositivo específico
  async getPaymentsByDevice(deviceId: string): Promise<PaymentInfo[]> {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return this.payments.filter(p => p.deviceId === deviceId);
  }

  // Lista pagamentos com filtragem por tipo de vendedor
  async listPayments(filters?: {
    status?: PaymentStatus;
    method?: PaymentMethod;
    studentId?: string;
    parentId?: string;
    schoolId?: string;
    vendorId?: string;
    vendorType?: VendorType;
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
      if (filters.vendorId && payment.vendorId !== filters.vendorId) return false;
      if (filters.vendorType && payment.vendorType !== filters.vendorType) return false;
      return true;
    });
  }
  
  // Auxiliar para mapear métodos de pagamento para os tipos do Stripe
  private mapPaymentMethodToStripe(method: PaymentMethod): string[] {
    switch (method) {
      case 'credit_card':
        return ['card'];
      case 'bank_slip':
        return ['boleto'];
      case 'pix':
        return ['pix'];
      case 'student_card':
        return ['card'];
      case 'student_wristband':
        return ['student_wristband'];
      default:
        return ['card'];
    }
  }
  
  // Gera um recibo para um pagamento concluído
  async generateReceipt(paymentId: string): Promise<{ url: string } | null> {
    const payment = await this.getPayment(paymentId);
    if (!payment || payment.status !== 'paid') {
      return null;
    }
    
    // Em um cenário real, geraria um PDF ou HTML e retornaria a URL
    // Aqui estamos apenas simulando
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      url: `/receipts/${paymentId}.pdf`
    };
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
      },
      {
        id: 'CNT10001',
        amount: 1250,
        description: 'Compra na cantina Delícias da Ana',
        status: 'paid',
        method: 'student_wristband',
        createdAt: '2025-05-02T12:15:00Z',
        paidAt: '2025-05-02T12:15:05Z',
        studentId: 'STD001',
        studentName: 'Lucas Silva',
        schoolId: 'SCH001',
        schoolName: 'Colégio São Paulo',
        vendorId: 'VND001',
        vendorName: 'Delícias da Ana',
        vendorType: 'third_party',
        terminalId: 'TERM001',
        deviceId: 'DEV0023',
        metadata: {
          transactionType: 'canteen_purchase',
          terminalProvider: 'Stone',
        }
      },
      {
        id: 'CNT10002',
        amount: 950,
        description: 'Compra na cantina Escolar',
        status: 'paid',
        method: 'student_wristband',
        createdAt: '2025-05-02T10:30:00Z',
        paidAt: '2025-05-02T10:30:03Z',
        studentId: 'STD002',
        studentName: 'Maria Oliveira',
        schoolId: 'SCH002',
        schoolName: 'Escola Maria Eduarda',
        vendorId: 'SCH002',
        vendorName: 'Cantina Escolar',
        vendorType: 'own',
        terminalId: 'TERM005',
        deviceId: 'DEV0045',
        metadata: {
          transactionType: 'canteen_purchase',
          items: ['Suco natural', 'Sanduíche']
        }
      }
    ];
    
    this.payments = [...mockPayments, ...this.payments];
  }
}

// Exporta uma instância única do serviço
export const paymentService = new PaymentService();

// Adiciona dados mockados para demonstração
paymentService.seedMockPayments();
