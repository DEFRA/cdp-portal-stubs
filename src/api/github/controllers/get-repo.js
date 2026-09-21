import { generateRepoData } from '~/src/api/github/content/repo-data'
import { githubRepos } from '~/src/config/mock-data'

const getRepoController = {
  handler: async (request, h) => {
    const { org, repo } = request.params

    if (githubRepos.some((githubRepo) => repo === githubRepo.name)) {
      return h
        .response(generateRepoData(org, repo))
        .header('x-oauth-scopes', 'TODO')
        .code(200)
    }

    return h
      .response({
        message: 'Not Found',
        documentation_url: 'https://docs.github.com/rest',
        status: '404'
      })
      .code(404)
  }
}

export { getRepoController }
