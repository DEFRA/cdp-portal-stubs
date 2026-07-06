import Joi from 'joi'
import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'

const schema = Joi.object({
  request_id: Joi.string(),
  dashboard_names: Joi.array().items(Joi.string())
}).unknown(true)

export async function createGrafanaSnapshotHandler(server, payload, attr = {}) {
  Joi.assert(payload, schema)

  const response = {
    event_type: 'create_grafana_snapshot',
    request_id: payload.request_id,
    snapshot_urls: payload.dashboard_names.map((name) => ({
      dashboard_name: name,
      dashboard_uid: crypto.randomUUID().toLowerCase(),
      url: `http://metrics/dashboard/${name}/snapshot/${crypto
        .randomUUID()
        .toLowerCase()}`
    }))
  }

  const command = {
    QueueUrl: config.get('sqsLambdaEvents'),
    MessageBody: JSON.stringify(response),
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  server.logger.info('create_grafana_snapshot sending SQS', response)

  return server.sqs.send(new SendMessageCommand(command))
}
