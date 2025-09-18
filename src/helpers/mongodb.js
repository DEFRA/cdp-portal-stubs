import { MongoClient } from 'mongodb'

const mongoDb = {
  plugin: {
    name: 'mongoDb',
    version: '1.0.0',
    register: async function (server, options) {
      server.logger.info('Setting up mongodb')

      const client = await MongoClient.connect(
        options.mongoUrl,
        options.mongoOptions
      )

      const { databaseName } = options
      const db = client.db(databaseName)

      server.logger.info(`mongodb connected to ${databaseName}`)

      server.decorate('server', 'mongoClient', client)
      server.decorate('request', 'mongoClient', client)

      server.decorate('server', 'db', db)
      server.decorate('request', 'db', db)

      server.events.on('stop', () => {
        server.logger.info('Closing Mongo client')
        return client.close(true)
      })
    }
  }
}

export { mongoDb }
