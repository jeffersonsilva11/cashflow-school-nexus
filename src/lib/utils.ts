
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formata um valor numérico para o formato de moeda brasileira
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Formata um valor numérico para o formato de porcentagem
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

// Formata uma data para exibição padrão PT-BR
export function formatDateBR(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Formata um número com separadores de milhares
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

// Exporta todas as funções de formatação para uso fácil
export const formatters = {
  currency: formatCurrency,
  percentage: formatPercentage,
  date: formatDateBR,
  number: formatNumber
};
