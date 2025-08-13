import { environmentMappings } from '~/src/config/environments'
import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'
import crypto from 'node:crypto'
import { tenantServices } from '~/src/config/mock-data'

export async function triggerTenantServices(sqs, delay = 0) {
  const environments = Object.keys(environmentMappings)

  const eventType = 'tenant-services'
  const batch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent(eventType, {
        environment,
        services: Object.values(tenantServices(environment))
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  await sendWorkflowEventsBatchMessage(batch, eventType, sqs, delay)
}
