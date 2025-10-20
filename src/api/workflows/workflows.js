import { triggerCdpAppConfig } from '~/src/api/workflows/cdp-app-config/trigger-cdp-app-config'
import { triggerNginxUpstreams } from '~/src/api/workflows/cdp-nginx-upstreams/trigger-nginx-upstreams'
import { triggerEnabledVanityUrls } from '~/src/api/workflows/cdp-tf-waf/trigger-enabled-vanity-urls'
import { triggerShutteredVanityUrls } from '~/src/api/workflows/cdp-tf-waf/trigger-shuttered-vanity-urls'
import { config } from '~/src/config'
import { triggerTenantServices } from '~/src/api/workflows/tenant-services/trigger-tenant-services'
import { populateECR } from '~/src/api/workflows/populate-ecr/populate-ecr'
import { triggerSquidProxy } from '~/src/api/workflows/cdp-squid-proxy/trigger-cdp-squid-proxy'
import { triggerTenantDatabases } from '~/src/api/workflows/tenant-databases/trigger-tenant-databases'
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
        await triggerCdpAppConfig(server.sqs)
        await triggerEnabledVanityUrls(server.sqs)
        await triggerNginxUpstreams(server.sqs)
        await triggerShutteredVanityUrls(server.sqs)
        await triggerSquidProxy(server.sqs)
        await triggerTenantServices(server.sqs)
        await triggerTenantDatabases(server.sqs)
        await populateECR(server.sqs)
        await sendPlatformStatePayloadForAllEnvs(server.sqs)
      }
    }
  }
}
