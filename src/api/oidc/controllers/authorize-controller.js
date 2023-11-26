import { oidcBasePath, oidcConfig } from '~/src/api/oidc/oidc-config'
import { validateScope } from '~/src/api/oidc/helpers/validate-scope'
import { newSession } from '~/src/api/oidc/helpers/session-store'
import { allUsers } from '~/src/api/oidc/helpers/users'

const authorizeController = {
  handler: (request, h) => {
    // a bit of a hack, but basically if the user propery hasn't been set
    // show a 'login' page where they can select which fake user they want
    if (request.query.user === undefined) {
      const fullUrl = new URL(request.url)
      const page = `
        <h1>Login</h1>
        ${Object.keys(allUsers).map(
          (u) =>
            '<a href="' +
            oidcBasePath +
            '/authorize' +
            fullUrl.search +
            '&user=' +
            u +
            '">' +
            u +
            '</a>'
        )}
        `
      return h.response(page).header('content-type', 'text/html').code(200)
    }

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

    const user = allUsers[request.query.user]
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
    location.searchParams.append('state', state)
    return h.redirect(location.toString())
  }
}

export { authorizeController }
