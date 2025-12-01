import { oidcConfig } from '~/src/api/oidc/oidc-config'
import { validateScope } from '~/src/api/oidc/helpers/validate-scope'
import { newSession } from '~/src/api/oidc/helpers/session-store'
import { allUsers } from '~/src/api/oidc/helpers/users'
import { renderLoginPage } from '~/src/api/oidc/helpers/render-login-page'
import { config } from '~/src/config'

const authorizeController = {
  handler: (request, h) => {
    // a bit of a hack, but basically if the user param hasn't been set
    // show a 'login' page where they can select which fake user they want

    let loginUser = 'admin'
    if (config.get('oidcShowLogin')) {
      if (request.query.user === undefined) {
        return renderLoginPage(request.url, h)
      }
      loginUser = request.query.user
    }

    // TODO check these are all set, use joi or something
    const clientId = request.query.client_id
    const responseType = request.query.response_type
    const redirectUri = request.query.redirect_uri
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

    const user = allUsers[loginUser]
    if (user === undefined) {
      request.logger.error(`Invalid user selected ${request.query.user}`)
      return h.response(`Invalid user selection!`).code(400)
    }

    // create session
    const session = newSession(
      scope,
      request.query.nonce,
      user,
      request.query.code_challenge,
      request.query.code_challenge_method
    )

    const location = new URL(redirectUri)
    location.searchParams.append('code', session.sessionId)
    return h.redirect(location.toString())
  }
}

export { authorizeController }
