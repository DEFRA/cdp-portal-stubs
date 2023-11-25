import { oidcConfig } from '~/src/api/oidc/oidc'

const generateConfig = () => {
  return {
    issuer: oidcConfig.issuerBase,
    authorization_endpoint: oidcConfig.authorizationEndpoint,
    pushed_authorization_request_endpoint: `${oidcConfig.issuerBase}/par`,
    token_endpoint: oidcConfig.tokenEndpoint,
    jwks_uri: oidcConfig.jwksEndpoint,
    userinfo_endpoint: oidcConfig.userinfoEndpoint,
    introspection_endpoint: `${oidcConfig.issuerBase}/introspect`,
    grant_types_supported: oidcConfig.grantTypesSupported,
    response_types_supported: oidcConfig.responseTypesSupported,
    subject_types_supported: oidcConfig.subjectTypesSupported,
    id_token_signing_alg_values_supported:
      oidcConfig.idTokenSigningAlgValuesSupported,
    scopes_supported: oidcConfig.scopesSupported,
    token_endpoint_auth_methods_supported:
      oidcConfig.tokenEndpointAuthMethodsSupported,
    claims_supported: oidcConfig.claimsSupported,
    code_challenge_methods_supported: oidcConfig.claimsSupported
  }
}

const openIdConfigurationController = {
  handler: (request, h) => {
    return h.response(generateConfig()).code(200)
  }
}

export { openIdConfigurationController }
