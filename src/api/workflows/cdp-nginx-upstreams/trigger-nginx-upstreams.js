import { config } from '~/src/config'
import { SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import { workflowEvent } from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import { createLogger } from '~/src/helpers/logging/logger'
import { vanityUrls } from '~/src/config/mock-data'
import crypto from 'node:crypto'

const logger = createLogger()

export async function triggerNginxUpstreams(sqs) {
  const environments = Object.keys(environmentMappings)

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
      workflowEvent('nginx-vanity-urls', {
        environment,
        services: frontendServices
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  const command = new SendMessageBatchCommand({
    QueueUrl: config.get('sqsGitHubWorkflowEvents'),
    Entries: batch
  })
  const resp = await sqs.send(command)
  logger.info('send nginx-vanity-urls workflow messages', resp)
}
