import Joi from 'joi'
import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'

const schema = Joi.object({
  service: Joi.string().required(),
  request_id: Joi.string()
}).unknown(true)

export async function grafanaListPlaygroundsHandler(
  server,
  payload,
  attr = {}
) {
  Joi.assert(payload, schema)

  const response = {
    event_type: 'grafana_list_playgrounds',
    request_id: payload.request_id,
    service: payload.service,
    dashboards: [
      {
        uid: 'd0d9cc1f-abef-44ca-be1a-ee503b737326',
        title: `${payload.service} (custom)`,
        version: 2,
        url: `/d/d0d9cc1f-abef-44ca-be1a-ee503b737326/${payload.service}-custom`,
        created: '2026-06-18T15:21:13Z',
        updated: '2026-06-18T15:27:02Z'
      }
    ],
    alerts: [
      {
        uid: 'afh277iclp62of',
        name: `${payload.service} - 4xx error percentage`,
        type: 'custom',
        annotations: {
          summary:
            'Percentage of client error (HTTP 4xx) responses over total requests for fg-gas-backend, alerting when too many client requests fail.'
        }
      },
      {
        uid: 'ffh279a3uwc8wf',
        name: `${payload.service} - 5xx error percentage`,
        type: 'custom',
        annotations: {
          summary:
            'Percentage of client error (HTTP 5xx) responses over total requests for fg-gas-backend, alerting when too many client requests fail.'
        }
      }
    ]
  }
  const command = {
    QueueUrl: config.get('sqsLambdaEvents'),
    MessageBody: JSON.stringify(response),
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  server.logger.info('grafana_list_playgroundsHandler sending SQS', response)

  return server.sqs.send(new SendMessageCommand(command))
}
