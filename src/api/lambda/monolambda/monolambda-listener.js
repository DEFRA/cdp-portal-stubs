import { config } from '~/src/config'
import { Consumer } from 'sqs-consumer'
import { grafanaListPlaygroundsHandler } from '~/src/api/lambda/monolambda/handlers/grafana-list-playgrounds-handler'
import { manageShutteringHandler } from '~/src/api/lambda/monolambda/handlers/manage-shuttering-handler'
import { sendSlackNotificationHandler } from '~/src/api/lambda/monolambda/handlers/send-slack-notification-handler'
import { createGrafanaSnapshotHandler } from '~/src/api/lambda/monolambda/handlers/create-grafana-snapshot-handler'

function monolambdaListener(server) {
  const queueUrl = config.get('lambda.monolambda.queueIn')

  server.logger.info(`Listening for monolambda events on ${queueUrl}`)

  const sqs = server.sqs
  const listener = Consumer.create({
    queueUrl,
    attributeNames: ['SentTimestamp'],
    messageAttributeNames: ['All'],
    handleMessage: async (sqsMessage) => {
      try {
        const body = JSON.parse(sqsMessage.Body)
        const attrs = {}

        Object.keys(body.MessageAttributes).forEach((key) => {
          attrs[key] = body.MessageAttributes[key].Value
        })

        const message = JSON.parse(body.Message)
        const eventType = message.event_type
        const payload = message.payload

        switch (message.event_type) {
          case 'grafana_list_playgrounds':
            await grafanaListPlaygroundsHandler(server, payload, attrs)
            break
          case 'create_grafana_snapshots':
            await createGrafanaSnapshotHandler(server, payload, attrs)
            break
          case 'manage_shuttering':
            await manageShutteringHandler(server, payload, attrs)
            break
          case 'send_slack_notification':
            await sendSlackNotificationHandler(server, payload, attrs)
            break
          case 'add_ephemeral_api_key':
            // We don't actually need to do anything server-side to mock this
            server.logger.info('Adding ephemeral api key')
            break
          default:
            server.logger.info(`No mock for monolambda event ${eventType}`)
        }

        return sqsMessage
      } catch (err) {
        server.logger.error(
          err,
          'MonoLambda: Failed to handle message',
          sqsMessage
        )
      }
    },
    sqs
  })

  listener.on('error', (error) => {
    server.logger.error(error.message, error)
  })

  listener.on('processing_error', (error) => {
    server.logger.error(error.message, error)
  })

  listener.on('timeout_error', (error) => {
    server.logger.error(error.message, error)
  })

  listener.start()

  return listener
}

export const monolambdaPlugin = {
  plugin: {
    name: 'monolambda',
    version: '1.0.0',
    register: function (server) {
      monolambdaListener(server)
    }
  }
}
