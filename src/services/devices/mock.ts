
// Mock data for device reports when database is empty

export const getMockDeviceStatusData = () => {
  return [
    { status: "Active", count: 350, percentage: 70 },
    { status: "Inactive", count: 75, percentage: 15 },
    { status: "Maintenance", count: 50, percentage: 10 },
    { status: "Lost", count: 25, percentage: 5 },
  ];
};

export const getMockDeviceBatteryData = () => {
  return [
    { level: "90-100%", count: 120, percentage: 30 },
    { level: "70-90%", count: 150, percentage: 37.5 },
    { level: "50-70%", count: 80, percentage: 20 },
    { level: "30-50%", count: 40, percentage: 10 },
    { level: "0-30%", count: 10, percentage: 2.5 },
  ];
};

export const getMockDeviceUsageData = () => {
  return [
    { month: "Jan", daily_active: 280, monthly_active: 320, total: 350 },
    { month: "Feb", daily_active: 290, monthly_active: 325, total: 350 },
    { month: "Mar", daily_active: 300, monthly_active: 335, total: 350 },
    { month: "Apr", daily_active: 310, monthly_active: 340, total: 350 },
    { month: "May", daily_active: 320, monthly_active: 345, total: 370 },
  ];
};
