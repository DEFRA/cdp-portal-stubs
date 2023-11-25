import { oidcConfig } from '~/src/api/oidc/oidc'
import { validateScope } from '~/src/api/oidc/helpers/validate-scope'
import { newSession } from '~/src/api/oidc/helpers/session-store'

const authorizeController = {
  handler: (request, h) => {
    // TODO check these are all set, use joi or something
    const clientId = request.query.client_id
    const responseType = request.query.response_type
    const redirectUri = request.query.redirect_uri
    const state = request.query.state
    const scope = request.query.scope
    const codeChallengeMethod = request.query.code_challenge_method

    // validate request
    const unsupportedScopes = validateScope(scope)
    if (unsupportedScopes.length > 0) {
      return h
        .response(`Unsupported scopes ${unsupportedScopes.join(',')}`)
        .code(400)
    }

    if (clientId !== oidcConfig.clientId) {
      return h.response(`Invalid client id ${clientId}`).code(401)
    }

    if (!oidcConfig.responseTypesSupported.includes(responseType)) {
      return h.response(`Unsupported response type ${responseType}`).code(400)
    }

    if (
      codeChallengeMethod &&
      !oidcConfig.codeChallengeMethodsSupported.includes(codeChallengeMethod)
    ) {
      return h
        .response(`Unsupported code_challenge_method  ${codeChallengeMethod}`)
        .code(400)
    }

    // create session
    // TODO we should load the users from some sort of config
    const user = {
      id: '62bb35d2-d4f2-4cf6-abd3-262d99727677', // TODO: what should this be, refer to example configs
      username: 'Test User'
    }
    const session = newSession(
      scope,
      request.query.nonce,
      user,
      request.query.code_challenge,
      request.query.code_challenge_method
    )

    const location = new URL(redirectUri)
    location.searchParams.append('code', session.sessionId)
    location.searchParams.append('state', state)
    return h.redirect(location.toString())
  }
}

export { authorizeController }
