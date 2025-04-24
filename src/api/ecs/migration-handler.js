import { createLogger } from '~/src/helpers/logging/logger'
import { SendMessageCommand } from '@aws-sdk/client-sqs'
import * as crypto from 'node:crypto'
import { environmentMappings } from '~/src/config/environments'
import { config } from '~/src/config'
import { lambdaCodebuildCreate } from '~/src/api/ecs/payloads/lambda-codebuild-create'
import { codebuildStateChange } from '~/src/api/ecs/payloads/codebuild-state-change'

const logger = createLogger()

export async function migrationHandler(sqs, payload) {
  logger.info(payload.Message)

  const msg = JSON.parse(payload.Message)

  const service = msg?.service
  const environment = msg?.environment
  const awsAccount = environmentMappings[environment]
  const version = msg?.version
  const cdpMigrationId = msg?.cdpMigrationId
  const buildId = `arn:aws:codebuild:eu-west-2:${awsAccount}:build/${service}-liquibase:${crypto.randomUUID()}`

  logger.info(
    `Migration triggered in ${environment} for ${service} version ${version}`
  )

  const created = lambdaCodebuildCreate(
    awsAccount,
    service,
    cdpMigrationId,
    buildId,
    msg
  )
  await send(sqs, created, 1)

  const inProgress = codebuildStateChange(
    awsAccount,
    service,
    buildId,
    'IN_PROGRESS'
  )
  await send(sqs, inProgress, 2)

  const successful = codebuildStateChange(
    awsAccount,
    service,
    buildId,
    'SUCCESSFUL'
  )
  await send(sqs, successful, 4)
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
