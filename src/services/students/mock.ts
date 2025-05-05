
// Mock data for student reports when database is empty

export const getMockStudentActivityData = () => {
  return [
    { month: "Jan", active: 450, inactive: 50, total: 500 },
    { month: "Feb", active: 470, inactive: 40, total: 510 },
    { month: "Mar", active: 490, inactive: 30, total: 520 },
    { month: "Apr", active: 510, inactive: 20, total: 530 },
    { month: "May", active: 530, inactive: 10, total: 540 },
  ];
};

export const getMockStudentDemographicsData = () => {
  return [
    { grade: "1º Ano", count: 45, percentage: 8.3 },
    { grade: "2º Ano", count: 52, percentage: 9.6 },
    { grade: "3º Ano", count: 48, percentage: 8.9 },
    { grade: "4º Ano", count: 50, percentage: 9.3 },
    { grade: "5º Ano", count: 55, percentage: 10.2 },
    { grade: "6º Ano", count: 58, percentage: 10.7 },
    { grade: "7º Ano", count: 60, percentage: 11.1 },
    { grade: "8º Ano", count: 57, percentage: 10.6 },
    { grade: "9º Ano", count: 56, percentage: 10.4 },
    { grade: "Ensino Médio", count: 59, percentage: 10.9 },
  ];
};

export const getMockStudentRetentionData = () => {
  return [
    { period: "Jan - Mar", newStudents: 45, transfers: 5, graduation: 0, retention: 98 },
    { period: "Abr - Jun", newStudents: 30, transfers: 8, graduation: 0, retention: 96 },
    { period: "Jul - Set", newStudents: 52, transfers: 12, graduation: 0, retention: 95 },
    { period: "Out - Dez", newStudents: 15, transfers: 4, graduation: 40, retention: 92 },
  ];
};
