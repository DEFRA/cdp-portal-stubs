import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'
import { platformState } from '~/src/api/platform-state-lambda/platform-state'

async function sendPlatformStatePayloadForAllEnvs(sqs) {
  return Promise.all(
    Object.keys(platformState).map((environment) =>
      sendPlatformStatePayload(sqs, environment)
    )
  )
}

function sendPlatformStatePayload(
  sqs,
  environment,
  delay = config.get('sqsLambdaEventsDelaySeconds')
) {
  // payload for environment
  const payload = {
    created: new Date().toISOString(),
    version: 1,
    environment,
    terraform_serials: {
      tfsvcinfra: 0,
      tfvanityurl: 0,
      tfwaf: 0,
      tfopensearch: 0,
      tfgrafana: 0
    },
    tenants: platformState[environment]
  }

  const message = {
    event_type: 'platform_state',
    encoding: null,
    compression: null,
    payload_version:
      '6cad79f4e908b3df3ffc71fe58369bd22a5ece2174cbee5c6c73ede079e2689a',
    payload
  }

  const command = {
    QueueUrl: config.get('sqsLambdaEvents'),
    MessageBody: JSON.stringify(message),
    DelaySeconds: delay,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  return sqs.send(new SendMessageCommand(command))
}

export { sendPlatformStatePayload, sendPlatformStatePayloadForAllEnvs }
