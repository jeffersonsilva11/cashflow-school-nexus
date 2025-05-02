
// Define the enabled modules type
export type EnabledModules = {
  cashless: boolean;
  accessControl: boolean;
  attendance: boolean;
  parentComm: boolean;
  advancedReports: boolean;
};

// Export the SchoolFormData type for use in step components
export type SchoolFormData = {
  id?: string;
  name: string;
  cnpj: string;
  type: string;
  email: string;
  phone: string;
  website?: string;
  
  // Location
  zipCode: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  
  // Director/responsible
  directorName: string;
  directorPosition: string;
  directorEmail: string;
  directorPhone: string;
  
  // System configuration
  plan: string;
  estimatedStudents: number;
  contractDuration: string;
  
  // Modules
  enabledModules: EnabledModules;
  
  // Financial
  transactionFee: number;
  cashbackRate: number;
  monthlyClosingDay: number;
  
  // Access
  adminName: string;
  adminEmail: string;
  sendConfirmation?: boolean;
  scheduleTraining?: boolean;
};

// Define the available steps
export type WizardStep = 'basicInfo' | 'location' | 'systemConfig' | 'accessSummary' | 'confirmation';
