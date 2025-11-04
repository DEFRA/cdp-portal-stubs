import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'
import { platformState } from '~/src/api/platform-state-lambda/platform-state'

async function sendPlatformStatePayloadForAllEnvs(sqs) {
  for (const environment of Object.keys(platformState)) {
    await sendPlatformStatePayload(sqs, environment)
  }
}

function sendPlatformStatePayload(sqs, environment, delay = 1) {
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
      '30373081fb1c41bd28d8ad8f22bd26c87bc4714b039361478af40dce08cc6b0d',
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
