import { createLogger } from '~/src/helpers/logging/logger'

function deploymentHandler(sqs, payload) {
  const logger = createLogger()
  logger.log(payload)
}

export { deploymentHandler }
