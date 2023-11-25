import { oidcConfig } from '~/src/api/oidc/oidc'

const validateScope = (scope) => {
  const scopes = scope.split(' ')
  return scopes.filter((s) => !oidcConfig.scopesSupported.includes(s))
}

export { validateScope }
