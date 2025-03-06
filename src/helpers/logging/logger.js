import pino from 'pino'

import { loggerOptions } from '~/src/helpers/logging/logger-options'

const logger = pino(loggerOptions)

function createLogger() {
  return logger
}

export { createLogger }
