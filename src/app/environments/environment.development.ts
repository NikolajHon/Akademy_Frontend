// src/environments/environment.prod.ts (или environment.ts для dev)
export const environment = {
  production: true,
  auth: {
    issuer:      'http://172.205.72.71/realms/Academia_project',
    redirectUri: 'http://74.178.109.89/',

    clientId:     'discussion-backend',
    responseType: 'code',
    scope:        'openid profile email',
    showDebugInformation: false,
    requireHttps: false,
  },
};
