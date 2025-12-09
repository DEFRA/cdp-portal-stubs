import { Consumer } from 'sqs-consumer'
import { migrationHandler } from '~/src/api/ecs/migration-handler'

const { config } = require('~/src/config')

export function migrationEventListener(server) {
  const queueUrl = config.get('sqsMigrationsFromPortal')

  server.logger.info(`Listening for migration events on ${queueUrl}`)

  const sqs = server.sqs
  const listener = Consumer.create({
    queueUrl,
    attributeNames: ['SentTimestamp'],
    messageAttributeNames: ['All'],
    waitTimeSeconds: 10,
    visibilityTimeout: 400,
    shouldDeleteMessages: true,
    handleMessage: async (message) => {
      try {
        await migrationHandler(server.sqs, message.Body)
        return message
      } catch (e) {
        server.logger.error(e, 'failed to process migration event')
        return {}
      }
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
