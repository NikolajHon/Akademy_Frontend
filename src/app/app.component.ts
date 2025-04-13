import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './core/config/authCodeFlowConfig.config';
import {CoursesComponent} from './course/course.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CoursesComponent],
  template: `
    <ng-container *ngIf="loggedIn; else loading">
      <app-courses></app-courses>
    </ng-container>
    <ng-template #loading>
      <p>Инициализация авторизации через Keycloak...</p>
    </ng-template>
  `
})
export class AppComponent implements OnInit {
  private oauthService = inject(OAuthService);
  loggedIn = false;

  async ngOnInit() {
    this.oauthService.configure(authCodeFlowConfig);
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.initCodeFlow();
      return;
    }

    this.loggedIn = true;
  }
}
