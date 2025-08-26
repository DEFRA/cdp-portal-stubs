import { environmentMappings } from '~/src/config/environments'
import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'
import crypto from 'node:crypto'
import { rdsDatabases } from '~/src/config/mock-data'

export async function triggerTenantDatabases(sqs) {
  const environments = Object.keys(environmentMappings)

  const eventType = 'tenant-rds'

  const batch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent(eventType, {
        environment,
        rds: rdsDatabases()
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  await sendWorkflowEventsBatchMessage(batch, eventType, sqs)
}
