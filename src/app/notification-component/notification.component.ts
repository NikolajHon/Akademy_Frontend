
import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import {ToastService} from '../features/courses/services/toast.service';
import {Toast} from '../features/courses/models/toast.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  toasts: Toast[] = [];
  exitingMap: Record<number, boolean> = {};

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.getToasts().subscribe(list => {
      this.toasts = list;
    });

    this.toastService.expire$.subscribe(id => {
      this.dismiss(id);
    });
  }

  dismiss(id: number): void {
    this.exitingMap[id] = true;
    // через 300мс (длительность slide-out) реально удаляем из сервиса
    setTimeout(() => {
      this.toastService.remove(id);
      delete this.exitingMap[id];
    }, 300);
  }
}
