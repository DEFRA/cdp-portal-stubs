import { triggerEcrPush } from '~/src/api/admin/controllers/trigger-ecr-push'
import { oidcSessionController } from '~/src/api/admin/controllers/oidc-session-controller'

const adminStub = {
  plugin: {
    name: 'adminStub',
    register: async (server) => {
      server.route([
        {
          method: 'POST',
          path: '/_admin/trigger-ecr-push/{repo}/{tag}',
          ...triggerEcrPush
        },
        {
          method: 'GET',
          path: '/_admin/oidc/sessions',
          ...oidcSessionController
        }
      ])
    }
  }
}

export { adminStub }
