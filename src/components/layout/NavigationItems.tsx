
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
  CalendarClock,
  Download,
  LayoutDashboard,
  User,
  Receipt,
  Store,
  UserCog,
  FileSpreadsheet,
  Shield
} from 'lucide-react';

// Dashboard
export const dashboardItems = [
  { to: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
  { to: "/third-party-dashboard", icon: <Building size={20} />, label: "Cantinas Terceirizadas" },
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
  { to: "/vendors", icon: <Building size={20} />, label: "Cantinas" },
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
  { to: "/reports/devices", icon: <Database size={20} />, label: "Dispositivos" },
  { to: "/reports/students", icon: <BookOpen size={20} />, label: "Alunos" },
  { to: "/reports/export", icon: <Download size={20} />, label: "Exportar Dados" },
];

// Configurações e Suporte
export const settingsItems = [
  { to: "/settings", icon: <Settings size={20} />, label: "Configurações" },
  { to: "/support", icon: <HelpCircle size={20} />, label: "Suporte" },
];

export const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
    permission: "general",
  },
  {
    title: "Escolas",
    href: "/schools",
    icon: <School className="h-5 w-5" />,
    permission: "schools",
  },
  {
    title: "Alunos",
    href: "/students",
    icon: <Users className="h-5 w-5" />,
    permission: "students",
  },
  {
    title: "Responsáveis",
    href: "/parents",
    icon: <User className="h-5 w-5" />,
    permission: "parents",
  },
  {
    title: "Dispositivos",
    href: "/devices",
    icon: <CreditCard className="h-5 w-5" />,
    permission: "devices",
  },
  {
    title: "Transações",
    href: "/transactions",
    icon: <Receipt className="h-5 w-5" />,
    permission: "transactions",
  },
  {
    title: "Financeiro",
    href: "/financial",
    icon: <DollarSign className="h-5 w-5" />,
    permission: "financial",
  },
  {
    title: "Cantinas",
    href: "/vendors",
    icon: <Store className="h-5 w-5" />,
    permission: "vendors",
  },
  {
    title: "Usuários",
    href: "/users",
    icon: <UserCog className="h-5 w-5" />,
    permission: "users",
  },
  {
    title: "Relatórios",
    icon: <FileBarChart className="h-5 w-5" />,
    permission: "reports",
    children: [
      {
        title: "Relatórios Financeiros",
        href: "/reports/financial",
        icon: <FileSpreadsheet className="h-4 w-4" />,
      },
      {
        title: "Uso de Dispositivos",
        href: "/reports/device-usage",
        icon: <FileBarChart className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Segurança",
    href: "/security-compliance",
    icon: <Shield className="h-5 w-5" />,
    permission: "admin",
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    permission: "settings",
  },
];
