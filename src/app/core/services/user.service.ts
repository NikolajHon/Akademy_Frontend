import {inject, Injectable, signal} from '@angular/core';
import {UserModel} from '../models/user-model';
import {OAuthService} from 'angular-oauth2-oidc';
import {authCodeFlowConfig} from '../config/authCodeFlowConfig.config';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {UserRole} from '../models/user-role-enum';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class UserService {
  private user = signal<UserModel|undefined>(undefined);
  private jwtHelper = new JwtHelperService();

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

  async tryLogin(): Promise<UserModel|undefined> {
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    const rawToken = this.oauthService.getAccessToken();
    if (!rawToken) {
      this.user.set(undefined);
      return undefined;
    }

    const claims = this.jwtHelper.decodeToken(rawToken) as any;
    if (!claims) {
      this.user.set(undefined);
      return undefined;
    }

    const roles: string[] = claims.realm_access?.roles || [];
    const isTeacher = roles.map(r => r.toUpperCase()).includes('TEACHER');
    const role = isTeacher ? UserRole.TEACHER : UserRole.STUDENT;
    console.log('🎭 Роль из токена:', roles, '→', role);

    const u: UserModel = {
      id: claims.sub,
      name: claims.name,
      username: claims.preferred_username,
      email: claims.email,
      role
    };
    this.user.set(u);

    const target = this.oauthService.state;
    if (target) {
      this.router.navigateByUrl(decodeURIComponent(target));
    }
    return u;
  }



  logout(): void {
    this.oauthService.logOut();
    this.user.set(undefined);
  }

  isUserLoggedIn(): boolean {
    const token = this.oauthService.getAccessToken();
    const expMs = this.oauthService.getAccessTokenExpiration();
    const msLeft = expMs - Date.now();
    console.log(
      `Access token present: ${!!token}, expires in ${Math.floor(msLeft / 1000)} sec`
    );
    if (msLeft < 0) {
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
