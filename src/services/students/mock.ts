
// Mock data for student reports

export const getMockStudentActivityData = () => {
  return [
    { month: 'Jan', active: 950, inactive: 50, total: 1000 },
    { month: 'Feb', active: 980, inactive: 45, total: 1025 },
    { month: 'Mar', active: 1020, inactive: 40, total: 1060 },
    { month: 'Abr', active: 1050, inactive: 35, total: 1085 },
    { month: 'Mai', active: 1080, inactive: 30, total: 1110 },
    { month: 'Jun', active: 1100, inactive: 25, total: 1125 }
  ];
};

export const getMockStudentDemographicsData = () => {
  return [
    { grade: '1º ano', count: 120, percentage: 10 },
    { grade: '2º ano', count: 135, percentage: 11 },
    { grade: '3º ano', count: 115, percentage: 10 },
    { grade: '4º ano', count: 125, percentage: 10 },
    { grade: '5º ano', count: 145, percentage: 12 },
    { grade: '6º ano', count: 155, percentage: 13 },
    { grade: '7º ano', count: 140, percentage: 12 },
    { grade: '8º ano', count: 130, percentage: 11 },
    { grade: '9º ano', count: 135, percentage: 11 }
  ];
};

export const getMockStudentRetentionData = () => {
  return [
    {
      period: '2025-Q1',
      new_students: 85,
      transfers: 15,
      graduation: 0,
      enrolled: 1020,
      left: 15,
      retention_rate: 98
    },
    {
      period: '2025-Q2',
      new_students: 75,
      transfers: 10,
      graduation: 0,
      enrolled: 1085,
      left: 10,
      retention_rate: 99
    },
    {
      period: '2025-Q3',
      new_students: 95,
      transfers: 12,
      graduation: 0,
      enrolled: 1168,
      left: 12,
      retention_rate: 99
    },
    {
      period: '2025-Q4',
      new_students: 40,
      transfers: 25,
      graduation: 150,
      enrolled: 1033,
      left: 175,
      retention_rate: 85
    }
  ];
};
