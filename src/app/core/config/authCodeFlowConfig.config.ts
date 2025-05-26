import { AuthConfig } from 'angular-oauth2-oidc';
import {environment} from '../../environments/environment.development';

export const authCodeFlowConfig: AuthConfig = {
  issuer: environment.auth.issuer,
  redirectUri: environment.auth.redirectUri,
  clientId: environment.auth.clientId,
  responseType: environment.auth.responseType,
  scope: environment.auth.scope,
  showDebugInformation: environment.auth.showDebugInformation,
  requireHttps: false,
};
