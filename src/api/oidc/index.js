import { oidcBasePath } from '~/src/api/oidc/oidc-config'
import { openIdConfigurationController } from '~/src/api/oidc/controllers/well-known-openid-configuration'
import { jwksController } from '~/src/api/oidc/controllers/well-known-jwks'
import { authorizeController } from '~/src/api/oidc/controllers/authorize-controller'
import { tokenController } from '~/src/api/oidc/controllers/token-controller'
import {
  generateRandomKeypair,
  loadKeyPair
} from '~/src/api/oidc/helpers/oidc-crypto'
import { userInfoController } from '~/src/api/oidc/controllers/user-info-controller'
import { config } from '~/src/config'

const oidc = {
  plugin: {
    name: 'oidc',
    register: async (server) => {
      const cfgPubKey = config.get('oidcPublicKeyBase64')
      const cfgPrivKey = config.get('oidcPrivateKeyBase64')

      let keys
      if (cfgPubKey && cfgPrivKey) {
        server.logger.info('loading keys from config')
        keys = loadKeyPair(
          Buffer.from(cfgPubKey, 'base64'),
          Buffer.from(cfgPrivKey, 'base64')
        )
      } else {
        server.logger.info('generating random keys')
        keys = generateRandomKeypair()
      }
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
          method: 'POST',
          path: `${oidcBasePath}/token`,
          ...tokenController
        },
        {
          method: 'GET',
          path: `${oidcBasePath}/user-info`,
          ...userInfoController
        }
      ])
    }
  }
}

export { oidc }
