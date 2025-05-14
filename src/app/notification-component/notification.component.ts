import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type NotificationType = 'success' | 'error' | 'info';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input() message = '';
  @Input() type: NotificationType = 'info';
  @Input() duration = 3000; // время до автоматического скрытия в мс

  visible = false;

  ngOnInit(): void {
    this.show();
  }

  show(): void {
    this.visible = true;
    setTimeout(() => this.visible = false, this.duration);
  }
}
