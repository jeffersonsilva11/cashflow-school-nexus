import { supabase } from "@/integrations/supabase/client";
import { schoolFinancials, subscriptions, invoices, financialReports, plans } from "@/services/financialMockData";
import { schools, students, users } from "@/services/mockData";
import { toast } from "@/components/ui/use-toast";

// Tipos para os resultados da migração
export type MigrationResult = {
  success: boolean;
  message: string;
  schoolsCount?: number;
  plansCount?: number;
  studentsCount?: number;
  devicesCount?: number;
  error?: any;
};

// Helper functions to generate random IDs for relationships
const generateId = () => crypto.randomUUID();
const generateInvoiceId = () => `INV-${Math.floor(100000 + Math.random() * 900000)}`;
const generateSubscriptionId = () => `SUB-${Math.floor(100000 + Math.random() * 900000)}`;

// Verifica se já existem dados no banco
const checkExistingData = async (): Promise<{
  hasData: boolean;
  schoolCount: number;
  planCount: number;
}> => {
  try {
    // Buscar contagem de escolas
    const { count: schoolCount, error: schoolError } = await supabase
      .from('schools')
      .select('*', { count: 'exact', head: true });
    
    if (schoolError) throw schoolError;
    
    // Buscar contagem de planos
    const { count: planCount, error: planError } = await supabase
      .from('plans')
      .select('*', { count: 'exact', head: true });
    
    if (planError) throw planError;
    
    return {
      hasData: (schoolCount || 0) > 0 || (planCount || 0) > 0,
      schoolCount: schoolCount || 0,
      planCount: planCount || 0
    };
  } catch (error) {
    console.error("Error checking existing data:", error);
    return {
      hasData: false,
      schoolCount: 0,
      planCount: 0
    };
  }
};

