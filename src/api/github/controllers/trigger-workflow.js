import { ecrRepos, githubRepos, tenantServices } from '~/src/config/mock-data'
import { triggerWorkflowStatus } from '~/src/api/github/events/trigger-workflow-status'
import { triggerTenantServices } from '~/src/api/workflows/tenant-services/trigger-tenant-services'
import { populateEcrRepo } from '~/src/api/workflows/populate-ecr/populate-ecr'

const triggerWorkflow = {
  handler: async (request, h) => {
    const workflowRepo = request.params.repo
    switch (workflowRepo) {
      case 'cdp-create-workflows':
        await handleCdpCreateWorkflows(request)
        break
      case 'cdp-squid-proxy':
      case 'cdp-grafana-svc':
      case 'cdp-app-config':
      case 'cdp-nginx-upstreams':
      case 'cdp-app-deployments':
        await handleGenericWorkflows(request)
        break
      case 'cdp-tf-svc-infra':
        await handleServiceCreation(request)
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
  const topics = (inputs.additionalGitHubTopics?.split(',') ?? []).map((t) => {
    return { topic: { name: t } }
  })

  request.logger.info(
    `Stubbing triggering of workflow ${org}/cdp-create-workflows/${workflowFile} with inputs ${JSON.stringify(
      inputs
    )}`
  )

  githubRepos.push({
    name: repositoryName,
    topics,
    team: inputs.team,
    createdAt: new Date().toISOString()
  })

  switch (workflowFile) {
    case 'create_microservice.yml':
      if (ecrRepos[repositoryName] === undefined) {
        ecrRepos[repositoryName] = {
          tags: ['0.1.0', '0.2.0', '0.3.0'],
          runMode: 'service'
        }
      }
      break
    case 'create_journey_test_suite.yml':
    case 'create_perf_test_suite.yml':
      if (ecrRepos[repositoryName] === undefined) {
        ecrRepos[repositoryName] = {
          tags: ['0.1.0', '0.2.0', '0.3.0'],
          runMode: 'job'
        }
      }
      break
  }

  await populateEcrRepo(request.sqs, repositoryName, 0)

  await triggerWorkflowStatus(
    request.sqs,
    'cdp-create-workflows',
    workflowFile,
    repositoryName,
    'completed',
    'success',
    1
  )
}

const handleServiceCreation = async (request) => {
  /**
   * @type {{service:string, type:string, zone:string, mongo_enabled: boolean, redis_enabled: boolean, service_code:string, test_suite: string|null }}
   */
  const inputs = request.payload.inputs
  // simulate creating the terraform changes etc
  tenantServices[inputs.service] = {
    name: inputs.service,
    zone: inputs.zone,
    mongo: Boolean(inputs.mongo_enabled),
    redis: Boolean(inputs.redis_enabled),
    service_code: inputs.service_code,
    test_suite: inputs.test_suite
  }

  await handleGenericWorkflows(request, 1)
  await triggerWorkflowStatus(
    request.sqs,
    'cdp-tf-svc-infra',
    '.github/workflows/manual.yml',
    'Manual Apply',
    'completed',
    'success',
    4
  )
  await triggerTenantServices(request.sqs, 1)
  await triggerWorkflowStatus(
    request.sqs,
    'cdp-tf-svc-infra',
    '.github/workflows/notify-portal.yml',
    'Notify Portal',
    'completed',
    'success',
    5
  )
}

const handleGenericWorkflows = async (request, baseDelay = 0) => {
  const org = request.params.org
  const repo = request.params.repo
  const workflowFile = request.params.workflow
  const inputs = request.payload.inputs
  const service = inputs?.service || inputs?.repositoryName

  request.logger.info(
    `Stubbing triggering of workflow ${org}/${repo}/.github/workflows/${workflowFile} with inputs ${JSON.stringify(
      inputs
    )}`
  )

  // Future stubbing
  // If we need to support different workflows on the same repo (i.e. create-s3-bucket.yml) we can
  // check the workflow file: e.g. `if (workflowFile === 'create-service.yml') {}`

  request.logger.info(`Adding service ${service} to ${repo}`)

  await triggerWorkflowStatus(
    request.sqs,
    repo,
    workflowFile,
    service,
    'requested',
    null,
    0
  )

  await triggerWorkflowStatus(
    request.sqs,
    repo,
    workflowFile,
    service,
    'in_progress',
    null,
    baseDelay + 1
  )

  await triggerWorkflowStatus(
    request.sqs,
    repo,
    workflowFile,
    service,
    'completed',
    'success',
    baseDelay + 2
  )
}

export { triggerWorkflow }
