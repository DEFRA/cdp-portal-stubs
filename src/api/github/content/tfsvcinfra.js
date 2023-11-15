import {
  allServices,
  protectedServices,
  publicServices
} from '~/src/config/services'

const getTfSvcInfraFile = (path) => {
  if (path.endsWith('tenant_services.json')) {
    const data = {}
    publicServices.forEach((s) => {
      data[s] = {
        zone: 'public',
        redis: true
      }
    })

    protectedServices.forEach((s) => {
      data[s] = {
        zone: 'protected',
        mongo: true
      }
    })
    return [data]
  }

  if (path.endsWith('github_oidc_repositories.json')) {
    return allServices().map((s) => 'DEFRA/' + s)
  }

  return null
}

export { getTfSvcInfraFile }
