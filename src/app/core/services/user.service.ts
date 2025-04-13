import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../config/authCodeFlowConfig.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userData: any;

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig);

    this.tryLogin();
  }

  public async tryLogin() {
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.loadUserData();
  }

  public login() {
    this.oauthService.initLoginFlow();
  }

  public logout() {
    this.oauthService.logOut();
  }

  public isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  private loadUserData() {
    let claims: any = this.oauthService.getIdentityClaims();
    if (claims) {
      this.userData = claims;
    }
  }

  public getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }
}
