import { createLogger } from '~/src/helpers/logging/logger'
import { SendMessageCommand } from '@aws-sdk/client-sqs'

import { config } from '~/src/config'

const logger = createLogger()
const secretsUpdatedDelay = config.get('lambda.secretsUpdates.delay')
const secretsOutgoing = config.get('lambda.secretsUpdates.queueOut')

async function secretsUpdatesHandler(sqs, payload) {
  logger.debug({ payload }, 'Secrets update received')
  if (!payload?.Message) {
    logger.info('No secret message payload found')
    return
  }
  const message = JSON.parse(payload.Message)
  const { environment, action } = message
  const service = message.name
  const secretKey = message.secret_key
  const secretValue = message.secret_value

  if (secretValue === 'BLOWUP') {
    logger.info(`Exception, BLOWUP received for ${service} in ${environment}`)
    addSecret({
      sqs,
      environment,
      addSecret: false,
      service,
      secretKey,
      exception: 'Something went wrong, on purpose'
    })
    return
  }
  if (action === 'add_secret') {
    logger.info(`Adding secret [${secretKey}] for ${service} in ${environment}`)
    addSecret({ sqs, environment, addSecret: true, service, secretKey })
  } else {
    logger.error(`Unknown action [${action}] for ${service} in ${environment}`)
  }
}

async function addSecret({
  sqs,
  environment,
  addSecret,
  service,
  secretKey,
  exception
}) {
  const payload = {
    source: 'cdp-secret-manager-lambda',
    statusCode: 200,
    action: 'add_secret',
    body: {
      environment,
      add_secret: addSecret,
      secret: `cdp/services/${service}`,
      secret_key: secretKey,
      exception
    }
  }
  const updatedMessage = {
    QueueUrl: secretsOutgoing,
    MessageBody: JSON.stringify(payload),
    DelaySeconds: secretsUpdatedDelay,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }
  const command = new SendMessageCommand(updatedMessage)
  return await sqs.send(command)
}

export { secretsUpdatesHandler }
