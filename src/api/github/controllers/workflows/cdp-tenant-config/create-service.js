import { createTemplatedRepository } from '~/src/api/github/controllers/workflows/cdp-create-workflows/create-templated-repository'
import { tenantServices } from '~/src/config/mock-data'
import { createTenant } from '~/src/api/platform-state-lambda/create-tenant'
import { sendPlatformStatePayloadForAllEnvs } from '~/src/api/platform-state-lambda/send-platform-state-payload'
import { triggerCdpAppConfig } from '~/src/api/workflows/cdp-app-config/trigger-cdp-app-config'

export const cdpTenantConfigCreation = async (request) => {
  /**
   * @type {{service:string, config: string, template_repo: string }}
   */
  const inputs = request.payload.inputs

  const tenantConfig = JSON.parse(inputs.config)

  request.logger.info(`Create-service workflow ${JSON.stringify(inputs)}`)

  // Create the new tenant in the global platform state
  createTenant(inputs.service, tenantConfig)
  await sendPlatformStatePayloadForAllEnvs(request.sqs)

  // simulate creating the terraform changes etc
  tenantServices[inputs.service] = {
    name: inputs.service,
    zone: tenantConfig.zone,
    mongo: tenantConfig.mongo_enabled,
    redis: tenantConfig.redis_enabled,
    service_code: tenantConfig.service_code ?? 'UNKNOWN',
    test_suite: tenantConfig.type === 'TestSuite' ? inputs.service : null
  }

  await createTemplatedRepository(request, {
    repositoryName: request.payload.inputs.service
  })

  await triggerCdpAppConfig(request.sqs, 2)
}
