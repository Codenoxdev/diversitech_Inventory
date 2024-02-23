export default {
  meEndpoint: '/auth/me',

  loginEndpoint: '/jwt/login',

  // loginEndpoint: '/api/Login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
