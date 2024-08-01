import { createLogger } from '~/src/helpers/logging/logger'
import { SendMessageCommand } from '@aws-sdk/client-sqs'
import * as crypto from 'crypto'
// import { lambdaDeploymentUpdate } from '~/src/api/ecs/payloads/lambda-deployment-update'
import { environmentMappings } from '~/src/config/environments'
import { config } from '~/src/config'

import { ecsDeploymentEvent } from '~/src/api/ecs/payloads/ecs-deployment-event'
import { lambdaDeploymentUpdate } from '~/src/api/ecs/payloads/lambda-deployment-update'
import { ecsDeployStatusChangeEvent } from '~/src/api/ecs/payloads/ecs-deploy-status-change-event'

const logger = createLogger()

async function deploymentHandler(sqs, payload) {
  logger.info(payload.Message)

  const msg = JSON.parse(payload.Message)

  const containerImage = msg?.container_image
  const containerVersion = msg?.container_version
  const zone = msg?.zone
  const awsAccount = environmentMappings[msg?.environment]
  const instanceCount = msg?.desired_count

  const deploymentId = msg?.deployed_by?.deployment_id
  const lamdaId = `ecs-svc/${crypto.randomUUID()}`
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

  const deploymentFlow = [
    { status: 'PROVISIONING', delay: 1 },
    { status: 'PENDING', delay: 2 },
    { status: 'ACTIVATING', delay: 3 },
    { status: 'RUNNING', delay: 5 }
  ]

  for (let i = 0; i < instanceCount; i++) {
    const taskArn = crypto.randomUUID()
    for (let j = 0; j < deploymentFlow.length; j++) {
      const payload = ecsDeploymentEvent(
        awsAccount,
        zone,
        containerImage,
        containerVersion,
        deploymentId,
        lamdaId,
        taskId,
        deploymentFlow[j].status,
        'RUNNING',
        taskArn
      )
      await send(sqs, payload, deploymentFlow[j].delay)
    }
  }

  const deployStatusChangeEvent = ecsDeployStatusChangeEvent(
    awsAccount,
    new Date(),
    lamdaId,
    'SERVICE_DEPLOYMENT_COMPLETED',
    `ECS deployment ${lamdaId} completed.`
  )
  await send(sqs, deployStatusChangeEvent, 5)
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
