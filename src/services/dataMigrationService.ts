
import { supabase } from "@/integrations/supabase/client";
import { schoolFinancials, subscriptions, invoices, financialReports, plans } from "@/services/financialMockData";
import { schools, students } from "@/services/mockData";
import { toast } from "@/components/ui/use-toast";

// Helper functions to generate random IDs for relationships
const generateId = () => crypto.randomUUID();
const generateInvoiceId = () => `INV-${Math.floor(100000 + Math.random() * 900000)}`;
const generateSubscriptionId = () => `SUB-${Math.floor(100000 + Math.random() * 900000)}`;

// Step 1: Migrate schools data
export async function migrateSchools() {
  try {
    console.log("Starting school migration...");
    const formattedSchools = schools.map(school => ({
      id: generateId(),
      name: school.name,
      address: school.address,
      city: school.city,
      state: school.state,
      zipcode: school.zipCode,
      phone: school.phone,
      email: school.email || `contact@${school.name.toLowerCase().replace(/\s+/g, '')}.edu.br`,
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
      description: plan.description,
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
export async function migrateSubscriptions(schoolsMap, plansMap) {
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
    const schoolsDbMap = {};
    dbSchools.forEach(school => { schoolsDbMap[school.name] = school.id; });
    
    const plansDbMap = {};
    dbPlans.forEach(plan => { plansDbMap[plan.name] = plan.id; });
    
    // Format subscriptions
    const formattedSubscriptions = subscriptions.map(sub => {
      const schoolName = schoolFinancials.find(sf => sf.id === sub.schoolId)?.name || '';
      const schoolId = schoolsDbMap[schoolName];
      
      if (!schoolId) {
        console.warn(`No matching school found for ${schoolName} (ID: ${sub.schoolId})`);
        return null;
      }
      
      const planId = plansDbMap[sub.planName] || plansDbMap['Standard']; // Fallback to Standard plan
      
      return {
        id: generateId(),
        subscription_id: generateSubscriptionId(),
        school_id: schoolId,
        plan_id: planId,
        start_date: sub.startDate,
        current_period_start: sub.currentPeriodStart,
        current_period_end: sub.currentPeriodEnd,
        monthly_fee: sub.amount,
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
    const schoolsDbMap = {};
    dbSchools.forEach(school => { schoolsDbMap[school.name] = school.id; });
    
    const subscriptionsDbMap = {};
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

// Main migration function
export async function migrateAllData() {
  try {
    // Check if data already exists to avoid duplicates
    const { data: existingSchools } = await supabase.from('schools').select('count').single();
    const { data: existingPlans } = await supabase.from('plans').select('count').single();
    
    const schoolCount = existingSchools?.count || 0;
    const planCount = existingPlans?.count || 0;
    
    if (schoolCount > 0 || planCount > 0) {
      return {
        success: false,
        message: `Migração não realizada. Já existem dados no banco (${schoolCount} escolas, ${planCount} planos).`
      };
    }
    
    // Temporary maps to store relationships
    const schoolsMap = {};
    const plansMap = {};
    
    // Step 1: Migrate schools
    const migratedSchools = await migrateSchools();
    migratedSchools.forEach(school => { schoolsMap[school.name] = school.id; });
    
    // Step 2: Migrate plans
    const migratedPlans = await migratePlans();
    migratedPlans.forEach(plan => { plansMap[plan.name] = plan.id; });
    
    // Step 3: Migrate subscriptions
    await migrateSubscriptions(schoolsMap, plansMap);
    
    // Step 4: Migrate invoices
    await migrateInvoices();
    
    // Step 5: Migrate financial reports
    await migrateFinancialReports();
    
    return {
      success: true,
      message: "Todos os dados foram migrados com sucesso!",
      schoolsCount: migratedSchools.length,
      plansCount: migratedPlans.length
    };
  } catch (error) {
    console.error("Error in full migration:", error);
    return {
      success: false,
      message: `Erro na migração: ${error.message || "Ocorreu um erro desconhecido"}`,
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
            variant: "warning"
          });
        }
        return result;
      } catch (error) {
        toast({
          title: "Erro na migração",
          description: error.message || "Ocorreu um erro durante a migração dos dados",
          variant: "destructive"
        });
        throw error;
      }
    }
  };
}
