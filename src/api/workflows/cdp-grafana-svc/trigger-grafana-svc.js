import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'
import { environmentMappings } from '~/src/config/environments'
import { tenantServices } from '~/src/config/mock-data'
import crypto from 'node:crypto'

export async function triggerGrafanaSvc(sqs) {
  const environments = Object.keys(environmentMappings)
  const eventType = 'grafana-dashboard'

  const batch = environments.map((environment) => {
    const entities = Object.keys(tenantServices(environment))

    const payload = JSON.stringify(
      workflowEvent(eventType, {
        environment,
        entities
      })
    )
    return {
      Id: crypto.randomUUID(),
      MessageBody: payload
    }
  })

  await sendWorkflowEventsBatchMessage(batch, eventType, sqs)
}
