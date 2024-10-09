import { secretsUpdatesListener } from '~/src/api/lambda/secrets-updates-listener'

const secretsUpdatesPlugin = {
  plugin: {
    name: 'secretUpdatesPlugin',
    version: '1.0.0',
    register: function (server) {
      secretsUpdatesListener(server)
    }
  }
}

export { secretsUpdatesPlugin }
