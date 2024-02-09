import { tenantServices } from '~/src/config/services'

const getTfSvcInfraFile = (path) => {
  if (path.endsWith('tenant_services.json')) {
    return tenantServices
  }

  if (path.endsWith('github_oidc_repositories.json')) {
    return Object.keys(tenantServices[0]).map((s) => 'DEFRA/' + s)
  }

  return null
}

export { getTfSvcInfraFile }
