import {
  sendDeploymentMessages,
  sendUndeployMessages
} from '~/src/api/ecs/send-deployment-messages'
import { createLogger } from '~/src/helpers/logging/logger'
import { environmentMappings } from '~/src/config/environments'
import crypto from 'node:crypto'

const logger = createLogger()

/**
 * Simulates the cdp-app-deployments github repo
 * @type {{prod: {}, "perf-test": {}, dev: {}, test: {}, management: {}, "infra-dev": {}, "ext-test": {}}}
 */
const cdpAppDeployments = {
  prod: {},
  'perf-test': {},
  dev: {},
  test: {},
  management: {},
  'infra-dev': {},
  'ext-test': {}
}

/**
 * Mocks actual ECS state (uses ECS context objects)
 * @type {{prod: {}, "perf-test": {}, dev: {}, test: {}, management: {}, "infra-dev": {}, "ext-test": {}}}
 */
const ecs = {
  prod: {},
  'perf-test': {},
  dev: {},
  test: {},
  management: {},
  'infra-dev': {},
  'ext-test': {}
}

/**
 * Mock for deployment files stored in GitHub
 * @param environment
 * @param service
 * @return {*}
 */
function findDeployment(environment, service) {
  return cdpAppDeployments[environment][service]
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
      `undeploying ${oldDeployment.deploymentId} ${oldDeployment.lambdaId}, ${service}`
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
    `deploying ${deployment.deploymentId} ${service} to ${environment}`
  )
  cdpAppDeployments[environment][service] = deployment

  const context = extractDeploymentContext(deployment)
  ecs[environment][service] = context
  await sendDeploymentMessages(context)
}

/**
 * Converts github deployment files into a deployment context
 * @param deploymentFile
 * @return {{deploymentId: *|string, image: *, version: *, taskId: *, lambdaId: *, taskArns: *, zone: *, awsAccount: *}}
 */
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

/**
 * Simulates deployment triggered directly via the lambda
 * @param {string} message - JSON string containing the sns message body
 * @return {Promise<void>}
 */
async function deployViaLambda(message) {
  const deployment = JSON.parse(message)
  const environment = deployment.environment
  const service = deployment.name
  const awsAccount = environmentMappings[environment]

  const context = {
    deploymentId: deployment.deployed_by.deployment_id,
    image: deployment.container_image,
    version: deployment.container_version,
    taskId: Math.floor(Math.random() * 1000000),
    lambdaId: `ecs-svc/${crypto.randomUUID()}`,
    taskArns: Array.from(
      { length: deployment.desired_count },
      () =>
        `arn:aws:ecs:eu-west-2:${awsAccount}:task/${environment}-ecs-${
          deployment.zone
        }/${crypto.randomBytes(16).toString('hex')}`
    ),
    zone: deployment.zone,
    awsAccount
  }

  // check if service is already deployed
  if (ecs[environment][service]) {
    const oldDeployment = ecs[environment][service]
    logger.info(
      `undeploying ${oldDeployment.deploymentId} ${oldDeployment.lambdaId}, ${oldDeployment.service.name}`
    )
    await sendUndeployMessages(oldDeployment)
  }

  logger.info(`deploying ${context.deploymentId} ${service} to ${environment}`)
  ecs[environment][service] = context

  await sendDeploymentMessages(context)
}

export { deploy, findDeployment, deployViaLambda }
