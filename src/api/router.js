import { health } from '~/src/api/health'
import { githubStub } from '~/src/api/github'
import { ecrStub } from '~/src/api/ecr'
import { adminStub } from '~/src/api/admin'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health, githubStub, ecrStub, adminStub])
    }
  }
}

export { router }
