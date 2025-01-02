import { triggerEcrPush } from '~/src/api/admin/controllers/trigger-ecr-push'
import { oidcSessionController } from '~/src/api/admin/controllers/oidc-session-controller'
import { dataController } from '~/src/api/admin/controllers/data-controller'
import { triggerWorkflow } from '~/src/api/admin/controllers/trigger-workflow.js'

const adminStub = {
  plugin: {
    name: 'adminStub',
    register: async (server) => {
      server.route([
        {
          method: 'POST',
          path: '/_admin/trigger-ecr-push/{repo}/{tag}',
          options: { id: 'admin.trigger-ecr' },
          ...triggerEcrPush
        },
        {
          method: 'GET',
          path: '/_admin/oidc/sessions',
          options: { id: 'admin.sessions' },
          ...oidcSessionController
        },
        {
          method: 'GET',
          path: '/_admin/data',
          options: { id: 'admin.data' },
          ...dataController
        },
        {
          method: 'GET',
          path: '/_admin/trigger/{workflow}',
          ...triggerWorkflow
        }
      ])
    }
  }
}

export { adminStub }
