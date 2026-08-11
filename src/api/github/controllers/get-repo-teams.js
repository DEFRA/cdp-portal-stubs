import { githubRepos } from '~/src/config/mock-data'

const getRepoTeamsController = {
  handler: async (request, h) => {
    const { repo } = request.params
    const githubRepo = githubRepos.find((r) => r.name === repo)

    if (!githubRepo) {
      return h.response([]).code(200)
    }

    return h.response([{ slug: githubRepo.team }]).code(200)
  }
}

export { getRepoTeamsController }
