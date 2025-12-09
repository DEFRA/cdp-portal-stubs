import { triggerCdpAppConfig } from '~/src/api/workflows/cdp-app-config/trigger-cdp-app-config'
import { config } from '~/src/config'
import { populateECR } from '~/src/api/workflows/populate-ecr/populate-ecr'
import { sendPlatformStatePayloadForAllEnvs } from '~/src/api/platform-state-lambda/send-platform-state-payload'

/**
 * Simulates updates from github. Can also be triggered via the /_admin/trigger/{workflow} api
 * @type {{plugin: {name: string, version: string, register: ((function(*): Promise<void>)|*)}}}
 */
export const workflowsPlugin = {
  plugin: {
    name: 'workflows',
    version: '1.0.0',
    register: async function (server) {
      if (config.get('sendGitHubWorkflowsOnStartup')) {
        server.ext({
          type: 'onPostStart',
          method: async function (server) {
            return Promise.allSettled([
              sendPlatformStatePayloadForAllEnvs(server.sqs),
              populateECR(server.sqs),
              triggerCdpAppConfig(server.sqs)
            ])
          }
        })
      }
    }
  }
}
