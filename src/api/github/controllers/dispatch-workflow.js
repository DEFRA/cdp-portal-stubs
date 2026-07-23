import { ecrRepos, githubRepos, tenantServices } from '~/src/config/mock-data'
import { triggerWorkflowStatus } from '~/src/api/github/events/trigger-workflow-status'
import { populateEcrRepo } from '~/src/api/workflows/populate-ecr/populate-ecr'
import { triggerCdpAppConfig } from '~/src/api/workflows/cdp-app-config/trigger-cdp-app-config'
import {
  changeShutterState,
  createTenant
} from '~/src/api/platform-state-lambda/create-tenant'
import {
  sendPlatformStatePayload,
  sendPlatformStatePayloadForAllEnvs
} from '~/src/api/platform-state-lambda/send-platform-state-payload'
import Joi from 'joi'
import {
  createTeamValidator,
  removeTeamValidator,
  updateTeamValidator
} from '~/src/api/github/controllers/workflow-validators'
import { teamsAndUsers } from '~/src/config/teams-and-users'
import { triggerTeams } from '~/src/api/workflows/teams/trigger-teams'
import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'
import { config } from '~/src/config'
import { grafanaPlaygrounds } from '~/src/config/grafana-playground-state'
import crypto from 'crypto'
import { platformState } from '~/src/api/platform-state-lambda/platform-state'
import { environments } from '~/src/config/environments'

const dispatchWorkflow = {
  handler: async (request, h) => {
    const workflowRepo = request.params.repo
    let dispatchResponse = {}

    switch (workflowRepo) {
      case 'cdp-tenant-config':
        dispatchResponse = await handleCdpTenantConfigWorkflows(request)
        break
      case 'cdp-create-workflows':
        await handleCdpCreateWorkflows(request)
        break
      case 'cdp-grafana-modules':
        await handleGrafanaWorkflows(request)
        break
      case 'cdp-app-deployments':
      case 'cdp-tf-waf':
        await handleGenericWorkflows(request)
        break
      default:
        return h
          .response({ message: `unknown workflow ${workflowRepo}` })
          .code(400)
    }

    return h.response(dispatchResponse).code(200)
  }
}

const handleCdpTenantConfigWorkflows = async (request) => {
  const workflowFile = request.params.workflow
  const workflowRunId = config.get('workflowRunId') ?? Date.now()
  const workflowResponse = {
    workflow_run_id: workflowRunId,
    run_url: `https://api.github.com/repos/DEFRA/cdp-tenant-config/actions/runs/${workflowRunId}`,
    html_url: `https://github.com/DEFRA/cdp-tenant-config/actions/runs/${workflowRunId}`
  }

  switch (workflowFile) {
    case 'create-service.yml':
      await handleNewCdpCreateWorkflows(request)
      await handleCdpTenantConfigCreation(request)
      break
    case 'create-shuttering.yml':
      await shutterUrl(request, true)
      break
    case 'remove-shuttering.yml':
      await shutterUrl(request, false)
      break
    case 'remove-service.yml':
      // TODO: stub decommissioning
      break
    case 'create-team.yml':
      await handleCreateTeam(request)
      break
    case 'update-team.yml':
      await handleUpdateTeam(request)
      break
    case 'remove-team.yml':
      await handleDeleteTeam(request)
      break
    case 'generic-cdp-cli-workflow.yml':
      await handleGenericCdpCliWorkflow(request, workflowRunId)
      break
  }

  return workflowResponse
}

const handleGenericCdpCliWorkflow = async (request, workflowRunId) => {
  const inputs = request.payload.inputs ?? {}
  const runId = inputs.run_id ?? 'stub-run-id'
  const branch = inputs.use_branch ?? ''
  const commands = parseCommands(inputs.commands)
  const shouldFail = commands.some((command) =>
    command.toUpperCase().includes('BLOWUP')
  )

  if (!branch) return

  if (shouldFail) {
    const event = workflowEvent('resource-request-failed', {
      runId,
      workflowRunId: String(workflowRunId),
      workflowRunUrl: `https://github.com/DEFRA/cdp-tenant-config/actions/runs/${workflowRunId}`
    })

    await sendWorkflowEventsBatchMessage(
      [{ Id: crypto.randomUUID(), MessageBody: JSON.stringify(event) }],
      'resource-request-failed',
      request.sqs,
      1
    )
    return
  }

  const prNumber = 99
  const prUrl = `https://github.com/DEFRA/cdp-tenant-config/pull/${prNumber}`
  const event = workflowEvent('resource-request-pr', {
    runId,
    workflowRunId: String(workflowRunId),
    workflowRunUrl: `https://github.com/DEFRA/cdp-tenant-config/actions/runs/${workflowRunId}`,
    repository: 'DEFRA/cdp-tenant-config',
    branch,
    prUrl,
    prNumber
  })

  await sendWorkflowEventsBatchMessage(
    [{ Id: crypto.randomUUID(), MessageBody: JSON.stringify(event) }],
    'resource-request-pr',
    request.sqs,
    1
  )
}

