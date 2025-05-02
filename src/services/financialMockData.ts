
// Dados financeiros para o módulo administrativo

// Dados das escolas para visão financeira
export const schoolFinancials = [
  {
    id: "1",
    name: "Colégio Integrado",
    plan: "Premium",
    monthlyFee: 2500.00,
    activeStudents: 1250,
    activeDevices: 35,
    lastPayment: "2025-04-15",
    status: "active",
    totalRevenue: 42980.75,
    pendingAmount: 0,
    nextBillingDate: "2025-05-15",
    pricePerStudent: 15.00
  },
  {
    id: "2",
    name: "Escola Maria Eduarda",
    plan: "Standard",
    monthlyFee: 1800.00,
    activeStudents: 890,
    activeDevices: 25,
    lastPayment: "2025-04-10",
    status: "active",
    totalRevenue: 32640.30,
    pendingAmount: 0,
    nextBillingDate: "2025-05-10",
    pricePerStudent: 12.00
  },
  {
    id: "3",
    name: "Colégio São Pedro",
    plan: "Basic",
    monthlyFee: 1200.00,
    activeStudents: 650,
    activeDevices: 18,
    lastPayment: "2025-03-28",
    status: "pending",
    totalRevenue: 19750.50,
    pendingAmount: 1200.00,
    nextBillingDate: "2025-04-28",
    pricePerStudent: 10.00
  },
  {
    id: "4",
    name: "Escola Técnica Federal",
    plan: "Premium",
    monthlyFee: 2500.00,
    activeStudents: 1100,
    activeDevices: 30,
    lastPayment: "2025-04-05",
    status: "active",
    totalRevenue: 35870.25,
    pendingAmount: 0,
    nextBillingDate: "2025-05-05",
    pricePerStudent: 15.00
  },
  {
    id: "5",
    name: "Instituto Educacional Fortaleza",
    plan: "Standard",
    monthlyFee: 1800.00,
    activeStudents: 780,
    activeDevices: 22,
    lastPayment: "2025-04-01",
    status: "overdue",
    totalRevenue: 21980.90,
    pendingAmount: 1800.00,
    nextBillingDate: "2025-05-01",
    pricePerStudent: 12.00
  },
];

// Dados das faturas
export const invoices = [
  {
    id: "INV-2025-0001",
    schoolId: "1",
    schoolName: "Colégio Integrado",
    amount: 2500.00,
    issuedDate: "2025-04-01",
    dueDate: "2025-04-15",
    paidDate: "2025-04-10",
    status: "paid",
    items: [
      { description: "Mensalidade Premium - Abril/2025", amount: 2500.00 }
    ]
  },
  {
    id: "INV-2025-0002",
    schoolId: "2",
    schoolName: "Escola Maria Eduarda",
    amount: 1800.00,
    issuedDate: "2025-04-01",
    dueDate: "2025-04-10",
    paidDate: "2025-04-08",
    status: "paid",
    items: [
      { description: "Mensalidade Standard - Abril/2025", amount: 1800.00 }
    ]
  },
  {
    id: "INV-2025-0003",
    schoolId: "3",
    schoolName: "Colégio São Pedro",
    amount: 1200.00,
    issuedDate: "2025-04-01",
    dueDate: "2025-04-28",
    paidDate: null,
    status: "pending",
    items: [
      { description: "Mensalidade Basic - Abril/2025", amount: 1200.00 }
    ]
  },
  {
    id: "INV-2025-0004",
    schoolId: "4",
    schoolName: "Escola Técnica Federal",
    amount: 2500.00,
    issuedDate: "2025-04-01",
    dueDate: "2025-04-05",
    paidDate: "2025-04-03",
    status: "paid",
    items: [
      { description: "Mensalidade Premium - Abril/2025", amount: 2500.00 }
    ]
  },
  {
    id: "INV-2025-0005",
    schoolId: "5",
    schoolName: "Instituto Educacional Fortaleza",
    amount: 1800.00,
    issuedDate: "2025-04-01",
    dueDate: "2025-04-15",
    paidDate: null,
    status: "overdue",
    items: [
      { description: "Mensalidade Standard - Abril/2025", amount: 1800.00 }
    ]
  },
];

