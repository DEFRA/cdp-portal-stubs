import { Consumer } from 'sqs-consumer'
import { deploymentHandler } from '~/src/api/ecs/deployment-handler'

const { config } = require('~/src/config')

function deploymentEventListener(server) {
  const queueUrl = config.get('sqsStubDeployments')

  server.logger.info(`Listening for deployment events on ${queueUrl}`)

  const sqs = server.sqs
  const listener = Consumer.create({
    queueUrl,
    attributeNames: ['SentTimestamp'],
    messageAttributeNames: ['All'],
    waitTimeSeconds: 10,
    visibilityTimeout: 400,
    handleMessage: async (message) => {
      const payload = JSON.parse(message.Body)
      await deploymentHandler(server, payload)
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

export { deploymentEventListener }
