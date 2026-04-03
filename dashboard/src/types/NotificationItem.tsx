export interface NotificationItem {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  dateTime: string;
  description: string;
}