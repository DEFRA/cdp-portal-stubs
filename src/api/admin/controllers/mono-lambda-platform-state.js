import { sendPlatformStatePayloadForAllEnvs } from '~/src/api/platform-state-lambda/send-platform-state-payload'

const monoLambdaPlatformState = {
  handler: async (request, h) => {
    await sendPlatformStatePayloadForAllEnvs(request.sqs)
    return h.response('triggered state').code(200)
  }
}

export { monoLambdaPlatformState }
