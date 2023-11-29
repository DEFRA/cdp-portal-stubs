import { sessions } from '~/src/api/oidc/helpers/session-store'

const oidcSessionController = {
  handler: async (request, h) => {
    return h.response(sessions).code(200)
  }
}

export { oidcSessionController }
