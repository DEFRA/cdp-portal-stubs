import Joi from 'joi'
import { slackHistory } from '~/src/api/slack/slack-history'

const schema = Joi.object({
  team: Joi.string(),
  message: Joi.object({
    channel: Joi.string().required(),
    attachments: Joi.array()
  })
}).unknown(true)

export async function sendSlackNotificationHandler(server, payload, attr = {}) {
  Joi.assert(payload, schema)

  server.logger.info(
    `sending slack message to ${payload.message.channel}`,
    payload
  )

  slackHistory.push(payload.message)
}
