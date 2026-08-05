import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'

/**
 * A partial mock of the create-tenant-resource flow.
 * Doesn't currently create anything, but sends back the messages.
 *
 * @param {{}} request
 * @param {{ namespace: string|null, action:string|null, args: {} }} cmd
 * @param {string} workflowRunId
 * @param {string} runId
 * @param {string|null} branch
 */
export async function handleTenantCommands(
  request,
  cmd,
  workflowRunId,
  runId = 'stub-run-id',
  branch = null
) {
  if (!branch) return

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

  // TODO: actually update the tenant model with the new resources.

  await sendWorkflowEventsBatchMessage(
    [{ Id: crypto.randomUUID(), MessageBody: JSON.stringify(event) }],
    'resource-request-pr',
    request.sqs,
    1
  )
}
