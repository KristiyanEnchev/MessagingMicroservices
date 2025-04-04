export enum NotificationType {
  SYSTEM,
  SECURITY,
  FEATURE,
  MARKETING,
  ANNOUNCEMENT
}

export enum NotificationStrategy {
  EMAIL,
  SMS,
  PUSH,
  IN_APP,
  ALL
}

export enum NotificationPriority {
  LOW,
  MEDIUM,
  HIGH,
  CRITICAL
}

export interface SendNotificationCommand {
  title: string;
  message: string;
  type: NotificationType;
  strategy: NotificationStrategy;
  priority: NotificationPriority;
  recipients: string[];
  scheduledAt?: string;
}