import { config } from '~/src/config'
import { promoteAlertWorkflow } from '~/src/api/github/controllers/workflows/cdp-grafana-svc/promote-advanced-alert'
import { promoteDashboardWorkflow } from '~/src/api/github/controllers/workflows/cdp-grafana-svc/promote-custom-dashboard'

import { deploySnow } from '~/src/api/github/controllers/workflows/cdp-deployments-snow/deploy'
import { createTemplatedRepository } from '~/src/api/github/controllers/workflows/cdp-create-workflows/create-templated-repository'
import { createRepository } from '~/src/api/github/controllers/workflows/cdp-create-workflows/create-repository'
import { archiveRepository } from '~/src/api/github/controllers/workflows/cdp-create-workflows/archive-repository'
import { genericCdpCliWorkflow } from '~/src/api/github/controllers/workflows/cdp-tenant-config/generic-cdp-cli-workflow'
import { cdpTenantConfigCreation } from '~/src/api/github/controllers/workflows/cdp-tenant-config/create-service'

const dispatchWorkflow = {
  handler: async (request, h) => {
    const workflowRepo = request.params.repo

    let dispatchResponse = {
      workflow_run_id: Date.now(),
      run_url: `https://api.github.com/repos/DEFRA/${workflowRepo}/actions/runs/1`,
      html_url: `https://github.com/DEFRA/${workflowRepo}/actions/runs/1`
    }

    switch (workflowRepo) {
      case 'cdp-tenant-config':
        dispatchResponse = await handleCdpTenantConfigWorkflows(request)
        break
      case 'cdp-create-workflows':
        await handleCdpCreateWorkflows(request)
        break
      case 'cdp-grafana-svc':
        await handleGrafanaWorkflows(request)
        break
      case 'cdp-deployments-snow':
        dispatchResponse = await handleSnowDeploymentWorkflow(request)
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
      await cdpTenantConfigCreation(request)
      break
    case 'remove-service.yml':
      // TODO: stub decommissioning
      break
    case 'generic-cdp-cli-workflow.yml':
      await genericCdpCliWorkflow(request, workflowRunId)
      break
  }

  return workflowResponse
}

const handleSnowDeploymentWorkflow = async (request) => {
  const workflowFile = request.params.workflow

  switch (workflowFile) {
    case 'infra-dev.yml':
    case 'deploy.yml':
      return await deploySnow(request)
    default:
      throw Error(`unknown workflow ${workflowFile}`)
  }
}

const handleCdpCreateWorkflows = async (request) => {
  const workflowFile = request.params.workflow
  const inputs = request.payload.inputs
  switch (workflowFile) {
    case 'create_templated_repository.yml':
      await createTemplatedRepository(request, inputs)
      break
    case 'create_repository.yml':
      await createRepository(request, inputs)
      break
    case 'archive_repository.yml':
      await archiveRepository(request)
      break
  }
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
}

const handleGrafanaWorkflows = async (request) => {
  const workflowFile = request.params.workflow
  const inputs = request.payload.inputs

  switch (workflowFile) {
    case 'promote-advanced-alert.yml':
      promoteAlertWorkflow(request, inputs)
      break
    case 'promote-custom-dashboard.yml':
      promoteDashboardWorkflow(request, inputs)
      break
    default:
      request.logger.warn(`unknown workflows ${workflowFile}`)
  }
}

export { dispatchWorkflow }
