import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {UserService} from './core/services/user.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {

  userService = inject(UserService);

  user = this.userService.getUserSignal();

  logout() {
    this.userService.logout();
  }

  login() {
    this.userService.login();
  }
}
