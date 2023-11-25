import { JWKS } from '~/src/api/oidc/helpers/oidc-crypto'
import { keyPair } from '~/src/api/oidc/oidc'

const jwksController = {
  handler: (request, h) => {
    return h.response(JWKS(keyPair.publicKey)).code(200)
  }
}

export { jwksController }
