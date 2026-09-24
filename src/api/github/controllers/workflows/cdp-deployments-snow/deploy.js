import { config } from '~/src/config'

export const deploySnow = async (request) => {
  const workflowRunId = config.get('workflowRunId') ?? Date.now()
  const inputs = request.payload.inputs ?? {}
  const portalPayload = parseJsonInput(inputs.portal_payload)
  const extendedPayload = parseJsonInput(inputs.extended_payload)

  request.logger.info(
    `Stubbing triggering of workflow ${
      request.params.org
    }/cdp-deployments-snow/${
      request.params.workflow
    } with portal payload ${JSON.stringify(
      portalPayload
    )} and extended payload ${JSON.stringify(extendedPayload)}`
  )

  // This is intentionally fake for local development only.
  // GitHub's real workflow_dispatch endpoint responds 204 with no body.
  return {
    workflow_run_id: workflowRunId,
    run_url: `https://api.github.com/repos/DEFRA/cdp-deployments-snow/actions/runs/${workflowRunId}`,
    html_url: `https://github.com/DEFRA/cdp-deployments-snow/actions/runs/${workflowRunId}`
  }
}

const parseJsonInput = (value, fallback = {}) => {
  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}
