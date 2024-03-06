import { ecrRepos } from '~/src/config/mock-data'

const tagsController = {
  handler: async (request, h) => {
    const repo = request.params.repo

    if (ecrRepos[repo]?.tags === undefined) {
      return h.response({ message: 'unknown repo' }).code(404)
    }

    const payload = {
      name: repo,
      tags: ecrRepos[repo]?.tags
    }

    return h.response(JSON.stringify(payload)).code(200)
  }
}

export { tagsController }
