import { graphql } from 'graphql/graphql'
import { githubSchema } from '~/src/api/github/controllers/graphql/schema'

const graphqlController = {
  handler: async (request, h) => {
    request.logger.info(request.payload)
    const { query, variables, operationName } = request.payload

    const result = await graphql({
      schema: githubSchema,
      source: query,
      variableValues: variables,
      operationName
    })

    if (result.errors) {
      request.logger.error(result.errors, 'Failed to handel graphql request')
    }

    return h.response(result).code(200)
  }
}

export { graphqlController }
