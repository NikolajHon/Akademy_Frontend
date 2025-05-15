// src/app/notification-component/notification.component.ts
import { Component, OnInit } from '@angular/core';
import {ToastService} from '../features/courses/services/toast.service';
import {Toast} from '../features/courses/models/toast.model';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    console.log('[NotificationComponent] ngOnInit: подписываемся на сервис тостов');
    this.toastService.getToasts()
      .subscribe(list => {
        console.log('[NotificationComponent] пришёл новый массив тостов:', list);
        this.toasts = list;
      });
  }

  dismiss(id: number) {
    console.log('[NotificationComponent] dismiss() для id=', id);
    this.toastService.remove(id);
  }
}
