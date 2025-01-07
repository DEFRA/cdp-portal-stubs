import { SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import { workflowEvent } from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import { createLogger } from '~/src/helpers/logging/logger'
import { vanityUrls } from '~/src/config/mock-data'
import crypto from 'node:crypto'
import { config } from '~/src/config'
const logger = createLogger()

export async function triggerEnabledVanityUrls(sqs) {
  const environments = Object.keys(environmentMappings)

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
      workflowEvent('enabled-urls', {
        environment,
        urls: enabledUrls
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

  logger.info('send enabled-urls workflow messages', resp)
}
