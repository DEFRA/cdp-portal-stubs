import { createLogger } from '~/src/helpers/logging/logger'
import { SendMessageCommand } from '@aws-sdk/client-sqs'
import * as crypto from 'crypto'
// import { lambdaDeploymentUpdate } from '~/src/api/ecs/payloads/lambda-deployment-update'
import { environmentMappings } from '~/src/config/environments'
import { config } from '~/src/config'

import { ecsDeploymentEvent } from '~/src/api/ecs/payloads/ecs-deployment-event'

const logger = createLogger()

async function deploymentHandler(sqs, payload) {
  logger.info(payload.Message)

  const msg = JSON.parse(payload.Message)

  const containerImage = msg?.container_image
  const containerVersion = msg?.container_version
  // const desiredCount = msg?.desired_count
  const zone = msg?.zone
  const environment = environmentMappings[msg?.environment]

  const deploymentId = crypto.randomUUID()
  const taskId = Math.floor(Math.random() * 1000000)

  /*
  const initalDeployment = lambdaDeploymentUpdate(
    environment,
    zone,
    containerImage,
    deploymentId,
    taskId
  )
   */

  const firstUpdate = ecsDeploymentEvent(
    environment,
    zone,
    containerImage,
    containerVersion,
    deploymentId,
    taskId
  )
  const deployMessage = {
    QueueUrl: config.get('sqsEcsQueue'),
    MessageBody: JSON.stringify(firstUpdate),
    DelaySeconds: 0,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  const command = new SendMessageCommand(deployMessage)
  return await sqs.send(command)
}

export { deploymentHandler }
