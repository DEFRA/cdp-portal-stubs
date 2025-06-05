import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import crypto from 'node:crypto'
import { vanityUrls } from '~/src/config/mock-data'

export async function triggerShutteredVanityUrls(sqs, delay = 0) {
  const environments = Object.keys(environmentMappings)

  const eventType = 'shuttered-urls'
  const batch = environments.map((environment) => {
    const urlsForEnv = vanityUrls[environment] ?? []
    const shutteredUrls = urlsForEnv
      .filter((v) => v.shuttered)
      .map((v) => v.url)
    const payload = JSON.stringify(
      workflowEvent(eventType, {
        environment,
        urls: shutteredUrls
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  await sendWorkflowEventsBatchMessage(batch, eventType, sqs, delay)
}
