import { getContentController } from '~/src/api/github/controllers/get-content'

const githubStub = {
  plugin: {
    name: 'githubStub',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/repos/{org}/{repo}/contents/{path}',
          ...getContentController
        }
      ])
    }
  }
}

export { githubStub }
