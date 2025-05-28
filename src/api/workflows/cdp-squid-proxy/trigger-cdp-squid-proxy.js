import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import crypto from 'node:crypto'
import { squidProxy } from '~/src/config/mock-data'

export async function triggerSquidProxy(sqs, delay = 1) {
  const environments = Object.keys(environmentMappings)
  const eventType = 'squid-proxy-config'
  const versionBatch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent(eventType, squidProxy(environment))
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  await sendWorkflowEventsBatchMessage(versionBatch, eventType, sqs, delay)
}
