import {
  teams,
  teamsAndReposData,
  teamsData
} from '~/src/api/github/content/teams-and-repos'
import { githubUsers, userData } from '~/src/api/github/content/user-data'

const graphqlController = {
  handler: async (request, h) => {
    // here, we must figure out which gql query from the payload...

    const payload = request.payload
    request.logger.info(request.payload)

    if (payload.query.includes('enablePullRequestAutoMerge')) {
      request.logger.info('auto-merge graphql statement')
      return h.response().code(201)
    }

    if (payload.query.includes('associatedPullRequests')) {
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

    if (payload.query.includes('query orgUsers(')) {
      request.logger.info('get users')
      return h.response(userData).code(200)
    }

    if (payload.query.includes('query userExistsInOrg(')) {
      request.logger.info(`GraphQL userExistsInOrg: ${payload.variables.user}`)

      const user = githubUsers.find((g) => g.github === payload.variables.user)

      if (user !== undefined) {
        request.logger.info(`found ${user}`)
        const resp = {
          data: {
            user: {
              github: payload.variables.user,
              organization: {
                github: payload.variables.orgName
              }
            }
          }
        }
        return h.response(resp).code(200)
      }
      return h.response().code(404)
    }

    if (payload.query.includes('id teams')) {
      request.logger.info('get teams graphql statement')

      const data = teamsAndReposData()
      return h.response(data).code(200)
    }

    if (
      payload.query.includes(
        'query orgTeams($cursor: String, $orgName: String!)'
      )
    ) {
      return h.response(teamsData()).code(200)
    }

    if (
      payload.query.includes(
        'query teamExistsInOrg($team: String!, $orgName: String!) {'
      )
    ) {
      const team = teams.find((t) => t.github === payload.variables.team)
      if (team !== undefined) {
        const result = {
          data: {
            organization: {
              team: {
                github: payload.variables.team
              }
            }
          }
        }

        return h.response(result).code(200)
      }
    }

    if (payload.query.includes('createCommitOnBranch')) {
      return h.response({}).code(200)
    }

    request.logger.error(`unsupported graphql\n${payload.query}`)
    return h.response('Not implemented!').code(500)
  }
}

export { graphqlController }
