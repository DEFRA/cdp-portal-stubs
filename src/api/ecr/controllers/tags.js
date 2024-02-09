import { ecrRepos } from '~/src/config/services'

const tagsController = {
  handler: async (request, h) => {
    const repo = request.params.repo

    if (ecrRepos[repo] === undefined) {
      return h.response({ message: 'unknown repo' }).code(404)
    }

    const payload = {
      name: repo,
      tags: ecrRepos[repo]
    }

    return h.response(JSON.stringify(payload)).code(200)
  }
}

export { tagsController }
