import { Consumer } from 'sqs-consumer'
import { secretUpdatesHandler } from '~/src/api/lambda/secret-updates-handler'

const { config } = require('~/src/config')

function secretUpdatesListener(server) {
  const queueUrl = config.get('lambda.secretsUpdates.queue')

  server.logger.info(`Listening for secrets updates events on ${queueUrl}`)

  const sqs = server.sqs
  const listener = Consumer.create({
    queueUrl,
    attributeNames: ['SentTimestamp'],
    messageAttributeNames: ['All'],
    waitTimeSeconds: 10,
    visibilityTimeout: 400,
    handleMessage: async (message) => {
      const payload = JSON.parse(message.Body)
      await secretUpdatesHandler(server.sqs, payload)
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

export { secretUpdatesListener }
