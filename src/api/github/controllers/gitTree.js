import { tenantServices } from '~/src/config/mock-data'

const gitTreeController = {
  handler: async (request, h) => {
    const repo = request.params.repo

    if (repo === 'cdp-tf-svc-infra') {
      request.payload?.tree.forEach((node) => {
        if (
          node.path === 'environments/management/resources/tenant_services.json'
        ) {
          tenantServices[0] = JSON.parse(node.content)[0]
        }
      })
    }

    return h.response({}).code(201)
  }
}

export { gitTreeController }
