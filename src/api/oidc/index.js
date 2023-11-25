import { oidcBasePath } from '~/src/api/oidc/oidc'
import { openIdConfigurationController } from '~/src/api/oidc/controllers/well-known-openid-configuration'
import { jwksController } from '~/src/api/oidc/controllers/well-known-jwks'
import { authorizeController } from '~/src/api/oidc/controllers/authorize-controller'
import { tokenController } from '~/src/api/oidc/controllers/token-controller'

const oidc = {
  plugin: {
    name: 'oidc',
    register: async (server) => {
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
          method: 'POST',
          path: `${oidcBasePath}/token`,
          ...tokenController
        }
      ])
    }
  }
}

export { oidc }
