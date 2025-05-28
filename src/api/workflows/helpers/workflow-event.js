import { SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'
import { createLogger } from '~/src/helpers/logging/logger'

export function workflowEvent(type, payload) {
  return {
    eventType: type,
    timestamp: new Date().toISOString(),
    payload
  }
}

const logger = createLogger()

export async function sendWorkflowEventsBatchMessage(
  batch,
  eventType,
  sqs,
  delay = 0
) {
  const command = new SendMessageBatchCommand({
    QueueUrl: config.get('sqsGitHubWorkflowEvents'),
    DelaySeconds: delay,
    Entries: batch
  })
  const resp = await sqs.send(command)

  logger.info(`sending ${eventType} workflow events`, resp)
}
