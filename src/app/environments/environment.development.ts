export const environment = {
  production: true,
  auth: {
    issuer: 'https://clg-posam.com/auth/realms/Academia_project',
    redirectUri: 'https://20.223.168.156.nip.io/',
    clientId: 'discussion-backend',
    responseType: 'code',
    scope: 'openid profile email',
    showDebugInformation: false,
    requireHttps: true
  },
};
