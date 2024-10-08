import { Consumer } from 'sqs-consumer'
import { secretsUpdatesHandler } from '~/src/api/lambda/secrets-updates-handler'

const { config } = require('~/src/config')

function secretsUpdatesListener(server) {
  const queueUrl = config.get('lambda.secretsUpdates.queueIn')

  server.logger.info(`Listening for secrets updates events on ${queueUrl}`)

  const sqs = server.sqs
  const listener = Consumer.create({
    queueUrl,
    attributeNames: ['SentTimestamp'],
    messageAttributeNames: ['All'],
    waitTimeSeconds: 10,
    visibilityTimeout: 20,
    handleMessage: async (message) => {
      const payload = JSON.parse(message.Body)
      await secretsUpdatesHandler(server.sqs, payload)
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

export { secretsUpdatesListener }
