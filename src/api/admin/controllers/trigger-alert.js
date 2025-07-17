import Joi from 'joi'
import { config } from '~/src/config'
import {
  SendMessageBatchCommand,
  SendMessageCommand
} from '@aws-sdk/client-sqs'

export const triggerAlert = {
  options: {
    validate: {
      params: Joi.object({
        source: Joi.string().valid('grafana', 'github').required()
      }),
      query: Joi.object({ title: Joi.string().optional() })
    }
  },
  handler: async (request, h) => {
    const source = request.params.source
    const title = request.params.title ?? `${new Date().getTime()}`
    const payload = request.payload

    let queue
    if (source === 'grafana') {
      queue = config.get('sqsGrafanaNotification')
    } else if (source === 'github') {
      queue = config.get('sqsGitHubNotification')
    }

    request.logger.info(`triggering alert for ${source}, sending to ${queue}`)

    if (Array.isArray(payload)) {
      request.logger.info('sending batch of alerts')
      const entries = payload.map((entry, index) => ({
        Id: `${title}-${index}`,
        MessageBody: JSON.stringify(entry)
      }))
      const command = new SendMessageBatchCommand({
        QueueUrl: queue,
        Entries: entries
      })
      const resp = await request.sqs.send(command)
      return h.response(resp).code(200)
    } else {
      request.logger.info('sending single alert')
      const command = new SendMessageCommand({
        QueueUrl: queue,
        MessageBody: JSON.stringify(payload)
      })
      const resp = await request.sqs.send(command)
      return h.response(resp).code(200)
    }
  }
}
