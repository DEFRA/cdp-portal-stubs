import { triggerWorkflowStatus } from '~/src/api/github/events/trigger-workflow-status'
import { triggerCdpAppConfig } from '~/src/api/workflows/cdp-app-config/trigger-cdp-app-config'
import { triggerNginxUpstreams } from '~/src/api/workflows/cdp-nginx-upstreams/trigger-nginx-upstreams'
import { triggerShutteredVanityUrls } from '~/src/api/workflows/cdp-tf-waf/trigger-shuttered-vanity-urls'
import { triggerEnabledVanityUrls } from '~/src/api/workflows/cdp-tf-waf/trigger-enabled-vanity-urls'
import { triggerTenantServices } from '~/src/api/workflows/tenant-services/trigger-tenant-services'
import { triggerTenantBuckets } from '~/src/api/workflows/tenant-buckets/trigger-tenant-buckets'

export const triggerWorkflow = {
  handler: async (request, h) => {
    const workflow = request.params.workflow
    request.logger.info(`triggering ${workflow}`)

    switch (workflow) {
      case 'cdp-app-config':
        await triggerCdpAppConfig(request.sqs)
        break
      case 'cdp-nginx-upstreams':
        await triggerNginxUpstreams(request.sqs)
        break
      case 'cdp-tf-waf':
        await triggerShutteredVanityUrls(request.sqs)
        await triggerEnabledVanityUrls(request.sqs)
        break
      case 'tenant-services':
        await triggerTenantServices(request.sqs)
        break
      case 'tenant-buckets':
        await triggerTenantBuckets(request.sqs)
        break
      case 'terraform-apply':
        await triggerWorkflowStatus(
          request.sqs,
          'cdp-tf-svc-infra',
          '.github/workflows/manual.yml',
          'Manual Apply',
          'completed',
          'success',
          0
        )
        break
      default:
        request.logger.warn(`unsupported workflow: ${workflow}`)
    }

    return h.response('Done')
  }
}
