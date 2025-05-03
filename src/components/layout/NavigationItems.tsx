
import { Home, CreditCard, Building, UserCog, Settings, Users, History, School, GraduationCap, FileText, Layout, BarChart3, Banknote } from "lucide-react";

export const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    permission: ["admin", "school_admin", "parent", "staff"]
  },
  {
    title: "Escolas",
    href: "/schools",
    icon: School,
    permission: ["admin"]
  },
  {
    title: "Alunos",
    href: "/students",
    icon: GraduationCap,
    permission: ["admin", "school_admin"]
  },
  {
    title: "Responsáveis",
    href: "/parents",
    icon: UserCog,
    permission: ["admin", "school_admin"]
  },
  {
    title: "Usuários",
    href: "/users",
    icon: Users,
    permission: ["admin"]
  },
  {
    title: "Dispositivos",
    href: "/devices",
    icon: Layout,
    permission: ["admin", "school_admin"]
  },
  {
    title: "Vendedores",
    href: "/vendors",
    icon: Building,
    permission: ["admin", "school_admin"]
  },
  {
    title: "Transações",
    href: "/transactions",
    icon: CreditCard,
    permission: ["admin", "school_admin", "parent", "staff"]
  }
];

export const financialNavItems = [
  {
    title: "Financeiro",
    href: "/financial",
    icon: Banknote,
    permission: ["admin"]
  },
  {
    title: "Faturas",
    href: "/financial/invoices",
    icon: FileText,
    permission: ["admin"]
  }
];

export const reportsAndAdminItems = [
  {
    title: "Relatórios",
    href: "/reports",
    icon: BarChart3,
    permission: ["admin", "school_admin"]
  },
  {
    title: "Logs de Auditoria",
    href: "/audit-logs", 
    icon: History,
    permission: ["admin", "school_admin"]
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    permission: ["admin"]
  }
];
