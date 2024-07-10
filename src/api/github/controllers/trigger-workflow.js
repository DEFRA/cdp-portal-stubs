import {
  ecrRepos,
  githubRepos,
  topicsPerfTestSuite,
  topicsService,
  topicsTestSuite
} from '~/src/config/mock-data'
import { triggerWorkflowStatus } from '~/src/api/github/events/trigger-workflow-status'

const triggerWorkflow = {
  handler: async (request, h) => {
    const workflowRepo = request.params.repo
    switch (workflowRepo) {
      case 'cdp-create-workflows':
        await handleCdpCreateWorkflows(request)
        break
      case 'cdp-squid-proxy':
        await handleSquidWorkflows(request)
        break
      case 'cdp-grafana-svc':
        await handleDashboardWorkflow(request)
        break
      default:
        return h
          .response({ message: `unknown workflow ${workflowRepo}` })
          .code(400)
    }

    return h.response({}).code(200)
  }
}

const handleCdpCreateWorkflows = async (request) => {
  const org = request.params.org
  const workflowFile = request.params.workflow
  const inputs = request.payload.inputs
  const repositoryName = inputs.repositoryName

  request.logger.info(
    `Stubbing triggering of workflow ${org}/cdp-create-workflows/${workflowFile} with inputs ${JSON.stringify(
      inputs
    )}`
  )

  await triggerWorkflowStatus(
    request.sqs,
    'cdp-create-workflows',
    repositoryName,
    'completed',
    'success',
    1
  )
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
}

const handleSquidWorkflows = async (request) => {
  const org = request.params.org
  const workflowFile = request.params.workflow
  const inputs = request.payload.inputs
  const service = inputs.service

  request.logger.info(
    `Stubbing triggering of workflow ${org}/cdp-squid-proxy/${workflowFile} with inputs ${JSON.stringify(
      inputs
    )}`
  )

  if (workflowFile === 'create_service.yml') {
    request.logger.info(`Adding service ${service} to squid config`)
    await triggerWorkflowStatus(
      request.sqs,
      'cdp-squid-proxy',
      service,
      'requested',
      null,
      0
    )

    await triggerWorkflowStatus(
      request.sqs,
      'cdp-squid-proxy',
      service,
      'in_progress',
      null,
      1
    )

    await triggerWorkflowStatus(
      request.sqs,
      'cdp-squid-proxy',
      service,
      'completed',
      'success',
      2
    )
  }
}

const handleDashboardWorkflow = async (request) => {
  const org = request.params.org
  const workflowRepo = request.params.repo
  const workflowFile = request.params.workflow
  const inputs = request.payload.inputs
  const service = inputs.service

  request.logger.info(
    `Stubbing triggering of workflow ${org}/${workflowRepo}/${workflowFile} with inputs ${JSON.stringify(
      inputs
    )}`
  )

  if (workflowFile === 'create-dashboards-conf.yml') {
    request.logger.info(`Adding service ${service} to dashboard config`)
    await triggerWorkflowStatus(
      request.sqs,
      workflowRepo,
      service,
      'requested',
      null,
      0
    )

    await triggerWorkflowStatus(
      request.sqs,
      workflowRepo,
      service,
      'in_progress',
      null,
      1
    )

    await triggerWorkflowStatus(
      request.sqs,
      workflowRepo,
      service,
      'completed',
      'success',
      2
    )
  }
}

export { triggerWorkflow }
