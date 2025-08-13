import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import crypto from 'node:crypto'
import { tenantServices } from '~/src/config/mock-data'

export async function triggerCdpAppConfig(sqs, delay = 1) {
  const environments = Object.keys(environmentMappings)
  const versionEventType = 'app-config-version'
  const versionBatch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent(versionEventType, {
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

  const entitiesEventType = 'app-config'
  const entitiesBatch = environments.map((environment) => {
    const payload = JSON.stringify(
      workflowEvent(entitiesEventType, {
        commitSha: crypto.randomBytes(20).toString('hex'),
        commitTimestamp: new Date().toISOString(),
        environment,
        entities: Object.keys(tenantServices(environment))
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })
  await sendWorkflowEventsBatchMessage(
    versionBatch,
    versionEventType,
    sqs,
    delay
  )
  await sendWorkflowEventsBatchMessage(
    entitiesBatch,
    entitiesEventType,
    sqs,
    delay
  )
}
