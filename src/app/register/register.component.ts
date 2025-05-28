// src/app/register/register.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HttpBackend,
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpClientModule
} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserRole } from '../core/models/user-role-enum';
import { UserService } from '../core/services/user.service';
import { ToastService } from '../features/courses/services/toast.service';
import { NotificationComponent } from '../notification-component/notification.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NotificationComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    role: UserRole.STUDENT
  };

  loading = false;
  error: string | null = null;
  private http: HttpClient;

  constructor(
    handler: HttpBackend,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.http = new HttpClient(handler);
  }

  async onSubmit(form: any) {
    if (!form.valid) {
      this.toastService.error('Please fill in all required fields', 'Invalid Form');
      return;
    }

    this.loading = true;
    this.error = null;
    this.toastService.pending('Registering user...', 'Please wait');

    const realm = 'Academia_project';

    let adminToken: string | null = null;
    let keycloakId: string | null = null;

    try {
      const tokenParams = new HttpParams()
        .set('grant_type', 'password')
        .set('client_id', 'admin-cli')
        .set('username', 'admin')
        .set('password', 'admin');

      const tokenRes = await firstValueFrom(
        this.http.post<any>(
          'auth/realms/master/protocol/openid-connect/token',
          tokenParams.toString(),
          { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) }
        )
      );
      adminToken = tokenRes.access_token as string;

      const payload = {
        username: this.user.username,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        enabled: true,
        credentials: [
          { type: 'password', value: this.user.password, temporary: false }
        ]
      };

      const createRes = await firstValueFrom(
        this.http.post<HttpResponse<any>>(
          `auth/admin/realms/${realm}/users`,
          payload,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminToken}`
            }),
            observe: 'response'
          }
        )
      );
      const location = createRes.headers.get('location') || '';
      keycloakId = location.substring(location.lastIndexOf('/') + 1);

      const rolesList = await firstValueFrom(
        this.http.get<any[]>(`auth/admin/realms/${realm}/roles`, {
          headers: new HttpHeaders({ Authorization: `Bearer ${adminToken}` })
        })
      );

      const defaultRole = rolesList.find(r => r.name === `default-roles-${realm}`);
      if (defaultRole) {
        await firstValueFrom(
          this.http.request('DELETE', `auth/admin/realms/${realm}/users/${keycloakId}/role-mappings/realm`, {
            headers: new HttpHeaders({ Authorization: `Bearer ${adminToken}` }),
            body: [defaultRole]
          })
        );
      }

      const wantedRole = rolesList.find(r => r.name === this.user.role);
      if (!wantedRole) throw new Error(`Role "${this.user.role}" not found in realm`);

      await firstValueFrom(
        this.http.post(
          `auth/admin/realms/${realm}/users/${keycloakId}/role-mappings/realm`,
          [wantedRole],
          { headers: new HttpHeaders({ Authorization: `Bearer ${adminToken}` }) }
        )
      );

      await firstValueFrom(
        this.http.put(
          `auth/admin/realms/${realm}/users/${keycloakId}/execute-actions-email?lifespan=86400`,
          ['VERIFY_EMAIL', 'UPDATE_PASSWORD'],
          { headers: new HttpHeaders({ Authorization: `Bearer ${adminToken}` }) }
        )
      );

      const dto = {
        givingName: this.user.firstName,
        familyName: this.user.lastName,
        email: this.user.email,
        role: this.user.role,
        keycloakId
      };

      await firstValueFrom(this.userService.createUser(dto));

      this.toastService.success('User successfully registered', 'Registration Complete');
      this.loading = false;
    } catch (err: any) {
      if (adminToken && keycloakId) {
        try {
          await firstValueFrom(
            this.http.delete(`auth/admin/realms/${realm}/users/${keycloakId}`, {
              headers: new HttpHeaders({ Authorization: `Bearer ${adminToken}` })
            })
          );
          console.info(`[Rollback] Deleted Keycloak user ${keycloakId}`);
        } catch (rollbackErr) {
          console.error('[Rollback] Failed to delete Keycloak user', rollbackErr);
        }
      }

      const message = err?.status === 409
        ? 'User already exists'
        : err?.message || 'An unexpected error occurred';

      this.toastService.error(message, 'Registration Failed');
      this.error = message;
      this.loading = false;
    }
  }
}
