import { config } from '~/src/config'
import { SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import { workflowEvent } from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import { createLogger } from '~/src/helpers/logging/logger'
import crypto from 'node:crypto'

const logger = createLogger()

export async function triggerCdpAppConfig(sqs) {
  const environments = Object.keys(environmentMappings)
  const batch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent('app-config-version', {
        commitSha: crypto.randomBytes(20).toString('hex'),
        commitTimestamp: new Date().toISOString(),
        environment
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

  logger.info('send cdp-app-config workflow events', resp)
}
