
import { 
  Home, 
  Users, 
  School, 
  CreditCard, 
  DollarSign, 
  Settings, 
  BarChart3, 
  Database, 
  HelpCircle, 
  BookOpen,
  UserRound,
  FileBarChart,
  ShieldCheck,
  Layers,
  GraduationCap,
  Building,
  ReceiptText,
  FileText,
  CalendarClock
} from 'lucide-react';

// Dashboard
export const dashboardItems = [
  { to: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
];

// Escolas
export const schoolItems = [
  { to: "/schools", icon: <School size={20} />, label: "Escolas" },
  { to: "/schools/map", icon: <Layers size={20} />, label: "Mapa de Escolas" },
  { to: "/schools/invites", icon: <ShieldCheck size={20} />, label: "Convites" },
];

// Usuários
export const userItems = [
  { to: "/users", icon: <Users size={20} />, label: "Usuários" },
  { to: "/parents", icon: <UserRound size={20} />, label: "Pais/Responsáveis" },
  { to: "/students", icon: <GraduationCap size={20} />, label: "Alunos" },
];

// Transações/Financeiro
export const financeItems = [
  { to: "/payment", icon: <CreditCard size={20} />, label: "Pagamentos" },
  { to: "/transactions", icon: <ReceiptText size={20} />, label: "Transações Cantina" },
  { to: "/financial", icon: <DollarSign size={20} />, label: "Financeiro Admin" },
  { to: "/financial/invoices", icon: <FileText size={20} />, label: "Faturas" },
  { to: "/financial/subscriptions", icon: <CalendarClock size={20} />, label: "Assinaturas" },
  { to: "/financial/billing", icon: <DollarSign size={20} />, label: "Cobranças" },
];

// Dispositivos
export const deviceItems = [
  { to: "/devices", icon: <Database size={20} />, label: "Dispositivos" },
  { to: "/device-batches", icon: <Layers size={20} />, label: "Lotes" },
];

// Relatórios
export const reportItems = [
  { to: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
  { to: "/reports/financial", icon: <FileBarChart size={20} />, label: "Financeiros" },
  { to: "/reports/students", icon: <BookOpen size={20} />, label: "Alunos" },
];

// Configurações e Suporte
export const settingsItems = [
  { to: "/settings", icon: <Settings size={20} />, label: "Configurações" },
  { to: "/support", icon: <HelpCircle size={20} />, label: "Suporte" },
];
