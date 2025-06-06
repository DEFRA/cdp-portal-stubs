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
  const entries = batch.map((entry, index) => ({
    Id: entry.Id || `msg-${index}`,
    MessageBody: entry.MessageBody,
    DelaySeconds: entry.DelaySeconds ?? delay,
    MessageAttributes: entry.MessageAttributes || {}
  }))

  const command = new SendMessageBatchCommand({
    QueueUrl: config.get('sqsGitHubWorkflowEvents'),
    DelaySeconds: delay,
    Entries: entries
  })
  const resp = await sqs.send(command)

  logger.info(`sending ${eventType} workflow events`, resp)
}
