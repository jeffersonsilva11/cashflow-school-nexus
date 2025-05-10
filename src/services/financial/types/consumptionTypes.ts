
// Define interfaces for consumption analysis data structures to avoid recursive type issues

export interface ConsumptionAnalysisRecord {
  id: string;
  school_id: string;
  product_type: string;
  amount: number;
  quantity: number;
  student_count: number;
  average_per_student: number;
  report_date: string;
  created_at: string;
  updated_at: string;
  vendor_id?: string;
}

export interface TransactionRecord {
  id: string;
  amount: number;
  vendor_id: string;
  student_id: string;
  status: string;
  type: string;
  created_at: string;
}

export interface SchoolRecord {
  id: string;
  name: string;
}

export interface VendorRecord {
  id: string;
  name: string;
  type: string;
}

export interface StudentRecord {
  id: string;
  school_id: string;
}

// Explicitly define the output format to avoid circular type dependencies
export interface ConsumptionAnalysisItemOutput {
  schoolId: string;
  schoolName: string;
  productType: string;
  amount: number;
  quantity: number;
  studentCount: number;
  averagePerStudent: number;
  vendorId: string;
  vendorName: string;
}
