import { ecrRepos, githubRepos } from '~/src/config/mock-data'
import { populateEcrRepo } from '~/src/api/workflows/populate-ecr/populate-ecr'

export async function createTemplatedRepository(request, inputs) {
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

  if (ecrRepos[repositoryName] === undefined) {
    ecrRepos[repositoryName] = {
      tags: ['0.1.0', '0.2.0', '0.3.0']
    }
  }

  await populateEcrRepo(request.sqs, repositoryName, 0)
}
