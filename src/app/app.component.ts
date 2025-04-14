import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './core/config/authCodeFlowConfig.config';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  private router = inject(Router);
  private oauthService = inject(OAuthService);
  loggedIn = false;

  async ngOnInit() {
    this.oauthService.configure(authCodeFlowConfig);

    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.initCodeFlow();
      return;
    }
    console.log("we were login")
    this.loggedIn = true;
    this.router.navigate(['/courses']);
  }
}
