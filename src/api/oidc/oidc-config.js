import { config } from '~/src/config'
const oidcBasePath = config.get('oidcBasePath')
const clientId = config.get('oidcClientId')

const oidcConfig = {
  clientId,
  clientSecret: config.get('oidcClientSecret'),
  issuerBase: oidcBasePath,
  authorizationEndpoint: `${oidcBasePath}/authorize`,
  tokenEndpoint: `${oidcBasePath}/token`,
  userinfoEndpoint: `${oidcBasePath}/userinfo`,
  jwksEndpoint: `${oidcBasePath}/.well-known/jwks.json`,
  discoveryEndpoint: `${oidcBasePath}/.well-known/openid-configuration`,

  openidScope: 'openid',

  grantTypesSupported: [
    'authorization_code',
    'refresh_token',
    'client_credentials'
  ],
  responseTypesSupported: ['code'],
  subjectTypesSupported: ['public'],

  idTokenSigningAlgValuesSupported: ['RS256'],

  scopesSupported: [
    'openid',
    'email',
    'groups',
    'profile',
    `api://${clientId}/cdp.user`,
    'offline_access',
    'user.read'
  ],

  tokenEndpointAuthMethodsSupported: [
    'client_secret_basic',
    'client_secret_post'
  ],

  claimsSupported: [
    'sub',
    'email',
    'email_verified',
    'preferred_username',
    'phone_number',
    'address',
    'groups',
    'iss',
    'aud'
  ],
  codeChallengeMethodsSupported: ['plain', 'S256'],
  ttl: 3600, // seconds
  refreshTtl: 3600
}

export { oidcConfig, oidcBasePath }
