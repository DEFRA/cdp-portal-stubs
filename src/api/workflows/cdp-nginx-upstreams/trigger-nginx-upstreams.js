import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import { tenantServices, vanityUrls } from '~/src/config/mock-data'
import crypto from 'node:crypto'

export async function triggerNginxUpstreams(sqs) {
  const environments = Object.keys(environmentMappings)

  const vanityUrlEventType = 'nginx-vanity-urls'
  const batch = environments.map((environment) => {
    const frontendServices = (vanityUrls[environment] ?? []).map((v) => {
      const splitAt = v.url.indexOf('.')
      const host = v.url.slice(0, splitAt)
      const domain = v.url.slice(splitAt + 1)

      return {
        name: v.service,
        urls: [{ host, domain }]
      }
    })

    const payload = JSON.stringify(
      workflowEvent(vanityUrlEventType, {
        environment,
        services: frontendServices
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  await sendWorkflowEventsBatchMessage(batch, vanityUrlEventType, sqs)

  const upstreamEventType = 'nginx-upstreams'
  const upstreamsBatch = environments.map((environment) => {
    const entities = Object.keys(tenantServices)
    const payload = JSON.stringify(
      workflowEvent(upstreamEventType, {
        environment,
        entities
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  await sendWorkflowEventsBatchMessage(upstreamsBatch, upstreamEventType, sqs)
}
