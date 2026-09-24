import {
  parseCommand,
  parseCommandArray
} from '~/src/api/github/controllers/generic-cli/parse-command'
import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'
import { handleTeamCommands } from '~/src/api/github/controllers/generic-cli/team-commands'
import { handleTenantCommands } from '~/src/api/github/controllers/generic-cli/tenant-commands'
import crypto from 'crypto'

export const genericCdpCliWorkflow = async (request, workflowRunId) => {
  const inputs = request.payload.inputs ?? {}
  const runId = inputs.run_id ?? 'stub-run-id'
  const branch = inputs.use_branch ?? ''
  const commands = parseCommandArray(inputs.commands)
  const shouldFail = commands.some((command) =>
    command.toUpperCase().includes('BLOWUP')
  )

  // Failure simulation
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

  // Rough mocks of what the commands actually do...
  const parsedCommands = commands.map(parseCommand)
  for (const cmd of parsedCommands) {
    if (cmd.namespace === 'team') {
      await handleTeamCommands(request, cmd)
    } else if (cmd.namespace === 'tenant-config') {
      await handleTenantCommands(request, cmd, workflowRunId, runId, branch)
    }
  }
}
