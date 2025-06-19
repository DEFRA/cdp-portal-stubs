import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { environmentMappings } from '~/src/config/environments'
import { config } from '~/src/config'

import { ecsDeploymentEvent } from '~/src/api/ecs/payloads/ecs-deployment-event'
import { lambdaDeploymentUpdate } from '~/src/api/ecs/payloads/lambda-deployment-update'
import { ecsDeployStatusChangeEvent } from '~/src/api/ecs/payloads/ecs-deploy-status-change-event'
import { sqsClient } from '~/src/helpers/sqs'

async function sendDeploymentMessages(deploymentFile) {
  const context = extractDeploymentContext(deploymentFile)

  // Lambda update
  const lambdaUpdated = lambdaDeploymentUpdate(
    context.awsAccount,
    context.zone,
    context.image,
    context.deploymentId,
    context.lambdaId,
    context.taskId
  )

  await send(lambdaUpdated, 1)

  const flow = [
    { status: 'PROVISIONING', desiredStatus: 'RUNNING', delay: 1 },
    { status: 'PENDING', desiredStatus: 'RUNNING', delay: 2 },
    { status: 'ACTIVATING', desiredStatus: 'RUNNING', delay: 3 },
    { status: 'RUNNING', desiredStatus: 'RUNNING', delay: 5 }
  ]

  await sendDeploymentEvents(context, flow)

  const deployStatusChangeEvent = ecsDeployStatusChangeEvent(
    context.awsAccount,
    new Date(),
    context.lambdaId,
    'SERVICE_DEPLOYMENT_COMPLETED',
    `ECS deployment ${context.lambdaId} completed.`
  )
  await send(deployStatusChangeEvent, 5)
}

async function sendUndeployMessages(deploymentFile, undeploy = false) {
  const context = extractDeploymentContext(deploymentFile)

  const flow = [
    { status: 'STOPPING', desiredStatus: 'STOPPED', delay: 1 },
    { status: 'STOPPED', desiredStatus: 'STOPPED', delay: 2 }
  ]

  await sendDeploymentEvents(context, flow)
}

function extractDeploymentContext(deploymentFile) {
  const deploymentId = deploymentFile.deploymentId
  const { image, version } = deploymentFile.service
  const { taskId, lambdaId, taskArns } = deploymentFile.ecsData
  const { environment, zone } = deploymentFile.cluster
  const awsAccount = environmentMappings[environment]

  return {
    deploymentId,
    image,
    version,
    taskId,
    lambdaId,
    taskArns,
    zone,
    awsAccount
  }
}

async function sendDeploymentEvents(ctx, flow) {
  for (const taskArn of ctx.taskArns) {
    for (const step of flow) {
      const payload = ecsDeploymentEvent(
        ctx.awsAccount,
        ctx.zone,
        ctx.image,
        ctx.version,
        ctx.deploymentId,
        ctx.lambdaId,
        ctx.taskId,
        step.status,
        step.desiredStatus,
        taskArn
      )
      await send(payload, step.delay)
    }
  }
}

async function send(payload, delay = 0) {
  const deployMessage = {
    QueueUrl: config.get('sqsEcsQueue'),
    MessageBody: JSON.stringify(payload),
    DelaySeconds: delay,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  const command = new SendMessageCommand(deployMessage)
  return await sqsClient.send(command)
}

export { sendDeploymentMessages, sendUndeployMessages }