function parseCommands(rawCommands) {
  if (!rawCommands) {
    return []
  }

  try {
    const parsed = JSON.parse(rawCommands)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
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

    if (workflowFile !== 'create_repository.yml') {
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
}

const handleNewCdpCreateWorkflows = async (request) => {
  const org = request.params.org
  const workflowFile = request.params.workflow
  const inputs = request.payload.inputs
  const repositoryName = inputs.service
  const tenantConfig = JSON.parse(inputs.config)

  if (repositoryName) {
    request.logger.info(
      `Stubbing triggering of workflow ${org}/cdp-create-workflows/${workflowFile} with inputs ${repositoryName}`
    )

    githubRepos.push({
      name: repositoryName,
      topics: [],
      team: tenantConfig.github_team,
      createdAt: new Date().toISOString()
    })

    if (workflowFile !== 'create_repository.yml') {
      if (ecrRepos[repositoryName] === undefined) {
        ecrRepos[repositoryName] = {
          tags: ['0.1.0', '0.2.0', '0.3.0'],
          runMode: 'job'
        }
      }

      await populateEcrRepo(request.sqs, repositoryName, 0)
    }
  }
}

const handleCdpTenantConfigCreation = async (request) => {
  /**
   * @type {{service:string, config: string, template_repo: string }}
   */
  const inputs = request.payload.inputs

  const tenantConfig = JSON.parse(inputs.config)

  request.logger.info(`Create-service workflow ${JSON.stringify(inputs)}`)

  // Create the new tenant in the global platform state
  createTenant(inputs.service, tenantConfig)
  await sendPlatformStatePayloadForAllEnvs(request.sqs)

  // simulate creating the terraform changes etc
  tenantServices[inputs.service] = {
    name: inputs.service,
    zone: tenantConfig.zone,
    mongo: tenantConfig.mongo_enabled,
    redis: tenantConfig.redis_enabled,
    service_code: tenantConfig.service_code ?? 'UNKNOWN',
    test_suite: tenantConfig.type === 'TestSuite' ? inputs.service : null
  }

  await handleNewCdpCreateWorkflows(request)
  await triggerCdpAppConfig(request.sqs, 2)
}

/**
 *
 * @params {payload: {inputs: {service_name: string, environment: string, url: string}}} request
 * @params {boolean} shutter
 */
async function shutterUrl(request, shutter) {
  const inputs = request.payload.inputs
  const environment = inputs.environment
  const service = inputs.service_name ?? inputs.service
  const url = inputs.url

  setTimeout(() => {
    changeShutterState(environment, service, url, shutter)
    sendPlatformStatePayload(request.sqs, environment, 1)
  }, 3000)
}

/**
 *
 * @param {{ service: string, url: string, environment: string }} inputs
 * @param workflowFile
 * @param request
 */
async function updateVanityUrl(inputs, workflowFile, request) {
  const environment = inputs.environment
  const service = inputs.service
  const url = inputs.url

  let shuttered
  if (workflowFile === 'shuttering-add.yml') {
    shuttered = true
  } else if (workflowFile === 'shuttering-remove.yml') {
    shuttered = false
  } else {
    request.logger.warn(
      'Unknown workflow file for vanity URL update:',
      workflowFile
    )
    return
  }

  setTimeout(() => {
    changeShutterState(environment, service, url, shuttered)
    sendPlatformStatePayload(request.sqs, environment, 1)
  }, 3000)
}

const handleGenericWorkflows = async (request, baseDelay = 0) => {
  const org = request.params.org
  const repo = request.params.repo
  const workflowFile = request.params.workflow
  const inputs = request.payload.inputs

  request.logger.info(
    `Stubbing triggering of workflow ${org}/${repo}/.github/workflows/${workflowFile} with inputs ${JSON.stringify(
      inputs
    )}`
  )

  switch (repo) {
    case 'cdp-tf-waf':
      await updateVanityUrl(inputs, workflowFile, request)
      break
  }
}

const handleGrafanaWorkflows = async (request) => {
  const org = request.params.org
  const repo = request.params.repo
  const workflowFile = request.params.workflow
  const inputs = request.payload.inputs

  request.logger.info(
    `Stubbing triggering of workflow ${org}/${repo}/.github/workflows/${workflowFile} with inputs ${JSON.stringify(
      inputs
    )}`
  )

  if (
    inputs.service_name &&
    grafanaPlaygrounds[inputs.service_name]?.dashboards
  ) {
    const playgroundData = grafanaPlaygrounds[inputs.service_name]

    const uid = inputs.dashboard_uid

    const dbIdx = playgroundData.dashboards.findIndex((d) => d.uid === uid)
    if (dbIdx === -1) {
      request.logger.error(`unable to find dashboard uid ${uid}`)
      return
    }

    playgroundData.dashboards[dbIdx].updated = Date.now()
    playgroundData.dashboards[dbIdx].promoted = true
    const db = playgroundData.dashboards[dbIdx]

    const slugParts = db.url.split('/')
    const slug = slugParts[slugParts.length - 1]
    const publishedUid = determinePromotedUid(inputs.service_name, slug)

    for (const env of environments) {
      if (!platformState[env][inputs.service_name]) {
        continue
      }
      const serviceData = platformState[env][inputs.service_name]?.tenant

      const idx = serviceData.metrics.findIndex((m) => m.uid === publishedUid)

      if (idx > 0) {
        platformState[env][inputs.service_name].tenant.metrics[idx].version += 1
      } else {
        platformState[env][inputs.service_name].tenant.metrics.push({
          url: `https://metrics.${env}.cdp-int.defra.cloud/d/${inputs.service_name}/${publishedUid}`,
          type: 'custom',
          uid: publishedUid,
          scope: '',
          version: 1
        })
      }
      request.logger.info(
        `promoted dashboard ${uid} -> ${publishedUid} in ${env}`
      )
      sendPlatformStatePayload(request.sqs, env, 0)
    }
  }
}

const handleCreateTeam = async (request) => {
  const inputs = request.payload.inputs
  request.logger.info(`Create Team ${JSON.stringify(inputs)}`)
  Joi.assert(inputs, createTeamValidator)
  if (!teamsAndUsers.teams.some((t) => t.team_id === inputs.team_id)) {
    teamsAndUsers.teams.push(inputs)
  }

  await triggerTeams(request.sqs)
}

const handleUpdateTeam = async (request) => {
  const inputs = request.payload.inputs
  request.logger.info(`Update Team ${JSON.stringify(inputs)}`)
  Joi.assert(inputs, updateTeamValidator)

  const idx = teamsAndUsers.teams.findIndex((t) => t.team_id === inputs.team_id)

  if (idx === -1) {
    throw new Error(`Team ${inputs.team_id} not found`)
  }

  for (const key of Object.keys(inputs)) {
    if (key === 'team_id') continue
    teamsAndUsers.teams[idx][key] = inputs[key]
  }

  await triggerTeams(request.sqs)
}

const handleDeleteTeam = async (request) => {
  const inputs = request.payload.inputs
  request.logger.info(`Delete Team ${JSON.stringify(inputs)}`)
  Joi.assert(inputs, removeTeamValidator)
  teamsAndUsers.teams = teamsAndUsers.teams.filter(
    (t) => t.team_id !== inputs.team_id
  )

  await triggerTeams(request.sqs)
}

function determinePromotedUid(folderName, slug) {
  const parts = slug.split('-')
  const title = `${folderName} (${parts[parts.length - 1]})`
  const digest = crypto
    .createHash('sha1')
    .update(title)
    .digest('hex')
    .slice(0, 8)

  // Leave room for "-<hash>"
  const maxSlugLen = 40 - digest.length - 1
  return `${slug.slice(0, maxSlugLen)}-${digest}`
}
export { dispatchWorkflow }
