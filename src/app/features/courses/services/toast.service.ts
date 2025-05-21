// src/app/core/services/toast.service.ts
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: Toast[] = [];
  private subject = new BehaviorSubject<Toast[]>([]);
  private expireSubject = new Subject<number>();
  public expire$ = this.expireSubject.asObservable();

  getToasts(): Observable<Toast[]> {
    return this.subject.asObservable();
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.subject.next(this.toasts);
  }

  show(toast: Omit<Toast, 'id'>): void {
    const id = Date.now() + Math.random();
    const timeout = toast.timeout ?? 5000;
    const showProgress = toast.showProgress ?? true;

    const full: Toast = {
      id,
      timeout,
      showProgress,
      icon: this.getIconForType(toast.type),
      iconUrl: toast.iconUrl,
      ...toast
    };

    this.toasts = [...this.toasts, full];
    this.subject.next(this.toasts);

    // Вместо remove(id) — оповещаем об истечении
    if (timeout > 0) {
      setTimeout(() => this.expireSubject.next(id), timeout);
    }
  }

  /** Удобные методы для стандартных типов */
  success(message: string, title?: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    this.show({ type: 'success', message, title, ...options });
  }

  error(message: string, title?: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    this.show({ type: 'error', message, title, ...options });
  }

  info(message: string, title?: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    this.show({ type: 'info', message, title, ...options });
  }

  warning(message: string, title?: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    this.show({ type: 'warning', message, title, ...options });
  }

  /** Тост для долгих операций без автозакрытия */
  pending(message: string, title?: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    this.show({ type: 'pending', message, title, timeout: 0, showProgress: false, ...options });
  }

  /**
   * Произвольный тост с кастомным URL-иконкой (png, gif и т.п.)
   * @param iconUrl — путь к gif/png
   */
  custom(message: string, iconUrl: string, title?: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) {
    this.show({ type: 'custom', message, title, iconUrl, ...options });
  }

  /** Получить дефолтную иконку для типа */
  private getIconForType(type: ToastType): string {
    switch (type) {
      case 'success': return '✔️';
      case 'error':   return '❌';
      case 'info':    return 'ℹ️';
      case 'warning': return '⚠️';
      case 'pending': return '⏳';
      case 'custom':  return '';    // при custom иконка берётся из iconUrl
      default:        return '';
    }
  }
}
