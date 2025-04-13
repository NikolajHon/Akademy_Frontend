import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  issuer: 'http://localhost:8081/realms/akademia_project',
  redirectUri: window.location.origin,
  clientId: 'discussion-backend',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true
};