// Nova função para limpar o banco de dados
export async function clearDatabaseData(): Promise<{ success: boolean; message: string }> {
  try {
    console.log("Iniciando limpeza do banco de dados...");

    // Lista de tabelas para limpar (ordem é importante devido a dependências)
    const tablesToClear = [
      'transactions',
      'devices',
      'device_logs',
      'device_alerts',
      'device_batches',
      'device_statuses',
      'student_balances',
      'parent_student',
      'students',
      'parents',
      'monthly_trends',
      'revenue_by_plan',
      'consumption_analysis',
      'invoices',
      'subscriptions',
      'financial_reports',
      'plans',
      'schools',
      'tablets',
      'payment_terminals',
      'payment_gateway_transactions',
      'vendor_products',
      'vendor_commission_tiers',
      'vendor_sales_reports',
      'vendor_transfers',
      'vendors_financials',
      'vendors'
      // Nota: não limpamos tabelas relacionadas a usuários como 'profiles'
    ];
    
    let successCount = 0;
    let errorMessages = [];

    // Limpar cada tabela
    for (const table of tablesToClear) {
      try {
        // Utilizando a tabela como um valor literal, não como uma string dinâmica
        const { error } = await supabase.from(table as any)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (error) {
          console.error(`Erro ao limpar tabela ${table}:`, error);
          errorMessages.push(`${table}: ${error.message}`);
        } else {
          successCount++;
          console.log(`Tabela ${table} limpa com sucesso`);
        }
      } catch (err) {
        console.error(`Erro ao limpar tabela ${table}:`, err);
        errorMessages.push(`${table}: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      }
    }

    const message = successCount === tablesToClear.length
      ? `Todas as ${successCount} tabelas foram limpas com sucesso`
      : `${successCount} de ${tablesToClear.length} tabelas foram limpas. ${errorMessages.length} erros encontrados.`;

    return {
      success: successCount > 0,
      message
    };
  } catch (error) {
    console.error("Erro ao limpar banco de dados:", error);
    return {
      success: false,
      message: `Falha na limpeza do banco: ${error instanceof Error ? error.message : "Erro desconhecido"}`
    };
  }
}

// Step 1: Migrate schools data
export async function migrateSchools() {
  try {
    console.log("Starting school migration...");
    const formattedSchools = schools.map(school => ({
      id: generateId(),
      name: school.name,
      address: "Endereço não especificado",
      city: school.city,
      state: school.state,
      zipcode: "00000-000", // Default value
      phone: "Não especificado",
      email: `contact@${school.name.toLowerCase().replace(/\s+/g, '')}.edu.br`,
      subscription_status: 'active', // Default status
      subscription_plan: schoolFinancials.find(sf => sf.name === school.name)?.plan.toLowerCase() || 'basic',
      active: true
    }));
    
    const { data, error } = await supabase
      .from('schools')
      .insert(formattedSchools)
      .select();
    
    if (error) throw error;
    console.log(`Migrated ${data.length} schools successfully`);
    return data;
  } catch (error) {
    console.error("Error migrating schools:", error);
    throw error;
  }
}

// Step 2: Migrate plans data
export async function migratePlans() {
  try {
    console.log("Starting plans migration...");
    const formattedPlans = plans.map(plan => ({
      id: generateId(),
      name: plan.name,
      price_per_student: plan.pricePerStudent,
      student_range: plan.studentRange,
      description: `${plan.name} - Plano para escolas com ${plan.studentRange} alunos`,
      device_limit: plan.deviceLimit,
      min_students: plan.minStudents,
      max_students: plan.maxStudents,
      features: plan.features
    }));
    
    const { data, error } = await supabase
      .from('plans')
      .insert(formattedPlans)
      .select();
    
    if (error) throw error;
    console.log(`Migrated ${data.length} plans successfully`);
    return data;
  } catch (error) {
    console.error("Error migrating plans:", error);
    throw error;
  }
}

// Step 3: Migrate subscriptions data
export async function migrateSubscriptions() {
  try {
    console.log("Starting subscriptions migration...");
    
    // Get schools from db to ensure we have the correct IDs
    const { data: dbSchools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name');
    
    if (schoolsError) throw schoolsError;
    
    // Get plans from db
    const { data: dbPlans, error: plansError } = await supabase
      .from('plans')
      .select('id, name');
    
    if (plansError) throw plansError;
    
    // Create maps for easier lookups
    const schoolsDbMap: Record<string, string> = {};
    dbSchools.forEach(school => { schoolsDbMap[school.name] = school.id; });
    
    const plansDbMap: Record<string, string> = {};
    dbPlans.forEach(plan => { plansDbMap[plan.name] = plan.id; });
    
    // Format subscriptions
    const formattedSubscriptions = subscriptions.map(sub => {
      const schoolName = schoolFinancials.find(sf => sf.id === sub.schoolId)?.name || '';
      const schoolId = schoolsDbMap[schoolName];
      
      if (!schoolId) {
        console.warn(`No matching school found for ${schoolName} (ID: ${sub.schoolId})`);
        return null;
      }
      
      // Use plan from schoolFinancials instead
      const schoolPlan = schoolFinancials.find(sf => sf.name === schoolName)?.plan || 'Standard';
      const planId = plansDbMap[schoolPlan] || plansDbMap['Standard']; // Fallback to Standard plan
      
      return {
        id: generateId(),
        subscription_id: generateSubscriptionId(),
        school_id: schoolId,
        plan_id: planId,
        start_date: sub.startDate,
        current_period_start: sub.currentPeriodStart,
        current_period_end: sub.currentPeriodEnd,
        monthly_fee: sub.monthlyFee,
        status: sub.status,
        payment_method: sub.paymentMethod,
        auto_renew: true
      };
    }).filter(Boolean); // Remove null entries
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(formattedSubscriptions)
      .select();
    
    if (error) throw error;
    console.log(`Migrated ${data.length} subscriptions successfully`);
    return data;
  } catch (error) {
    console.error("Error migrating subscriptions:", error);
    throw error;
  }
}

// Step 4: Migrate invoices data
export async function migrateInvoices() {
  try {
    console.log("Starting invoices migration...");
    
    // Get schools from db
    const { data: dbSchools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name');
    
    if (schoolsError) throw schoolsError;
    
    // Get subscriptions from db
    const { data: dbSubscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('id, school_id');
    
    if (subsError) throw subsError;
    
    // Create maps for lookups
    const schoolsDbMap: Record<string, string> = {};
    dbSchools.forEach(school => { schoolsDbMap[school.name] = school.id; });
    
    const subscriptionsDbMap: Record<string, string> = {};
    dbSubscriptions.forEach(sub => { subscriptionsDbMap[sub.school_id] = sub.id; });
    
    // Format invoices
    const formattedInvoices = invoices.map(inv => {
      const schoolName = inv.schoolName;
      const schoolId = schoolsDbMap[schoolName];
      
      if (!schoolId) {
        console.warn(`No matching school found for invoice ${inv.id} (school: ${schoolName})`);
        return null;
      }
      
      return {
        id: generateId(),
        invoice_id: inv.id, // Use existing mock ID
        school_id: schoolId,
        amount: inv.amount,
        issued_date: inv.issuedDate,
        due_date: inv.dueDate,
        paid_date: inv.paidDate || null,
        status: inv.status,
        items: inv.items,
        subscription_id: subscriptionsDbMap[schoolId] || null
      };
    }).filter(Boolean); // Remove null entries
    
    const { data, error } = await supabase
      .from('invoices')
      .insert(formattedInvoices)
      .select();
    
    if (error) throw error;
    console.log(`Migrated ${data.length} invoices successfully`);
    return data;
  } catch (error) {
    console.error("Error migrating invoices:", error);
    throw error;
  }
}

// Step 5: Migrate financial reports
export async function migrateFinancialReports() {
  try {
    console.log("Starting financial reports migration...");
    
    // Format monthly trend
    const monthlyTrendReport = {
      id: generateId(),
      report_type: 'monthly_trend',
      period: 'yearly',
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      data: financialReports.monthlyTrend
    };
    
    // Format revenue by plan
    const revenueByPlanReport = {
      id: generateId(),
      report_type: 'revenue_by_plan',
      period: 'monthly',
      start_date: '2025-05-01',
      end_date: '2025-05-31',
      data: financialReports.revenueByPlan
    };
    
    // Format overview data
    const overviewReport = {
      id: generateId(),
      report_type: 'overview',
      period: 'monthly',
      start_date: '2025-05-01',
      end_date: '2025-05-31',
      total_revenue: financialReports.overview.totalRevenueMonth,
      active_schools: financialReports.overview.totalActiveSchools,
      active_subscriptions: financialReports.overview.totalActiveSubscriptions,
      pending_payments: financialReports.overview.totalPendingPayments,
      average_revenue: financialReports.overview.averageRevenuePerSchool,
      growth_rate: financialReports.overview.growthRate,
      data: financialReports.overview
    };
    
    const formattedReports = [
      monthlyTrendReport,
      revenueByPlanReport,
      overviewReport
    ];
    
    const { data, error } = await supabase
      .from('financial_reports')
      .insert(formattedReports)
      .select();
    
    if (error) throw error;
    console.log(`Migrated ${data.length} financial reports successfully`);
    return data;
  } catch (error) {
    console.error("Error migrating financial reports:", error);
    throw error;
  }
}

// Step 6: Migrate students data
export async function migrateStudents() {
  try {
    console.log("Starting students migration...");
    
    // Get schools from db to ensure we have the correct IDs
    const { data: dbSchools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name');
    
    if (schoolsError) throw schoolsError;
    
    // Create map for easier lookups
    const schoolsDbMap: Record<string, string> = {};
    dbSchools.forEach(school => { schoolsDbMap[school.name] = school.id; });
    
    // Format students data with school IDs
    const formattedStudents = students.map(student => {
      const schoolName = schools.find(school => school.id === student.school_id)?.name || '';
      const schoolId = schoolsDbMap[schoolName];
      
      if (!schoolId) {
        console.warn(`No matching school found for student ${student.name} (school ID: ${student.school_id})`);
        return null;
      }
      
      return {
        id: generateId(),
        name: student.name,
        grade: student.grade,
        school_id: schoolId,
        date_of_birth: student.date_of_birth,
        document_id: student.document_id,
        active: student.active
      };
    }).filter(student => student !== null); // Only keep students with valid school IDs
    
    const { data, error } = await supabase
      .from('students')
      .insert(formattedStudents)
      .select();
    
    if (error) throw error;
    console.log(`Migrated ${data.length} students successfully`);
    return data;
  } catch (error) {
    console.error("Error migrating students:", error);
    throw error;
  }
}

// Step 7: Migrate devices data
export async function migrateDevices() {
  try {
    console.log("Starting devices migration...");
    
    // Get students and schools from db
    const { data: dbStudents, error: studentsError } = await supabase
      .from('students')
      .select('id, name');
    
    if (studentsError) throw studentsError;
    
    const { data: dbSchools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name');
    
    if (schoolsError) throw schoolsError;
    
    // Create maps for lookups
    const studentsDbMap: Record<string, string> = {};
    dbStudents.forEach(student => { studentsDbMap[student.name] = student.id; });
    
    const schoolsDbMap: Record<string, string> = {};
    dbSchools.forEach(school => { schoolsDbMap[school.name] = school.id; });
    
    // Create sample devices for each student
    const devices = [];
    
    // For each student, create a device
    for (const student of dbStudents) {
      const randomSchool = dbSchools[Math.floor(Math.random() * dbSchools.length)];
      
      // Only create a device for 80% of students
      if (Math.random() > 0.2) {
        devices.push({
          serial_number: `CARD-${Math.floor(1000 + Math.random() * 9000)}`,
          device_type: 'card',
          status: Math.random() > 0.1 ? 'active' : 'inactive',
          student_id: student.id,
          school_id: randomSchool.id,
          firmware_version: '1.0.0',
          device_model: 'Standard Card',
          batch_id: `BATCH-${Math.floor(100 + Math.random() * 900)}`,
          assigned_at: new Date().toISOString()
        });
      }
    }
    
    const { data, error } = await supabase
      .from('devices')
      .insert(devices)
      .select();
    
    if (error) throw error;
    console.log(`Migrated ${data.length} devices successfully`);
    return data;
  } catch (error) {
    console.error("Error migrating devices:", error);
    throw error;
  }
}

// Step 8: Migrate transactions data
export async function migrateTransactions() {
  try {
    console.log("Starting transactions migration...");
    
    // Get students and devices from db
    const { data: dbStudents, error: studentsError } = await supabase
      .from('students')
      .select('id, name');
    
    if (studentsError) throw studentsError;
    
    const { data: dbDevices, error: devicesError } = await supabase
      .from('devices')
      .select('id, student_id');
    
    if (devicesError) throw devicesError;
    
    // Create maps
    const studentDeviceMap: Record<string, string> = {};
    dbDevices.forEach(device => { 
      if (device.student_id) {
        studentDeviceMap[device.student_id] = device.id;
      }
    });
    
    // Create sample transactions
    const transactions = [];
    const transactionTypes = ['purchase', 'topup'];
    
    // Create transactions spanning the last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // For each student with a device, create some transactions
    for (const student of dbStudents) {
      const deviceId = studentDeviceMap[student.id];
      
      if (deviceId) {
        // Create between 1 and 10 transactions per student
        const transactionCount = Math.floor(1 + Math.random() * 10);
        
        for (let i = 0; i < transactionCount; i++) {
          // Random date in the last 30 days
          const transactionDate = new Date(
            thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
          );
          
          const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
          const amount = type === 'purchase' 
            ? Math.round((5 + Math.random() * 20) * 100) / 100 
            : Math.round((20 + Math.random() * 80) * 100) / 100;
          
          transactions.push({
            transaction_id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            student_id: student.id,
            device_id: deviceId,
            amount,
            type,
            status: 'completed', // Most transactions succeed
            transaction_date: transactionDate.toISOString(),
            payment_method: type === 'purchase' ? 'card' : 'pix',
          });
        }
      }
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactions)
      .select();
    
    if (error) throw error;
    console.log(`Migrated ${data.length} transactions successfully`);
    return data;
  } catch (error) {
    console.error("Error migrating transactions:", error);
    throw error;
  }
}

// Step 9: Migrate user profiles data
export async function migrateUserProfiles() {
  try {
    console.log("Starting user profiles migration...");
    
    // Get schools
    const { data: dbSchools, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name');
    
    if (schoolsError) throw schoolsError;
    
    const schoolsDbMap: Record<string, string> = {};
    dbSchools.forEach(school => { schoolsDbMap[school.name] = school.id; });
    
    // Format user profiles
    const formattedUsers = users.map(user => {
      // For school admins, find the school ID
      let schoolId = null;
      if (user.role === "School Admin" && user.school) {
        schoolId = schoolsDbMap[user.school];
      }
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase().replace(' ', '_'), // convert to snake_case
        school_id: schoolId,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
      };
    });
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert(formattedUsers, { onConflict: 'id' })
      .select();
    
    if (error) throw error;
    console.log(`Migrated ${data.length} user profiles successfully`);
    return data;
  } catch (error) {
    console.error("Error migrating user profiles:", error);
    throw error;
  }
}

// Main migration function
export async function migrateAllData(): Promise<MigrationResult> {
  try {
    // Check if data already exists to avoid duplicates
    const { hasData, schoolCount, planCount } = await checkExistingData();
    
    if (hasData) {
      return {
        success: false,
        message: `Migração não realizada. Já existem dados no banco (${schoolCount} escolas, ${planCount} planos).`
      };
    }
    
    console.log("Iniciando migração completa de dados");
    
    // Step 1: Migrate schools
    const migratedSchools = await migrateSchools();
    
    // Step 2: Migrate plans
    const migratedPlans = await migratePlans();
    
    // Step 3: Migrate subscriptions
    await migrateSubscriptions();
    
    // Step 4: Migrate invoices
    await migrateInvoices();
    
    // Step 5: Migrate financial reports
    await migrateFinancialReports();
    
    // Step 6: Migrate students
    const migratedStudents = await migrateStudents();
    
    // Step 7: Migrate devices
    const migratedDevices = await migrateDevices();
    
    // Step 8: Migrate transactions
    const migratedTransactions = await migrateTransactions();
    
    // Step 9: Migrate user profiles
    const migratedUsers = await migrateUserProfiles();
    
    return {
      success: true,
      message: "Todos os dados foram migrados com sucesso!",
      schoolsCount: migratedSchools.length,
      plansCount: migratedPlans.length,
      studentsCount: migratedStudents?.length || 0,
      devicesCount: migratedDevices?.length || 0
    };
  } catch (error) {
    console.error("Error in full migration:", error);
    return {
      success: false,
      message: `Erro na migração: ${error instanceof Error ? error.message : "Ocorreu um erro desconhecido"}`,
      error
    };
  }
}

// React hook for data migration
export function useMigrateData() {
  return {
    migrateAllData: async () => {
      try {
        const result = await migrateAllData();
        if (result.success) {
          toast({
            title: "Migração concluída",
            description: result.message
          });
        } else {
          toast({
            title: "Migração não realizada",
            description: result.message,
            variant: "destructive"
          });
        }
        return result;
      } catch (error) {
        toast({
          title: "Erro na migração",
          description: error instanceof Error ? error.message : "Ocorreu um erro durante a migração dos dados",
          variant: "destructive"
        });
        throw error;
      }
    },
    clearDatabaseData: async () => {
      try {
        const result = await clearDatabaseData();
        if (result.success) {
          toast({
            title: "Limpeza concluída",
            description: result.message
          });
        } else {
          toast({
            title: "Limpeza não concluída",
            description: result.message,
            variant: "destructive"
          });
        }
        return result;
      } catch (error) {
        toast({
          title: "Erro na limpeza",
          description: error instanceof Error ? error.message : "Ocorreu um erro durante a limpeza dos dados",
          variant: "destructive"
        });
        throw error;
      }
    }
  };
}
