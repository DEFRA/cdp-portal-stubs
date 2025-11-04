import crypto from 'node:crypto'

import { environmentMappings } from '~/src/config/environments'
import { platformState } from '~/src/api/platform-state-lambda/platform-state'
import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'

export async function triggerEnabledVanityUrls(sqs) {
  const eventType = 'enabled-urls'

  const batch = Object.keys(environmentMappings).map((environment) => {
    const enabledUrls = Object.entries(platformState[environment]).flatMap(
      ([serviceName, data]) => {
        const urls = data.tenant.urls || {}

        return Object.entries(urls)
          .filter(([, detail]) => detail.enabled)
          .map(([url]) => ({
            service: serviceName,
            url
          }))
      }
    )

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
