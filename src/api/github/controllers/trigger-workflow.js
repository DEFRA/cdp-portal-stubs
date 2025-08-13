import {
  ecrRepos,
  githubRepos,
  tenantServices,
  vanityUrls
} from '~/src/config/mock-data'
import { triggerWorkflowStatus } from '~/src/api/github/events/trigger-workflow-status'
import { triggerTenantServices } from '~/src/api/workflows/tenant-services/trigger-tenant-services'
import { populateEcrRepo } from '~/src/api/workflows/populate-ecr/populate-ecr'
import { triggerCdpAppConfig } from '~/src/api/workflows/cdp-app-config/trigger-cdp-app-config'
import { triggerSquidProxy } from '~/src/api/workflows/cdp-squid-proxy/trigger-cdp-squid-proxy'
import { triggerNginxUpstreams } from '~/src/api/workflows/cdp-nginx-upstreams/trigger-nginx-upstreams'
import { triggerGrafanaSvc } from '~/src/api/workflows/cdp-grafana-svc/trigger-grafana-svc'
import { triggerShutteredVanityUrls } from '~/src/api/workflows/cdp-tf-waf/trigger-shuttered-vanity-urls'

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
      case 'cdp-tf-waf':
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
  if (repositoryName) {
    const topics = (inputs.additionalGitHubTopics?.split(',') ?? []).map(
      (t) => {
        return { topic: { name: t } }
      }
    )

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
    30
  )
}

function updateVanityUrl(inputs, workflowFile, logger) {
  const environment = inputs.environment
  const vanityUrlsForEnv = vanityUrls[environment] ?? []
  let shuttered
  if (workflowFile === 'shuttering-add.yml') {
    shuttered = true
  } else if (workflowFile === 'shuttering-remove.yml') {
    shuttered = false
  } else {
    logger.warn('Unknown workflow file for vanity URL update:', workflowFile)
    return
  }

  const vanityUrl = {
    service: inputs.service,
    url: inputs.url,
    shuttered,
    enabled: inputs.waf.startsWith('internal')
  }

  const existingIndex = vanityUrlsForEnv.findIndex(
    (s) => s.service === vanityUrl.service && s.url === vanityUrl.url
  )

  if (existingIndex !== -1) {
    vanityUrlsForEnv[existingIndex] = vanityUrl
  } else {
    vanityUrlsForEnv.push(vanityUrl)
  }

  vanityUrls[environment] = vanityUrlsForEnv
}

const handleGenericWorkflows = async (request, baseDelay = 0) => {
  const org = request.params.org
  const repo = request.params.repo
  const workflowFile = request.params.workflow
  const inputs = request.payload.inputs
  const service =
    inputs?.service || inputs?.repositoryName || inputs?.serviceName

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

  switch (repo) {
    case 'cdp-app-config':
      await triggerCdpAppConfig(request.sqs, baseDelay + 3)
      break
    case 'cdp-squid-proxy':
      await triggerSquidProxy(request.sqs, baseDelay + 3)
      break
    case 'cdp-nginx-upstreams':
      await triggerNginxUpstreams(request.sqs, baseDelay + 3)
      break
    case 'cdp-grafana-svc':
      await triggerGrafanaSvc(request.sqs, baseDelay + 3)
      break
    case 'cdp-tf-waf':
      updateVanityUrl(inputs, workflowFile, request.logger)
      // Long delay to simulate the time taken to update vanity URLs, and allow UI to update
      await triggerShutteredVanityUrls(request.sqs, baseDelay + 10)
      break
  }
}

export { triggerWorkflow }
