
import {
  Home,
  School,
  User,
  Package,
  CreditCard,
  FileText,
  Settings,
  Users,
  Store,
  ChartPieIcon,
  BarChart3,
  FileBarChart,
  DollarSign,
  UserRound,
  Shield,
  FileArchive,
  MapPin,
  Utensils
} from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';

export type NavItemType = {
  title: string;
  href: string;
  icon: any;
  permission: UserRole[];
};

export const mainNavItems: NavItemType[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    permission: ['admin', 'school_admin', 'staff', 'parent']
  },
  {
    title: 'Escolas',
    href: '/schools',
    icon: School,
    permission: ['admin', 'school_admin']
  },
  {
    title: 'Estudantes',
    href: '/students',
    icon: Users,
    permission: ['admin', 'school_admin', 'staff']
  },
  {
    title: 'Responsáveis',
    href: '/parents',
    icon: UserRound,
    permission: ['admin', 'school_admin', 'staff']
  },
  {
    title: 'Dispositivos',
    href: '/devices',
    icon: CreditCard,
    permission: ['admin', 'school_admin']
  },
  {
    title: 'Cantina',
    href: '/canteen',
    icon: Utensils,
    permission: ['admin', 'school_admin', 'staff']
  },
  {
    title: 'Estabelecimentos',
    href: '/vendors',
    icon: Store,
    permission: ['admin', 'school_admin']
  },
];

export const financialNavItems: NavItemType[] = [
  {
    title: 'Visão Geral',
    href: '/financial',
    icon: DollarSign,
    permission: ['admin']
  },
  {
    title: 'Cobranças',
    href: '/financial/billing',
    icon: FileText,
    permission: ['admin']
  },
  {
    title: 'Faturas',
    href: '/financial/invoices',
    icon: CreditCard,
    permission: ['admin']
  },
  {
    title: 'Transações',
    href: '/transactions',
    icon: CreditCard,
    permission: ['admin', 'school_admin', 'staff']
  },
];

export const reportsAndAdminItems: NavItemType[] = [
  {
    title: 'Relatórios',
    href: '/reports',
    icon: BarChart3,
    permission: ['admin', 'school_admin']
  },
  {
    title: 'Relatórios Financeiros',
    href: '/reports/financial',
    icon: FileBarChart,
    permission: ['admin']
  },
  {
    title: 'Mapa de Escolas',
    href: '/schools/map',
    icon: MapPin,
    permission: ['admin', 'school_admin']
  },
  {
    title: 'Convites',
    href: '/schools/invites',
    icon: FileText,
    permission: ['admin', 'school_admin']
  },
];

export const systemItems: NavItemType[] = [
  {
    title: 'Usuários',
    href: '/users',
    icon: User,
    permission: ['admin', 'school_admin']
  },
  {
    title: 'Logs de Auditoria',
    href: '/audit-logs',
    icon: FileArchive,
    permission: ['admin']
  },
  {
    title: 'Segurança & Compliance',
    href: '/security-compliance',
    icon: Shield,
    permission: ['admin']
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: Settings,
    permission: ['admin', 'school_admin']
  }
];
