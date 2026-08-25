import {
  addSecretKeyValuePairController,
  removeSecretKeyValuePairController
} from '~/src/api/secrets/controller'

const secretsStub = {
  plugin: {
    name: 'secretsStub',
    register: async (server) => {
      server.route([
        {
          method: 'POST',
          path: '/secrets/add-key-value-pair',
          ...addSecretKeyValuePairController
        },
        {
          method: 'POST',
          path: '/secrets/remove-key-value-pair',
          ...removeSecretKeyValuePairController
        }
      ])
    }
  }
}

export { secretsStub }
