import { Consumer } from 'sqs-consumer'
import { testRunHandler } from '~/src/api/ecs/test-run-handler'

const { config } = require('~/src/config')

function testRunEventListener(server) {
  const queueUrl = config.get('sqsTestRunsFromPortal')

  server.logger.info(`Listening for test runs events on ${queueUrl}`)

  const sqs = server.sqs
  const listener = Consumer.create({
    queueUrl,
    attributeNames: ['SentTimestamp'],
    messageAttributeNames: ['All'],
    waitTimeSeconds: 10,
    visibilityTimeout: 400,
    handleMessage: async (message) => {
      const payload = JSON.parse(message.Body)
      await testRunHandler(server.sqs, payload)
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

export { testRunEventListener }
