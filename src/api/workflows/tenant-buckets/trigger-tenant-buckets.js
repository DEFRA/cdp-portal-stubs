import { environmentMappings } from '~/src/config/environments'
import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'
import { buckets } from '~/src/config/mock-data'
import crypto from 'node:crypto'

export async function triggerTenantBuckets(sqs) {
  const environments = Object.keys(environmentMappings)

  const eventType = 'tenant-buckets'
  const batch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent(eventType, {
        environment,
        buckets: buckets(environment)
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  await sendWorkflowEventsBatchMessage(batch, eventType, sqs)
}
