import { blobController } from '~/src/api/ecr/controllers/blobs'
import { manifestController } from '~/src/api/ecr/controllers/manifest'
import { tagsController } from '~/src/api/ecr/controllers/tags'

const ecrStub = {
  plugin: {
    name: 'ecrStub',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/v2/{repo}/tags/list',
          ...tagsController
        },
        {
          method: 'GET',
          path: '/v2/{repo}/manifests/{tag}',
          ...manifestController
        },
        {
          method: 'GET',
          path: '/v2/{repo}/blobs/{blobId}',
          ...blobController
        }
      ])
    }
  }
}

export { ecrStub }
