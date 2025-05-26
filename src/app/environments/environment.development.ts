export const environment = {
  production: true,
  auth: {
    issuer: 'https://clg-posam.com/auth/realms/Academia_project',
    redirectUri: 'https://clg-posam.com/',
    clientId: 'discussion-backend',
    responseType: 'code',
    scope: 'openid profile email',
    showDebugInformation: false,
    requireHttps: true
  },
};
