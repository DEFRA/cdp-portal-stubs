import { triggerCdpAppConfig } from '~/src/api/workflows/cdp-app-config/trigger-cdp-app-config'
import { sendPlatformStatePayloadForAllEnvs } from '~/src/api/platform-state-lambda/send-platform-state-payload'
import { triggerTeams } from '~/src/api/workflows/teams/trigger-teams'

export const triggerWorkflow = {
  handler: async (request, h) => {
    const workflow = request.params.workflow
    request.logger.info(`triggering ${workflow}`)

    switch (workflow) {
      case 'platform-state':
        await sendPlatformStatePayloadForAllEnvs(request.sqs)
        break
      case 'cdp-app-config':
        await triggerCdpAppConfig(request.sqs)
        break
      case 'teams':
        await triggerTeams(request.sqs)
        break
      default:
        request.logger.warn(`unsupported workflow: ${workflow}`)
    }

    return h.response('Done')
  }
}
