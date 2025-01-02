import { config } from '~/src/config'
import { SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import { workflowEvent } from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import { createLogger } from '~/src/helpers/logging/logger'
import crypto from 'node:crypto'

const logger = createLogger()

export async function triggerShutteredVanityUrls(sqs) {
  const shutteredUrls = []

  const environments = Object.keys(environmentMappings)

  const batch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent('shuttered-urls', {
        environment,
        urls: shutteredUrls
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
  logger.info('send shuttered-urls workflow message', resp)
}
