import { createLogger } from '~/src/helpers/logging/logger'
import { SendMessageCommand } from '@aws-sdk/client-sqs'
import * as crypto from 'node:crypto'
import { environmentMappings } from '~/src/config/environments'
import { config } from '~/src/config'
import { ecsTestRunEvent } from '~/src/api/ecs/payloads/ecs-taskrun-event'

const logger = createLogger()

async function testRunHandler(sqs, payload) {
  logger.info(payload.Message)

  const msg = JSON.parse(payload.Message)

  const containerImage = msg?.image
  const containerVersion = msg?.image_version
  const zone = msg?.zone
  const awsAccount = environmentMappings[msg?.environment]
  const instanceCount = msg?.desired_count
  logger.info(`Test Run Handler ${containerImage}:${containerVersion}`)
  const taskArn = `arn:aws:ecs:eu-west-2:000000000000:task/env-ecs-public/${crypto.randomUUID()}`
  const lamdaId = crypto.randomUUID()
  const taskId = Math.floor(Math.random() * 1000000)

  if (instanceCount > 0) {
    const pending = ecsTestRunEvent(
      awsAccount,
      zone,
      containerImage,
      containerVersion,
      taskArn,
      lamdaId,
      taskId,
      'PENDING',
      'RUNNING'
    )
    await send(sqs, pending, 1)

    const running = ecsTestRunEvent(
      awsAccount,
      zone,
      containerImage,
      containerVersion,
      taskArn,
      lamdaId,
      taskId,
      'RUNNING',
      'RUNNING'
    )
    await send(sqs, running, 2)

    const stopping = ecsTestRunEvent(
      awsAccount,
      zone,
      containerImage,
      containerVersion,
      taskArn,
      lamdaId,
      taskId,
      'RUNNING',
      'STOPPED'
    )
    await send(sqs, stopping, 3)

    const stopped = ecsTestRunEvent(
      awsAccount,
      zone,
      containerImage,
      containerVersion,
      taskArn,
      lamdaId,
      taskId,
      'STOPPED',
      'STOPPED',
      0
    )
    await send(sqs, stopped, 4)
  }
}

async function send(sqs, payload, delay = 0) {
  const deployMessage = {
    QueueUrl: config.get('sqsEcsQueue'),
    MessageBody: JSON.stringify(payload),
    DelaySeconds: delay,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  const command = new SendMessageCommand(deployMessage)
  return await sqs.send(command)
}

export { testRunHandler }
