import {inject, Injectable, signal} from '@angular/core';
import {UserModel, UsersResponseDto} from '../models/user-model';
import {OAuthService} from 'angular-oauth2-oidc';
import {authCodeFlowConfig} from '../config/authCodeFlowConfig.config';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {UserRole} from '../models/user-role-enum';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private user = signal<UserModel|undefined>(undefined);
  private jwtHelper = new JwtHelperService();
  private baseUrl = 'api/users';

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.oauthService.configure(authCodeFlowConfig);
    this.tryLogin();
  }
  getAllUsers(): Observable<UsersResponseDto> {
    return this.http.get<UsersResponseDto>(`${this.baseUrl}`, {
      headers: { 'Accept': 'application/json' }
    });
  }
  getUserSignal() {
    return this.user.asReadonly();
  }
  enrollUserToCourse(userId: number, courseId: number): Observable<void> {
    const url = `${this.baseUrl}/${userId}/courses/${courseId}`;
    return this.http.post<void>(url, null, {
      headers: { 'Accept': 'application/json' }
    });
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
