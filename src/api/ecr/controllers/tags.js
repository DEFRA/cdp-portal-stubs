import { versions } from '~/src/config/services'

const tagsController = {
  handler: async (request, h) => {
    const repo = request.params.repo

    const payload = {
      name: repo,
      tags: versions
    }

    return h.response(JSON.stringify(payload)).code(200)
  }
}

export { tagsController }
