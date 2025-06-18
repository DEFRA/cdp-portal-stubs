const { config } = require('~/src/config')
const { SQSClient } = require('@aws-sdk/client-sqs')

let sqsClient = null

const sqsPlugin = {
  name: 'sqs',
  version: '1.0.0',
  register: async function (server) {
    if (sqsClient === null) {
      sqsClient = new SQSClient({
        region: config.get('awsRegion'),
        endpoint: config.get('sqsEndpoint')
      })
    }
    server.decorate('server', 'sqs', sqsClient)
    server.decorate('request', 'sqs', sqsClient)
  }
}

export { sqsPlugin, sqsClient }
