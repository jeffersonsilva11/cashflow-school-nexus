
// Tipos de alertas do sistema
export enum AlertType {
  OFFLINE = 'offline',
  LOW_BATTERY = 'lowBattery',
  ERROR = 'error',
  PHYSICAL_DAMAGE = 'physicalDamage',
  CONNECTION_ISSUE = 'connectionIssue',
  SECURITY_BREACH = 'securityBreach'
}

// Níveis de severidade dos alertas
export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Interface para os alertas
export interface DeviceAlert {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'card' | 'wristband' | 'terminal';
  schoolId?: string;
  schoolName?: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

// Mock de alertas para dispositivos
const mockAlerts: DeviceAlert[] = [
  {
    id: 'ALT001',
    deviceId: 'TERM-2023-001',
    deviceName: 'Terminal Cantina Principal',
    deviceType: 'terminal',
    schoolId: 'SCH001',
    schoolName: 'Colégio São Paulo',
    type: AlertType.OFFLINE,
    severity: AlertSeverity.HIGH,
    message: 'Terminal offline há mais de 24 horas',
    timestamp: '2023-05-01T08:23:15',
    resolved: false
  },
  {
    id: 'ALT002',
    deviceId: 'TERM-2023-005',
    deviceName: 'Terminal Entrada Principal',
    deviceType: 'terminal',
    schoolId: 'SCH002',
    schoolName: 'Colégio Dom Bosco',
    type: AlertType.CONNECTION_ISSUE,
    severity: AlertSeverity.MEDIUM,
    message: 'Instabilidade na conexão de rede',
    timestamp: '2023-05-02T10:15:22',
    resolved: true,
    resolvedAt: '2023-05-02T11:30:45',
    resolvedBy: 'Técnico José Silva'
  },
  {
    id: 'ALT003',
    deviceId: 'CARD-2023-8742',
    deviceName: 'Cartão',
    deviceType: 'card',
    schoolId: 'SCH001',
    schoolName: 'Colégio São Paulo',
    type: AlertType.PHYSICAL_DAMAGE,
    severity: AlertSeverity.LOW,
    message: 'Cartão reportado com dano físico',
    timestamp: '2023-05-03T14:22:10',
    resolved: false
  },
  {
    id: 'ALT004',
    deviceId: 'WBAND-2023-3641',
    deviceName: 'Pulseira',
    deviceType: 'wristband',
    schoolId: 'SCH002',
    schoolName: 'Colégio Dom Bosco',
    type: AlertType.ERROR,
    severity: AlertSeverity.MEDIUM,
    message: 'Erro na leitura do chip NFC',
    timestamp: '2023-05-03T09:45:30',
    resolved: false
  },
  {
    id: 'ALT005',
    deviceId: 'TERM-2023-010',
    deviceName: 'Terminal Biblioteca',
    deviceType: 'terminal',
    schoolId: 'SCH003',
    schoolName: 'Instituto Futuro',
    type: AlertType.SECURITY_BREACH,
    severity: AlertSeverity.CRITICAL,
    message: 'Tentativa de acesso não autorizado detectada',
    timestamp: '2023-05-04T02:15:00',
    resolved: false
  }
];

// Serviço de alertas para dispositivos
export const deviceAlertService = {
  // Obtém todos os alertas
  getAllAlerts: (): Promise<DeviceAlert[]> => {
    return Promise.resolve(mockAlerts);
  },
  
  // Obtém alertas não resolvidos
  getUnresolvedAlerts: (): Promise<DeviceAlert[]> => {
    return Promise.resolve(mockAlerts.filter(alert => !alert.resolved));
  },
  
  // Obtém alertas por tipo de dispositivo
  getAlertsByDeviceType: (deviceType: 'card' | 'wristband' | 'terminal'): Promise<DeviceAlert[]> => {
    return Promise.resolve(mockAlerts.filter(alert => alert.deviceType === deviceType));
  },
  
  // Obtém alertas para um dispositivo específico
  getAlertsByDeviceId: (deviceId: string): Promise<DeviceAlert[]> => {
    return Promise.resolve(mockAlerts.filter(alert => alert.deviceId === deviceId));
  },
  
  // Obtém alertas por escola
  getAlertsBySchool: (schoolId: string): Promise<DeviceAlert[]> => {
    return Promise.resolve(mockAlerts.filter(alert => alert.schoolId === schoolId));
  },
  
  // Marca um alerta como resolvido
  resolveAlert: (alertId: string, resolvedBy: string): Promise<DeviceAlert> => {
    const alert = mockAlerts.find(a => a.id === alertId);
    if (!alert) {
      return Promise.reject(new Error('Alerta não encontrado'));
    }
    
    alert.resolved = true;
    alert.resolvedAt = new Date().toISOString();
    alert.resolvedBy = resolvedBy;
    
    return Promise.resolve(alert);
  },
  
  // Cria um novo alerta (simulado)
  createAlert: (alert: Omit<DeviceAlert, 'id' | 'timestamp'>): Promise<DeviceAlert> => {
    const newAlert: DeviceAlert = {
      ...alert,
      id: `ALT${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      timestamp: new Date().toISOString()
    };
    
    mockAlerts.push(newAlert);
    return Promise.resolve(newAlert);
  }
};
