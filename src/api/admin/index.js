import { triggerEcrPush } from '~/src/api/admin/controllers/trigger-ecr-push'

const adminStub = {
  plugin: {
    name: 'adminStub',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/_admin/trigger-ecr-push/{repo}/{tag}',
          ...triggerEcrPush
        }
      ])
    }
  }
}

export { adminStub }
