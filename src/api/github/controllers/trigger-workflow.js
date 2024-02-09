import { triggerCreateRepoWorkflow } from '~/src/api/github/events/trigger-create-repo-workflow'
import {
  githubRepos,
  topicsService,
  topicsTestSuite
} from '~/src/config/services'

const triggerWorkflow = {
  handler: async (request, h) => {
    const org = request.params.org
    const repo = request.params.repo
    const workflowFile = request.params.workflow
    const inputs = request.payload.inputs
    const repositoryName = inputs.repositoryName

    request.logger.info(
      `Stubbing triggering of workflow ${org}/${repo} ${workflowFile} with inputs ${JSON.stringify(
        inputs
      )}`
    )

    await triggerCreateRepoWorkflow(request.sqs, repositoryName)

    if (workflowFile === 'create_microservice.yml') {
      request.logger.info(`Adding service ${repositoryName} to github repos`)
      githubRepos.push({ name: repositoryName, topics: topicsService })
    }

    if (workflowFile === 'create_env_test_suite.yml') {
      request.logger.info(`Adding test suite ${repositoryName} to github repos`)
      githubRepos.push({ name: repositoryName, topics: topicsTestSuite })
    }

    return h.response({}).code(200)
  }
}

export { triggerWorkflow }
