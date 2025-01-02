import { createLogger } from '~/src/helpers/logging/logger'
import { environmentMappings } from '~/src/config/environments'
import { workflowEvent } from '~/src/api/workflows/helpers/workflow-event'
import { buckets } from '~/src/config/mock-data'
import crypto from 'node:crypto'
import { SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'

const logger = createLogger()

export async function triggerTenantBuckets(sqs) {
  const environments = Object.keys(environmentMappings)

  const batch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent('tenant-buckets', {
        environment,
        buckets: buckets(environment)
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
  logger.info('send tenant-buckets workflow message', resp)
}
