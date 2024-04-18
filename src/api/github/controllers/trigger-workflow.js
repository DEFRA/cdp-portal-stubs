import { triggerCreateRepoWorkflow } from '~/src/api/github/events/trigger-create-repo-workflow'
import {
  ecrRepos,
  githubRepos,
  topicsPerfTestSuite,
  topicsService,
  topicsTestSuite
} from '~/src/config/mock-data'

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

      // technically this should happen on the TF-svc stage but its easier to
      // detect the service type+name here
      if (ecrRepos[repositoryName] === undefined) {
        ecrRepos[repositoryName] = { tags: [], runMode: 'service' }
      }
    }

    if (workflowFile === 'create_env_test_suite.yml') {
      request.logger.info(`Adding test suite ${repositoryName} to github repos`)
      githubRepos.push({ name: repositoryName, topics: topicsTestSuite })

      if (ecrRepos[repositoryName] === undefined) {
        ecrRepos[repositoryName] = { tags: [], runMode: 'job' }
      }
    }

    if (workflowFile === 'create_perf_test_suite.yml') {
      request.logger.info(
        `Adding perf test suite ${repositoryName} to github repos`
      )
      githubRepos.push({ name: repositoryName, topics: topicsPerfTestSuite })

      if (ecrRepos[repositoryName] === undefined) {
        ecrRepos[repositoryName] = { tags: [], runMode: 'job' }
      }
    }

    return h.response({}).code(200)
  }
}

export { triggerWorkflow }
