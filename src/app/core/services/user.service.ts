import {inject, Injectable, signal} from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../config/authCodeFlowConfig.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user = signal<any | undefined>(undefined);

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig);
    this.tryLogin();
  }

  async tryLogin() {
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.loadUserData();

    if (this.oauthService.hasValidAccessToken()) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut(true);
    this.user.set(undefined);
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  private loadUserData() {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this.user.set(claims);
    }
  }

  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  getUserSignal() {
    return this.user.asReadonly();
  }
}
