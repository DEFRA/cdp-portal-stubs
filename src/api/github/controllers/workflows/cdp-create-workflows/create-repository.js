import { githubRepos } from '~/src/config/mock-data'

export async function createRepository(request, inputs) {
  const repositoryName = inputs.repositoryName

  if (!repositoryName) {
    throw Error('Missing repository name')
  }

  githubRepos.push({
    name: repositoryName,
    topics: [],
    team: inputs.team,
    createdAt: new Date().toISOString()
  })
}
