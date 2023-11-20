const { config } = require('~/src/config')
const { SQSClient } = require('@aws-sdk/client-sqs')

const sqsPlugin = {
  name: 'sqs',
  version: '1.0.0',
  register: async function (server) {
    const sqsClient = new SQSClient({
      region: config.get('awsRegion'),
      endpoint: config.get('awsEndpoint')
    })

    server.decorate('server', 'sqs', sqsClient)
    server.decorate('request', 'sqs', sqsClient)
  }
}

export { sqsPlugin }
