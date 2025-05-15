import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from './core/services/user.service';
import { CommonModule } from '@angular/common';
import {NotificationComponent} from './notification-component/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NotificationComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private userService = inject(UserService);
  user = this.userService.getUserSignal();

  login() {
    this.userService.login();
  }

  logout() {
    this.userService.logout();
  }
}
