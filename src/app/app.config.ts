import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideRouter } from '@angular/router'; // 👈 добавь это
import { routes } from './app.routes';           // 👈 и это

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(OAuthModule.forRoot()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideRouter(routes) // 👈 обязательно подключи маршруты
  ]
};
