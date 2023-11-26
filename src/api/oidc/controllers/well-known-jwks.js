import { JWKS } from '~/src/api/oidc/helpers/oidc-crypto'

const jwksController = {
  handler: (request, h) => {
    return h.response(JWKS(request.keys)).code(200)
  }
}

export { jwksController }
