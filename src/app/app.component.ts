import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from './core/services/user.service';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification-component/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private userService = inject(UserService);
  user = this.userService.getUserSignal();

  private dark = signal<boolean>(localStorage.getItem('dark') === '1');

  login()  { this.userService.login(); }
  logout() { this.userService.logout(); }

  isDarkTheme() { return this.dark(); }

  toggleTheme(evt?: Event) {
    const isDark = evt ? (evt.target as HTMLInputElement).checked : !this.dark();
    this.dark.set(isDark);
    document.documentElement.classList.toggle('dark-theme', isDark);
    localStorage.setItem('dark', isDark ? '1' : '0');
  }

  constructor() {
    if (this.isDarkTheme()) {
      document.documentElement.classList.add('dark-theme');
    }
  }
}
