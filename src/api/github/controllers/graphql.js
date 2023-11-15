import { teamsAndReposData } from '~/src/api/github/content/teams-and-repos'

const graphqlController = {
  handler: async (request, h) => {
    // here, we must figure out which gql query from the payload...

    const payload = request.payload

    if (payload.query.search('enablePullRequestAutoMerge') > -1) {
      request.logger.info('auto-merge graphql statement')
      return h.response().code(201)
    }

    if (payload.query.search('associatedPullRequests') > -1) {
      request.logger.info('get branches graphql statement')
      // the find branches request
      return h
        .response({
          data: {
            repository: {
              ref: {
                associatedPullRequests: {
                  edges: []
                }
              }
            }
          }
        })
        .code(200)
    }

    if (payload.query.search('id teams') > -1) {
      request.logger.info('get teams graphql statement')

      const data = teamsAndReposData()
      return h.response(data).code(200)
    }

    return h.response('Not implemented!').code(500)
  }
}

export { graphqlController }
