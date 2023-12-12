import { deploymentEventListener } from '~/src/api/ecs/listen-deployment-events'

const deploymentEventsPlugin = {
  plugin: {
    name: 'deploymentEventsPlugin',
    version: '1.0.0',
    register: function (server) {
      deploymentEventListener(server)
    }
  }
}

export { deploymentEventsPlugin }
