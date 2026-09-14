import { getGrafanaPlaygroundsController } from '~/src/api/grafana-playgrounds/controller'

const grafanaPlaygroundsApiGatewayStub = {
  plugin: {
    name: 'grafanaPlaygroundsStub',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/grafana/playgrounds/{service}',
          ...getGrafanaPlaygroundsController
        }
      ])
    }
  }
}

export { grafanaPlaygroundsApiGatewayStub }
