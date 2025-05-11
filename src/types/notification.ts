
export type NotificationType = 'device_alert' | 'transaction' | 'system' | 'school';

export interface Notification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedResourceType?: string;
  relatedResourceId?: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  deviceAlerts: boolean;
  transactionAlerts: boolean;
  systemAlerts: boolean;
  schoolAlerts: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  onlyUnread?: boolean;
}
