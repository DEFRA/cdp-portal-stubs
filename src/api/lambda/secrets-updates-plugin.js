import { secretUpdatesListener } from '~/src/api/lambda/secrets-updates-listener'

const secretUpdatesPlugin = {
  plugin: {
    name: 'secretUpdatesPlugin',
    version: '1.0.0',
    register: function (server) {
      secretUpdatesListener(server)
    }
  }
}

export { secretUpdatesPlugin }
