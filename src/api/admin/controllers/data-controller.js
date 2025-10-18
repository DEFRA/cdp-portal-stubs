import { ecrRepos, githubRepos, tenantServices } from '~/src/config/mock-data'
import { sessions } from '~/src/api/oidc/helpers/session-store'
import { platformState } from '~/src/api/platform-state-lambda/platform-state'

const dataController = {
  handler: async (request, h) => {
    const data = {
      github: githubRepos,
      ecr: ecrRepos,
      tenants: tenantServices,
      sessions,
      platform: platformState
    }

    return h.response(data).code(200)
  }
}

export { dataController }
