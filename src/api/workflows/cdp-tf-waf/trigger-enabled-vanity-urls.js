import { SendMessageBatchCommand } from '@aws-sdk/client-sqs'
import { workflowEvent } from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import { createLogger } from '~/src/helpers/logging/logger'
import { tenantServices } from '~/src/config/mock-data'
import crypto from 'node:crypto'
import { config } from '~/src/config'
const logger = createLogger()

export async function triggerEnabledVanityUrls(sqs) {
  const enabledUrls = Object.keys(tenantServices[0])
    .filter(
      (name) =>
        tenantServices[0][name].zone === 'public' &&
        tenantServices[0][name].test_suite === undefined
    )
    .map((name) => {
      return {
        service: name,
        url: `${name}.defra.gov.uk` // make sure this lines up with the urls in trigger-nginx-upstreams
      }
    })

  const environments = Object.keys(environmentMappings)

  const batch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent('enabled-urls', {
        environment,
        urls: enabledUrls
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

  logger.info('send enabled-urls workflow messages', resp)
}
