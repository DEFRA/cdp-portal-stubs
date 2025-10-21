import path from 'node:path'
import hapi from '@hapi/hapi'
import inert from '@hapi/inert'

import { config } from '~/src/config'
import { router } from '~/src/api/router'
import { requestLogger } from '~/src/helpers/logging/request-logger'
import { failAction } from '~/src/helpers/fail-action'
import { sqsPlugin } from '~/src/helpers/sqs'
import { deploymentEventsPlugin } from '~/src/api/ecs/deployment-events-plugin'
import { secretsUpdatesPlugin } from '~/src/api/lambda/secrets-updates-plugin'
import { workflowsPlugin } from '~/src/api/workflows/workflows'
import { slackPlugin } from '~/src/api/slack/slack-plugin'
import { mongoDb } from '~/src/helpers/mongodb'
import { initPlatformState } from '~/src/config/init-platform-state'

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
    },
    debug: {
      request: ['error', 'uncaught', 'internal']
    }
  })

  initPlatformState()

  await server.register(requestLogger)
  await server.register({
    plugin: mongoDb.plugin,
    options: config.get('mongo')
  })
  await server.register(inert)
  await server.register(router, {})
  await server.register(sqsPlugin)
  await server.register(deploymentEventsPlugin)
  await server.register(secretsUpdatesPlugin)
  await server.register(slackPlugin)
  await server.register(workflowsPlugin)

  return server
}

export { createServer }
