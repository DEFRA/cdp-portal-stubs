import { createLogger } from '~/src/helpers/logging/logger'
import { SendMessageCommand } from '@aws-sdk/client-sqs'

import { config } from '~/src/config'

const logger = createLogger()
const secretsUpdatedDelay = config.get('lambda.secretsUpdates.delay')
const secretsUpdatedQueue = config.get('lambda.secretsUpdates.queue')

async function secretUpdatesHandler(sqs, payload) {
  logger.info(payload.Message, 'Secrets update received')
  const msg = JSON.parse(payload.Message)
  const name = msg?.name
  const environment = msg?.environment
  const action = msg?.action
  //   const description = msg?.description
  const secretKey = msg?.secret_key
  //   const secretValue = msg?.secret_value

  if (action === 'add_secret') {
    logger.info(`Adding secret ${secretKey} for ${name} in ${environment}`)
    addSecret(sqs, name, secretKey)
  }
}

async function addSecret(sqs, name, secretKey) {
  const payload = {
    add_secret: true,
    secret: name,
    secretKey,
    exception: ''
  }
  const updatedMessage = {
    QueueUrl: secretsUpdatedQueue,
    MessageBody: JSON.stringify(payload),
    DelaySeconds: secretsUpdatedDelay,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }
  const command = new SendMessageCommand(updatedMessage)
  return await sqs.send(command)
}

export { secretUpdatesHandler }
