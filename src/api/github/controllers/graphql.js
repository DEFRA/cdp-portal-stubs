const graphqlController = {
  handler: async (request, h) => {
    // here, we must figure out which gql query from the payload...

    const payload = request.payload

    console.log(payload)

    if(payload.query.search('enablePullRequestAutoMerge') > -1) {
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

    return h.response('Not implemented!').code(500)
  }
}

export { graphqlController }
