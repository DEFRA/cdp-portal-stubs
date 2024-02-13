import { deploymentEventListener } from '~/src/api/ecs/listen-deployment-events'
import { testRunEventListener } from '~/src/api/ecs/listen-testrun-events'

const deploymentEventsPlugin = {
  plugin: {
    name: 'deploymentEventsPlugin',
    version: '1.0.0',
    register: function (server) {
      deploymentEventListener(server)
      testRunEventListener(server)
    }
  }
}

export { deploymentEventsPlugin }
