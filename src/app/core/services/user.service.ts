import {inject, Injectable, signal} from '@angular/core';
import {UserModel} from '../models/user-model';
import {OAuthService} from 'angular-oauth2-oidc';
import {authCodeFlowConfig} from '../config/authCodeFlowConfig.config';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';


@Injectable({ providedIn: 'root' })
export class UserService {
  private user = signal<UserModel|undefined>(undefined);

  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {
    this.oauthService.configure(authCodeFlowConfig);
    this.tryLogin();
  }

  getUserSignal() {
    return this.user.asReadonly();
  }

  tryLogin(): Promise<UserModel|undefined> {
    return this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        const claims = this.oauthService.getIdentityClaims() as UserModel;
        this.user.set(claims);

        const target = this.oauthService.state;
        if (target) {
          this.router.navigateByUrl(decodeURIComponent(target));
        }

        return claims;
      });
  }



  logout(): void {
    this.oauthService.logOut();
    this.user.set(undefined);
  }

  isUserLoggedIn(): boolean {
    const token = this.oauthService.getAccessToken();
    const expMs  = this.oauthService.getAccessTokenExpiration();
    const msLeft = expMs - Date.now();
    console.log(
      `Access token present: ${!!token}, expires in ${Math.floor(msLeft/1000)} sec`
    );
    if(msLeft < 0) {
      this.logout();
    }
    return !!token && msLeft > 0;
  }
  login(redirectUrl?: string): void {
    this.oauthService.initCodeFlow(redirectUrl);
  }
}



export const canActiveHome: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean> => {
  const userService = inject(UserService);

  await userService.tryLogin();
  console.log('user logged in', userService.isUserLoggedIn());

  if (userService.isUserLoggedIn()) {
    return true;
  }
  userService.login(state.url);
  return false;
};
