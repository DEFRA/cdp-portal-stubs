import { health } from '~/src/api/health'
import { githubStub } from '~/src/api/github'
import { ecrStub } from '~/src/api/ecr'
import { adminStub } from '~/src/api/admin'
import { oidc } from '~/src/api/oidc'
import { aadStub } from '~/src/api/aad'
import { pagerDutyStub } from '~/src/api/pagerduty'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([
        health,
        githubStub,
        ecrStub,
        adminStub,
        oidc,
        aadStub,
        pagerDutyStub
      ])
    }
  }
}

export { router }
