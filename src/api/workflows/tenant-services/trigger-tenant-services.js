import { createLogger } from '~/src/helpers/logging/logger'
import { environmentMappings } from '~/src/config/environments'
import { workflowEvent } from '~/src/api/workflows/helpers/workflow-event'
import crypto from 'node:crypto'
import { SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'
import { tenantServices } from '~/src/config/mock-data'

const logger = createLogger()

export async function triggerTenantServices(sqs, delay = 0) {
  const environments = Object.keys(environmentMappings)
  logger.error(Object.values(tenantServices))

  const batch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent('tenant-services', {
        environment,
        services: Object.values(tenantServices)
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  const command = new SendMessageBatchCommand({
    QueueUrl: config.get('sqsGitHubWorkflowEvents'),
    Entries: batch,
    DelaySeconds: delay
  })
  const resp = await sqs.send(command)
  logger.info('send tenant-services workflow message', resp)
}
