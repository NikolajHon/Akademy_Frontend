// src/app/core/services/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: Toast[] = [];
  private subject = new BehaviorSubject<Toast[]>([]);

  getToasts(): Observable<Toast[]> {
    console.log('[ToastService] Подписка на toasts, текущий массив:', this.toasts);
    return this.subject.asObservable();
  }


  remove(id: number) {
    console.log(`[ToastService] remove(): удаляем тост c id=${id}`);
    this.toasts = this.toasts.filter(t => t.id !== id);
    console.log('[ToastService] remove(): оставшиеся тосты:', this.toasts);
    this.subject.next(this.toasts);
  }
  // src/app/core/services/toast.service.ts
  show(toast: Omit<Toast, 'id'>) {
    const id = Date.now() + Math.random();
    const full: Toast = {
      id,
      timeout: toast.timeout ?? 5000,    // по умолчанию 5 секунд
      icon: this.getIconForType(toast.type),
      ...toast
    };
    this.toasts = [...this.toasts, full];
    this.subject.next(this.toasts);
    setTimeout(() => this.remove(id), full.timeout);
  }

// Пример: возвращаем Unicode-иконку или класс из библиотеки
  private getIconForType(type: Toast['type']): string {
    switch(type) {
      case 'success': return '✔️';
      case 'error':   return '❌';
      case 'info':    return 'ℹ️';
      case 'warning': return '⚠️';
    }
  }

}
