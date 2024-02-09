import { ecrRepos, githubRepos, tenantServices } from '~/src/config/services'

const dataController = {
  handler: async (request, h) => {
    const data = {
      github: githubRepos,
      ecr: ecrRepos,
      tenants: tenantServices
    }

    return h.response(data).code(200)
  }
}

export { dataController }
