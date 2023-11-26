import { oidcBasePath } from '~/src/api/oidc/oidc-config'
import { openIdConfigurationController } from '~/src/api/oidc/controllers/well-known-openid-configuration'
import { jwksController } from '~/src/api/oidc/controllers/well-known-jwks'
import { authorizeController } from '~/src/api/oidc/controllers/authorize-controller'
import { tokenController } from '~/src/api/oidc/controllers/token-controller'
import { loadOIDCKeys } from '~/src/api/oidc/helpers/oidc-crypto'
import { loginController } from '~/src/api/oidc/controllers/login-controller'

const oidc = {
  plugin: {
    name: 'oidc',
    register: async (server) => {
      // generate/load the keys and decorate the server/request with them
      const keys = loadOIDCKeys()
      server.decorate('server', 'keys', keys)
      server.decorate('request', 'keys', keys)

      server.route([
        {
          method: 'GET',
          path: `${oidcBasePath}/.well-known/openid-configuration`,
          ...openIdConfigurationController
        },
        {
          method: 'GET',
          path: `${oidcBasePath}/.well-known/jwks.json`,
          ...jwksController
        },
        {
          method: 'GET',
          path: `${oidcBasePath}/authorize`,
          ...authorizeController
        },
        {
          method: 'GET',
          path: `${oidcBasePath}/login`,
          ...loginController
        },
        {
          method: 'POST',
          path: `${oidcBasePath}/token`,
          ...tokenController
        }
      ])
    }
  }
}

export { oidc }
