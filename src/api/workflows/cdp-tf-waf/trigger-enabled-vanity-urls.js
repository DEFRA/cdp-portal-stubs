import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import { vanityUrls } from '~/src/config/mock-data'
import crypto from 'node:crypto'

export async function triggerEnabledVanityUrls(sqs) {
  const environments = Object.keys(environmentMappings)

  const eventType = 'enabled-urls'
  const batch = environments.map((environment) => {
    const enabledUrls = (vanityUrls[environment] ?? [])
      .filter((v) => v.enabled)
      .map((v) => {
        return {
          service: v.service,
          url: v.url
        }
      })
    const payload = JSON.stringify(
      workflowEvent(eventType, {
        environment,
        urls: enabledUrls
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  await sendWorkflowEventsBatchMessage(batch, eventType, sqs)
}
