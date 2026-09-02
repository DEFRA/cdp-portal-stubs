import { getGrafanaPlaygroundsController } from '~/src/api/grafana-playgrounds/controller'

const grafanaPlaygroundsStub = {
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

export { grafanaPlaygroundsStub }
