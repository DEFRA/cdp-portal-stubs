import { Consumer } from 'sqs-consumer'
import { slackHistory } from '~/src/api/slack/slack-history'

const { config } = require('~/src/config')

function slackListener(server) {
  const queueUrl = config.get('slack.queue')

  server.logger.info(`Listening for secrets updates events on ${queueUrl}`)

  const sqs = server.sqs
  const listener = Consumer.create({
    queueUrl,
    attributeNames: ['SentTimestamp'],
    messageAttributeNames: ['All'],
    waitTimeSeconds: 10,
    visibilityTimeout: 20,
    handleMessage: async (message) => {
      const decoded = JSON.parse(message.Body)
      const payload = JSON.parse(decoded.Message)
      slackHistory.push(payload)
      return message
    },
    sqs
  })

  listener.on('error', (error) => {
    server.logger.error(error.message)
  })

  listener.on('processing_error', (error) => {
    server.logger.error(error.message)
  })

  listener.on('timeout_error', (error) => {
    server.logger.error(error.message)
  })

  listener.start()

  return listener
}

export { slackListener }
