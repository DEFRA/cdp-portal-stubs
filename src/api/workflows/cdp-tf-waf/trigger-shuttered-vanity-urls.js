import crypto from 'node:crypto'

import { environmentMappings } from '~/src/config/environments'
import { platformState } from '~/src/api/platform-state-lambda/platform-state'
import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'

export async function triggerShutteredVanityUrls(sqs, delay = 0) {
  const eventType = 'shuttered-urls'

  const batch = Object.keys(environmentMappings).map((environment) => {
    const shutteredUrls = Object.values(platformState[environment]).flatMap(
      (data) => {
        const urls = data.tenant.urls || {}

        return Object.entries(urls)
          .filter(([, detail]) => detail.shuttered)
          .map(([url]) => url)
      }
    )

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