// Dados de assinaturas
export const subscriptions = [
  {
    id: "SUB-1001",
    schoolId: "1", 
    schoolName: "Colégio Integrado",
    plan: "Premium",
    startDate: "2024-01-01",
    currentPeriodStart: "2025-04-01",
    currentPeriodEnd: "2025-04-30",
    monthlyFee: 2500.00,
    status: "active",
    paymentMethod: "Cartão de Crédito",
    autoRenew: true
  },
  {
    id: "SUB-1002",
    schoolId: "2", 
    schoolName: "Escola Maria Eduarda",
    plan: "Standard",
    startDate: "2024-02-15",
    currentPeriodStart: "2025-04-01",
    currentPeriodEnd: "2025-04-30",
    monthlyFee: 1800.00,
    status: "active",
    paymentMethod: "Boleto Bancário",
    autoRenew: true
  },
  {
    id: "SUB-1003",
    schoolId: "3", 
    schoolName: "Colégio São Pedro",
    plan: "Basic",
    startDate: "2024-03-10",
    currentPeriodStart: "2025-04-01",
    currentPeriodEnd: "2025-04-30",
    monthlyFee: 1200.00,
    status: "active",
    paymentMethod: "Boleto Bancário",
    autoRenew: true
  },
  {
    id: "SUB-1004",
    schoolId: "4", 
    schoolName: "Escola Técnica Federal",
    plan: "Premium",
    startDate: "2024-01-20",
    currentPeriodStart: "2025-04-01",
    currentPeriodEnd: "2025-04-30",
    monthlyFee: 2500.00,
    status: "active",
    paymentMethod: "Cartão de Crédito",
    autoRenew: true
  },
  {
    id: "SUB-1005",
    schoolId: "5", 
    schoolName: "Instituto Educacional Fortaleza",
    plan: "Standard",
    startDate: "2024-02-01",
    currentPeriodStart: "2025-04-01",
    currentPeriodEnd: "2025-04-30",
    monthlyFee: 1800.00,
    status: "past_due",
    paymentMethod: "Boleto Bancário",
    autoRenew: true
  },
];

// Planos disponíveis - Atualizados para modelo de preço por aluno, com faixas
export const plans = [
  {
    id: "plan-basic",
    name: "Basic",
    pricePerStudent: 10.00,
    studentRange: "Até 800 alunos",
    deviceLimit: 20,
    minStudents: 1,
    maxStudents: 800,
    discount: null,
    features: [
      "Até 800 alunos",
      "Até 20 dispositivos",
      "Suporte básico",
      "Relatórios mensais",
      "1 usuário administrativo"
    ]
  },
  {
    id: "plan-standard",
    name: "Standard",
    pricePerStudent: 12.00,
    studentRange: "Até 1000 alunos",
    deviceLimit: 30,
    minStudents: 801,
    maxStudents: 1000,
    discount: {
      threshold: 900,
      percentage: 5
    },
    features: [
      "Até 1000 alunos",
      "Até 30 dispositivos",
      "Suporte prioritário",
      "Relatórios semanais",
      "3 usuários administrativos",
      "Módulo de cantina"
    ]
  },
  {
    id: "plan-premium",
    name: "Premium",
    pricePerStudent: 15.00,
    studentRange: "Alunos ilimitados",
    deviceLimit: 50,
    minStudents: 1001,
    maxStudents: null,
    discount: {
      threshold: 1500,
      percentage: 10
    },
    features: [
      "Alunos ilimitados",
      "Até 50 dispositivos",
      "Suporte 24/7",
      "Relatórios em tempo real",
      "5 usuários administrativos",
      "Módulo de cantina",
      "Módulo de transporte",
      "API para integrações"
    ]
  }
];

// Preços por aluno para cada plano
export const studentPricing = {
  Basic: 10.00,
  Standard: 12.00,
  Premium: 15.00
};

// Relatórios financeiros
export const financialReports = {
  overview: {
    totalActiveSchools: 4,
    totalRevenueMonth: 142570.50,
    totalActiveSubscriptions: 5,
    totalPendingPayments: 3000.00,
    averageRevenuePerSchool: 28514.10,
    growthRate: 12.5
  },
  revenueByPlan: [
    { plan: "Basic", revenue: 24000.00, percentage: 16.8 },
    { plan: "Standard", revenue: 39600.00, percentage: 27.8 },
    { plan: "Premium", revenue: 78970.50, percentage: 55.4 }
  ],
  monthlyTrend: [
    { month: "Jan", revenue: 108500.20 },
    { month: "Feb", revenue: 115750.40 },
    { month: "Mar", revenue: 128350.80 },
    { month: "Apr", revenue: 142570.50 }
  ]
};

// Funções para gerenciar planos
export const updatePlan = (planId: string, updatedPlan: any) => {
  const index = plans.findIndex(plan => plan.id === planId);
  if (index !== -1) {
    plans[index] = { ...plans[index], ...updatedPlan };
    return plans[index];
  }
  return null;
};

export const addPlan = (newPlan: any) => {
  const planWithId = {
    ...newPlan,
    id: `plan-${newPlan.name.toLowerCase()}`
  };
  plans.push(planWithId);
  return planWithId;
};

export type PlanType = typeof plans[0];

