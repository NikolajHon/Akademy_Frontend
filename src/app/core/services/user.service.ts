import {inject, Injectable, signal} from '@angular/core';
import {
  CourseProgressWithUserDto,
  CreateUserRequestDto,
  RatingDto,
  UserModel,
  UsersResponseDto
} from '../models/user-model';
import {OAuthService} from 'angular-oauth2-oidc';
import {authCodeFlowConfig} from '../config/authCodeFlowConfig.config';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {UserRole} from '../models/user-role-enum';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, of, switchMap, throwError} from 'rxjs';

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
  unenrollUserFromCourse(userId: number, courseId: number): Observable<void> {
    const url = `${this.baseUrl}/${userId}/courses/${courseId}`;
    return this.http.delete<void>(url, {
      headers: { 'Accept': 'application/json' }
    });
  }


  setUserCourseRating(
    userId: string,
    courseId: number,
    ratingDto: RatingDto
  ): Observable<void> {
    const url = `${this.baseUrl}/${userId}/courses/${courseId}/rating`;

    return this.getUserCourseRating(userId, courseId).pipe(
      map(current => current.rating),
      switchMap(currentRating => {
        const sumDto: RatingDto = { rating: currentRating + ratingDto.rating };
        console.log(url)
        return this.http.put<void>(url, sumDto, {
          headers: { 'Content-Type': 'application/json' }
        });
      }),
      catchError(err => throwError(() => err))
    );
  }

  getUserCourseRating(userId: string, courseId: number): Observable<RatingDto> {
    const url = `/api/users/${userId}/courses/${courseId}/rating`;
    return this.http.get<RatingDto>(url, {
      headers: { 'Accept': 'application/json' }
    }).pipe(
      catchError(err =>
        err.status === 404
          ? of({ rating: 0 })        // если нет записи — считаем рейтинг = 0
          : throwError(() => err)
      )
    );
  }


  listCourseProgressByCourse(courseId: number): Observable<CourseProgressWithUserDto[]> {
    const url = `${this.baseUrl}/courses/${courseId}/ratings`;
    return this.http.get<CourseProgressWithUserDto[]>(url, {
      headers: { 'Accept': 'application/json' }
    });
  }
  createUser(dto: CreateUserRequestDto): Observable<UserModel> {
    const token = this.oauthService.getAccessToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<UserModel>(`${this.baseUrl}`, dto, { headers });
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
