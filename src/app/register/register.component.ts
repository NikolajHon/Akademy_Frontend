import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams, HttpClientModule, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'student'
  };
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  onSubmit(form: any): void {
    if (!form.valid) return;

    this.loading = true;
    this.error = null;

    const params = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', 'admin-cli')
      .set('username', 'admin')
      .set('password', 'admin');

    this.http.post<any>(
      '/realms/master/protocol/openid-connect/token',
      params.toString(),
      { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) }
    ).subscribe({
      next: tokenRes => {
        const token = tokenRes.access_token as string;
        const adminHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });

        const payload = {
          username: this.user.username,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          enabled: true,
          credentials: [{ type: 'password', value: this.user.password, temporary: false }]
        };

        this.http.post<HttpResponse<any>>(
          '/admin/realms/akademia_project/users',
          payload,
          { headers: adminHeaders, observe: 'response' }
        ).subscribe({
          next: async createRes => {
            const location = createRes.headers.get('location') || '';
            const userId = location.substring(location.lastIndexOf('/') + 1);

            try {
              const rolesList = await this.http.get<any[]>(
                '/admin/realms/akademia_project/roles',
                { headers: adminHeaders }
              ).toPromise();

              const defaultRole = rolesList!.find(r => r.name === 'default-roles-akademia_project');
              if (defaultRole) {
                await this.http.request(
                  'DELETE',
                  `/admin/realms/akademia_project/users/${userId}/role-mappings/realm`,
                  { headers: adminHeaders, body: [defaultRole] }
                ).toPromise();
              }

              const roleObj = rolesList!.find(r => r.name === this.user.role);
              if (!roleObj) throw new Error(`Role ${this.user.role} not found`);

              await this.http.post(
                `/admin/realms/akademia_project/users/${userId}/role-mappings/realm`,
                [roleObj],
                { headers: adminHeaders }
              ).toPromise();

              console.log('User created successfully and role assigned');
              this.loading = false;
            } catch (err) {
              console.error('Role mapping error', err);
              this.error = (err as any).message;
              this.loading = false;
            }
          },
          error: err => {
            console.error('User creation error', err);
            this.error = err.status === 409 ? 'User already exists' : err.message;
            this.loading = false;
          }
        });
      },
      error: err => {
        console.error('Token retrieval error', err);
        this.error = err.message;
        this.loading = false;
      }
    });
  }
}
