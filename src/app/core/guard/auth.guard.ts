import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

export const authGuard: CanActivateFn = async (route, state) => {
    const oauthService = inject(OAuthService);
    const router = inject(Router);

    await oauthService.loadDiscoveryDocumentAndTryLogin();

    if (oauthService.hasValidAccessToken()) {
        console.log('✅ Access token найден, продолжаем');
        return true;
    }

    console.warn('🔒 Нет access token, запускаем OAuth flow');
    oauthService.initCodeFlow();
    return false;
};
