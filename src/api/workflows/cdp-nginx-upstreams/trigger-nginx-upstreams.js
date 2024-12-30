import { config } from '~/src/config'
import { SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import { workflowEvent } from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import { createLogger } from '~/src/helpers/logging/logger'
import { tenantServices } from '~/src/config/mock-data'
import crypto from 'node:crypto'

const logger = createLogger()

export async function triggerNginxUpstreams(sqs) {
  const frontendServices = Object.keys(tenantServices[0])
    .filter(
      (name) =>
        tenantServices[0][name].zone === 'public' &&
        tenantServices[0][name].test_suite === undefined
    )
    .map((name) => {
      return {
        name,
        urls: [{ host: name, domain: 'defra.gov.uk' }]
      }
    })

  const environments = Object.keys(environmentMappings)

  const batch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent('nginx-vanity-urls', {
        environment,
        services: frontendServices
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  const command = new SendMessageBatchCommand({
    QueueUrl: config.get('sqsGitHubWorkflowEvents'),
    Entries: batch
  })
  const resp = await sqs.send(command)
  logger.info('send nginx-vanity-urls workflow messages', resp)
}
