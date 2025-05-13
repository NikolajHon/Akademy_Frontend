export const environment = {
  production: false,
  auth: {
    issuer: 'http://localhost:8081/realms/Academia_project',
    redirectUri: 'http://localhost:4200/',
    clientId: 'discussion-backend',
    responseType: 'code',
    scope: 'openid profile email',
    showDebugInformation: true,
  },
};
