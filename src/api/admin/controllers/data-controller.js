import { ecrRepos, githubRepos, tenantServices } from '~/src/config/mock-data'
import { sessions } from '~/src/api/oidc/helpers/session-store'

const dataController = {
  handler: async (request, h) => {
    const data = {
      github: githubRepos,
      ecr: ecrRepos,
      tenants: tenantServices,
      sessions
    }

    return h.response(data).code(200)
  }
}

export { dataController }
