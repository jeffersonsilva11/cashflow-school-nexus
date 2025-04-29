
// Mock data for the cashless school system

// 1. Schools data
export const schools = [
  {
    id: "1",
    name: "Colégio Integrado",
    city: "São Paulo",
    state: "SP",
    students: 1250,
    transactions: 4328,
    volume: 42980.75,
    status: "active",
  },
  {
    id: "2",
    name: "Escola Maria Eduarda",
    city: "Rio de Janeiro",
    state: "RJ",
    students: 890,
    transactions: 2985,
    volume: 32640.30,
    status: "active",
  },
  {
    id: "3",
    name: "Colégio São Pedro",
    city: "Belo Horizonte",
    state: "MG",
    students: 650,
    transactions: 1820,
    volume: 19750.50,
    status: "active",
  },
  {
    id: "4",
    name: "Escola Técnica Federal",
    city: "Brasília",
    state: "DF",
    students: 1100,
    transactions: 3240,
    volume: 35870.25,
    status: "active",
  },
  {
    id: "5",
    name: "Instituto Educacional Fortaleza",
    city: "Fortaleza",
    state: "CE",
    students: 780,
    transactions: 2150,
    volume: 21980.90,
    status: "pending",
  },
];

// 2. Transactions data
export const recentTransactions = [
  {
    id: "T0001",
    date: new Date(2025, 3, 29, 10, 15),
    student: "João Silva",
    school: "Colégio Integrado",
    type: "purchase",
    amount: 15.50,
    status: "completed",
  },
  {
    id: "T0002",
    date: new Date(2025, 3, 29, 10, 12),
    student: "Maria Oliveira",
    school: "Escola Maria Eduarda",
    type: "reload",
    amount: 50.00,
    status: "completed",
  },
  {
    id: "T0003",
    date: new Date(2025, 3, 29, 10, 5),
    student: "Pedro Santos",
    school: "Colégio São Pedro",
    type: "purchase",
    amount: 8.75,
    status: "completed",
  },
  {
    id: "T0004",
    date: new Date(2025, 3, 29, 9, 58),
    student: "Ana Costa",
    school: "Escola Técnica Federal",
    type: "purchase",
    amount: 12.30,
    status: "completed",
  },
  {
    id: "T0005",
    date: new Date(2025, 3, 29, 9, 45),
    student: "Lucas Almeida",
    school: "Colégio Integrado",
    type: "reload",
    amount: 100.00,
    status: "completed",
  },
];

// 3. Dashboard statistics
export const dashboardStats = {
  activeSchools: 23,
  totalStudents: 12580,
  dailyTransactions: 4850,
  monthlyVolume: 245680.50,
  growthRate: {
    schools: 12.5,
    transactions: 18.2,
    volume: 15.4,
  },
  transactionByType: {
    purchase: 65,
    reload: 35,
  },
};

// 4. Transaction volume trend data
export const transactionTrend = [
  { date: "01/04", volume: 15240.50 },
  { date: "02/04", volume: 14850.75 },
  { date: "03/04", volume: 15750.25 },
  { date: "04/04", volume: 16540.80 },
  { date: "05/04", volume: 9780.45 },
  { date: "06/04", volume: 8250.30 },
  { date: "07/04", volume: 17850.60 },
  { date: "08/04", volume: 18340.25 },
  { date: "09/04", volume: 17950.70 },
  { date: "10/04", volume: 16840.90 },
  { date: "11/04", volume: 19250.35 },
  { date: "12/04", volume: 10650.20 },
  { date: "13/04", volume: 9870.15 },
  { date: "14/04", volume: 19850.45 },
  { date: "15/04", volume: 20150.80 },
  { date: "16/04", volume: 19750.60 },
  { date: "17/04", volume: 18950.35 },
  { date: "18/04", volume: 21250.90 },
  { date: "19/04", volume: 12540.25 },
  { date: "20/04", volume: 11850.50 },
  { date: "21/04", volume: 21450.75 },
  { date: "22/04", volume: 22150.40 },
  { date: "23/04", volume: 21850.25 },
  { date: "24/04", volume: 20950.60 },
  { date: "25/04", volume: 23250.80 },
  { date: "26/04", volume: 14650.35 },
  { date: "27/04", volume: 13950.20 },
  { date: "28/04", volume: 22840.75 },
  { date: "29/04", volume: 23580.50 },
];

// 5. Users data
export const users = [
  {
    id: "U0001",
    name: "Carlos Roberto",
    email: "carlos.roberto@admin.cashflow.com",
    role: "Super Admin",
    status: "active",
  },
  {
    id: "U0002",
    name: "Fernanda Lima",
    email: "fernanda.lima@colegio-integrado.edu.br",
    role: "School Admin",
    school: "Colégio Integrado",
    status: "active",
  },
  {
    id: "U0003",
    name: "Rodrigo Alves",
    email: "rodrigo.alves@escola-maria-eduarda.edu.br",
    role: "School Admin",
    school: "Escola Maria Eduarda",
    status: "active",
  },
  {
    id: "U0004",
    name: "Juliana Costa",
    email: "juliana.costa@support.cashflow.com",
    role: "Support",
    status: "active",
  },
  {
    id: "U0005",
    name: "Marcelo Ribeiro",
    email: "marcelo.ribeiro@finance.cashflow.com",
    role: "Finance Admin",
    status: "pending",
  },
];
