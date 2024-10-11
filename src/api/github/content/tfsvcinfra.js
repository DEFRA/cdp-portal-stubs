import { tenantServices } from '~/src/config/mock-data'

const getTfSvcInfraFile = (path) => {
  if (path.includes('environments') && path.endsWith('.json')) {
    const fileName = path.split('/').pop()
    const serviceName = fileName?.split('.').at(0)
    return tenantServices[0][serviceName]
  }

  if (path.endsWith('github_oidc_repositories.json')) {
    return Object.keys(tenantServices[0]).map((s) => 'DEFRA/' + s)
  }

  return null
}

export { getTfSvcInfraFile }
