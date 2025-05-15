// src/app/core/models/toast.model.ts
export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  timeout?: number;    // в миллисекундах
  icon?: string;       // CSS-класс или URL SVG
}
