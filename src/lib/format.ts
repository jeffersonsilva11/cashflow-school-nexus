
/**
 * Utility functions for formatting data
 */

// Format currency values
export const formatCurrency = (value: number | string | undefined | null, options?: Intl.NumberFormatOptions): string => {
  if (value === undefined || value === null) return "R$ 0,00";
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }).format(numValue);
};

// Format dates
export const formatDate = (
  date: Date | string | undefined | null, 
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  
  return new Intl.DateTimeFormat(
    'pt-BR', 
    options || defaultOptions
  ).format(dateObj);
};

// Format date and time
export const formatDateTime = (
  date: Date | string | undefined | null, 
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Intl.DateTimeFormat(
    'pt-BR', 
    options || defaultOptions
  ).format(dateObj);
};

// Format phone numbers
export const formatPhone = (phone: string | undefined | null): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 11) {
    // Format mobile phones (DDD) 9XXXX-XXXX
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
  } else if (digits.length === 10) {
    // Format landlines (DDD) XXXX-XXXX
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6, 10)}`;
  }
  
  // Return original if it doesn't match expected patterns
  return phone;
};

// Format document IDs (CPF/CNPJ)
export const formatDocument = (doc: string | undefined | null): string => {
  if (!doc) return '';
  
  // Remove all non-digit characters
  const digits = doc.replace(/\D/g, '');
  
  if (digits.length === 11) {
    // Format CPF XXX.XXX.XXX-XX
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9, 11)}`;
  } else if (digits.length === 14) {
    // Format CNPJ XX.XXX.XXX/XXXX-XX
    return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8, 12)}-${digits.substring(12, 14)}`;
  }
  
  // Return original if it doesn't match expected patterns
  return doc;
};

// Format number with thousands separator
export const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '0';
  return new Intl.NumberFormat('pt-BR').format(value);
};
