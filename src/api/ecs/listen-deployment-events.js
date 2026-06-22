import { Consumer } from 'sqs-consumer'
import { deployViaLambda } from '~/src/api/ecs/ecs-simulator'

const { config } = require('~/src/config')

function deploymentEventListener(server) {
  const queueUrl = config.get('sqsDeploymentsFromPortal')

  server.logger.info(`Listening for deployment events on ${queueUrl}`)

  const sqs = server.sqs
  const listener = Consumer.create({
    queueUrl,
    attributeNames: ['SentTimestamp'],
    messageAttributeNames: ['All'],
    waitTimeSeconds: 10,
    visibilityTimeout: 400,
    alwaysAcknowledge: true,
    shouldDeleteMessages: true,
    handleMessage: async (message) => {
      server.logger.info(`${queueUrl}: ${message?.Body}`)
      try {
        const payload = JSON.parse(message.Body)
        await deployViaLambda(payload.Message)
      } catch (err) {
        server.logger.error(err, `general error on ${queueUrl}: ${err}`)
      }
      return message
    },
    sqs
  })

  listener.on('error', (error) => {
    server.logger.error(error, `general error on ${queueUrl}: ${error.message}`)
  })

  listener.on('processing_error', (error) => {
    server.logger.error(
      error,
      `processing_error on ${queueUrl}: ${error.message}`
    )
  })

  listener.on('timeout_error', (error) => {
    server.logger.error(`timeout_error on ${queueUrl}: ${error.message}`)
  })

  listener.start()

  return listener
}

export { deploymentEventListener }
