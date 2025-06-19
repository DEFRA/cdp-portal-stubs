import {
  sendDeploymentMessages,
  sendUndeployMessages
} from '~/src/api/ecs/send-deployment-messages'
import { createLogger } from '~/src/helpers/logging/logger'

const logger = createLogger()

const ecs = {
  prod: {},
  'perf-test': {},
  dev: {},
  test: {},
  management: {},
  'infra-dev': {},
  'ext-test': {}
}

async function deploy(deployment) {
  if (deployment.deploy === false) {
    return
  }

  const environment = deployment.cluster.environment
  const service = deployment.service.name

  // check if service is already deployed
  if (ecs[environment][service]) {
    const oldDeployment = ecs[environment][service]
    logger.info(
      `undeploying ${oldDeployment.deploymentId} ${oldDeployment.lambdaId}, ${oldDeployment.service.name}`
    )
    await sendUndeployMessages(oldDeployment)
  }

  deployment.ecsData = {
    lambdaId: `ecs-svc/${crypto.randomUUID()}`,
    taskId: Math.floor(Math.random() * 1000000),
    taskArns: Array.from({ length: deployment.resources.instanceCount }, () =>
      crypto.randomUUID()
    )
  }

  logger.info(
    `deploying ${deployment.deploymentId} ${deployment.service.name} to ${deployment.cluster.environment}`
  )
  ecs[environment][service] = deployment

  await sendDeploymentMessages(deployment)
}

export { deploy }
