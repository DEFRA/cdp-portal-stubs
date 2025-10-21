import { createTenant } from '~/src/api/platform-state-lambda/create-tenant'
import { sendPlatformStatePayload } from '~/src/api/platform-state-lambda/send-platform-state-payload'

const monoLambdaPlatformState = {
  handler: async (request, h) => {
    const config = {
      redis_enabled: false,
      mongo_enabled: true,
      team: 'platform',
      service_code: 'CDP',
      type: 'Microservice',
      subtype: 'Backend'
    }

    createTenant('foo-backend', config)
    await sendPlatformStatePayload(request.sqs, 'infra-dev')
    await sendPlatformStatePayload(request.sqs, 'management')
    return h.response('triggered state').code(200)
  }
}

export { monoLambdaPlatformState }
