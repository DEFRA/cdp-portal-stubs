import { createLogger } from '~/src/helpers/logging/logger'
import { SendMessageCommand } from '@aws-sdk/client-sqs'
import * as crypto from 'crypto'
// import { lambdaDeploymentUpdate } from '~/src/api/ecs/payloads/lambda-deployment-update'
import { environmentMappings } from '~/src/config/environments'
import { config } from '~/src/config'

import { ecsDeploymentEvent } from '~/src/api/ecs/payloads/ecs-deployment-event'
import { lambdaDeploymentUpdate } from '~/src/api/ecs/payloads/lambda-deployment-update'

const logger = createLogger()

async function deploymentHandler(sqs, payload) {
  logger.info(payload.Message)

  const msg = JSON.parse(payload.Message)

  const containerImage = msg?.container_image
  const containerVersion = msg?.container_version
  const zone = msg?.zone
  const awsAccount = environmentMappings[msg?.environment]

  const deploymentId = msg?.deployed_by?.deployment_id
  const lamdaId = crypto.randomUUID()
  const taskId = Math.floor(Math.random() * 1000000)

  // Lamba update
  const lambdaUpdated = lambdaDeploymentUpdate(
    awsAccount,
    zone,
    containerImage,
    deploymentId,
    lamdaId,
    taskId
  )

  await send(sqs, lambdaUpdated, 1)

  // TODO: send multiple pending/success messages
  const firstUpdate = ecsDeploymentEvent(
    awsAccount,
    zone,
    containerImage,
    containerVersion,
    deploymentId,
    lamdaId,
    taskId,
    'PENDING'
  )
  await send(sqs, firstUpdate, 3)

  const secondUpdate = ecsDeploymentEvent(
    awsAccount,
    zone,
    containerImage,
    containerVersion,
    deploymentId,
    lamdaId,
    taskId,
    'RUNNING'
  )
  await send(sqs, secondUpdate, 5)
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

export { deploymentHandler }
