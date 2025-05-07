
// Mock data for device reports

export const getMockDeviceStatusData = () => {
  return [
    { status: 'active', count: 850, percentage: 85 },
    { status: 'inactive', count: 100, percentage: 10 },
    { status: 'maintenance', count: 30, percentage: 3 },
    { status: 'lost', count: 20, percentage: 2 }
  ];
};

export const getMockDeviceBatteryData = () => {
  return [
    { level: '90-100%', count: 450, percentage: 45 },
    { level: '70-90%', count: 250, percentage: 25 },
    { level: '50-70%', count: 150, percentage: 15 },
    { level: '30-50%', count: 100, percentage: 10 },
    { level: '0-30%', count: 50, percentage: 5 }
  ];
};

export const getMockDeviceUsageData = () => {
  return [
    { month: 'Jan', daily_active: 750, monthly_active: 950, total: 1000 },
    { month: 'Feb', daily_active: 780, monthly_active: 960, total: 1025 },
    { month: 'Mar', daily_active: 800, monthly_active: 980, total: 1060 },
    { month: 'Abr', daily_active: 820, monthly_active: 1000, total: 1085 },
    { month: 'Mai', daily_active: 850, monthly_active: 1020, total: 1110 },
    { month: 'Jun', daily_active: 870, monthly_active: 1050, total: 1125 }
  ];
};
