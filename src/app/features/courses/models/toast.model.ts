export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'pending' | 'custom';

export interface Toast {
  id: number;
  title?: string;
  message: string;
  type: ToastType;
  /** Если указан — будет показываться вместо unicode-значка */
  iconUrl?: string;
  /** Unicode-значок (например, '🔥', 'ℹ️', '✔️') */
  icon?: string;
  /** Таймаут в миллисекундах */
  timeout?: number;
  /** Показывать прогресс-бар? */
  showProgress?: boolean;
}
