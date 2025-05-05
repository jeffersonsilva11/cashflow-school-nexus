
// Mock data for analytics reports

export const getMockTransactionTrendsData = () => {
  return [
    { date: '2025-01-01', count: 120, amount: 3600 },
    { date: '2025-01-02', count: 115, amount: 3450 },
    { date: '2025-01-03', count: 130, amount: 3900 },
    { date: '2025-01-04', count: 125, amount: 3750 },
    { date: '2025-01-05', count: 110, amount: 3300 },
    { date: '2025-01-06', count: 105, amount: 3150 },
    { date: '2025-01-07', count: 140, amount: 4200 },
    { date: '2025-01-08', count: 150, amount: 4500 },
    { date: '2025-01-09', count: 145, amount: 4350 },
    { date: '2025-01-10', count: 160, amount: 4800 },
  ];
};

export const getMockUserBehaviorData = () => {
  return [
    { hour: '06:00', transactions: 15 },
    { hour: '07:00', transactions: 30 },
    { hour: '08:00', transactions: 65 },
    { hour: '09:00', transactions: 45 },
    { hour: '10:00', transactions: 35 },
    { hour: '11:00', transactions: 70 },
    { hour: '12:00', transactions: 90 },
    { hour: '13:00', transactions: 75 },
    { hour: '14:00', transactions: 40 },
    { hour: '15:00', transactions: 35 },
    { hour: '16:00', transactions: 55 },
    { hour: '17:00', transactions: 60 },
    { hour: '18:00', transactions: 40 },
  ];
};

export const getMockProductCategoryData = () => {
  return [
    { category: 'Lanches', value: 35, count: 350 },
    { category: 'Bebidas', value: 25, count: 250 },
    { category: 'Refeições', value: 20, count: 200 },
    { category: 'Sobremesas', value: 15, count: 150 },
    { category: 'Outros', value: 5, count: 50 },
  ];
};
