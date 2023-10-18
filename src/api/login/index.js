import { keysController } from '~/src/api/login/controllers/login-stub'

const loginStub = {
  plugin: {
    name: 'loginStub',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/login-stub/6f504113-6b64-43f2-ade9-242e05780007/discovery/v2.0/keys',
          ...keysController
        }
      ])
    }
  }
}

export { loginStub }
