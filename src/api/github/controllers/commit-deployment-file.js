import { createLogger } from '~/src/helpers/logging/logger'
import { deploy } from '~/src/api/ecs/ecs-simulator'
import { environmentMappings } from '~/src/config/environments'
import Joi from 'joi'

const logger = createLogger()

async function commitDeploymentFile(input) {
  for (const file of input.fileChanges?.additions) {
    await handleFile(file)
  }
}

async function handleFile(file) {
  try {
    if (
      !file.path.startsWith('environments/') ||
      !file.path.endsWith('.json')
    ) {
      logger.warn(`${file.path} is not a deployment file, skipping`)
      return
    }

    const decodedContent = Buffer.from(file.contents, 'base64').toString('utf8')
    const deployment = JSON.parse(decodedContent)
    Joi.assert(deployment, deploymentSchema)

    await deploy(deployment)
  } catch (error) {
    logger.error(error)
  }
}

const deploymentSchema = Joi.object({
  deploymentId: Joi.string().guid().required(),
  deploy: Joi.boolean().required(),

  service: Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    version: Joi.string().required(),
    configuration: Joi.object({
      commitSha: Joi.string().hex().length(40).required()
    }).required(),
    serviceCode: Joi.string().required()
  }).required(),

  cluster: Joi.object({
    environment: Joi.string().valid(...Object.keys(environmentMappings)),
    zone: Joi.string().valid('public', 'protected').required()
  }).required(),

  resources: Joi.object({
    instanceCount: Joi.number().integer().min(0).required(),
    cpu: Joi.number().integer().required(),
    memory: Joi.number().integer().required()
  }).required(),

  metadata: Joi.object({
    user: Joi.object({
      userId: Joi.string().guid().required(),
      displayName: Joi.string().required()
    }),
    deploymentEnvironment: Joi.string()
  })
})

export { commitDeploymentFile }
