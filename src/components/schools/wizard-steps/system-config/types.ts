
import { z } from 'zod';
import { SchoolFormData, EnabledModules } from '../../types/school-wizard-types';

// Schema de validação
export const systemConfigSchema = z.object({
  plan: z.string().min(1, { message: 'Selecione um plano' }),
  estimatedStudents: z.number().min(1, { message: 'Informe a quantidade estimada de alunos' }),
  contractDuration: z.string().min(1, { message: 'Selecione a vigência do contrato' }),
  
  // Módulos
  enabledModules: z.object({
    cashless: z.boolean().default(false),
    accessControl: z.boolean().default(false),
    attendance: z.boolean().default(false),
    parentComm: z.boolean().default(false),
    advancedReports: z.boolean().default(false),
  }),
  
  // Financeiro
  transactionFee: z.number().min(0).max(10),
  cashbackRate: z.number().min(0).max(10),
  monthlyClosingDay: z.number().min(1).max(31),
});

export type SystemConfigFormValues = z.infer<typeof systemConfigSchema>;

export type SystemConfigStepProps = {
  formData: SchoolFormData;
  updateFormData: (data: Partial<SchoolFormData>) => void;
};

export const plans = [
  { value: 'Básico', label: 'Plano Básico' },
  { value: 'Standard', label: 'Plano Standard' },
  { value: 'Premium', label: 'Plano Premium' },
  { value: 'Enterprise', label: 'Plano Enterprise' },
];

export const durations = [
  { value: '12 meses', label: '12 meses' },
  { value: '24 meses', label: '24 meses' },
  { value: '36 meses', label: '36 meses' },
  { value: 'Personalizado', label: 'Personalizado' },
];
