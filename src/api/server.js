import path from 'path'
import hapi from '@hapi/hapi'
import inert from '@hapi/inert'

import { config } from '~/src/config'
import { router } from '~/src/api/router'
import { requestLogger } from '~/src/helpers/logging/request-logger'
import { mongoPlugin } from '~/src/helpers/mongodb'
import { failAction } from '~/src/helpers/fail-action'
import { sqsPlugin } from '~/src/helpers/sqs'
import { deploymentEventsPlugin } from '~/src/api/ecs/deployment-events-plugin'

async function createServer() {
  const server = hapi.server({
    port: config.get('port'),
    routes: {
      validate: {
        options: {
          abortEarly: false
        },
        failAction
      },
      files: {
        relativeTo: path.resolve(config.get('root'), '.public')
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  await server.register(requestLogger)

  await server.register({ plugin: mongoPlugin, options: {} })

  await server.register(inert)

  await server.register(router, {})

  await server.register(sqsPlugin)

  await server.register(deploymentEventsPlugin)

  return server
}

export { createServer }
