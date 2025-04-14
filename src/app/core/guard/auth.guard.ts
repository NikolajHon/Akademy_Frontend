import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

export const authGuard: CanActivateFn = async (route, state) => {
    const oauthService = inject(OAuthService);
    const router = inject(Router);

    await oauthService.loadDiscoveryDocumentAndTryLogin();

    if (oauthService.hasValidAccessToken()) {
        return true;
    }

    oauthService.initCodeFlow();
    return false;
};
