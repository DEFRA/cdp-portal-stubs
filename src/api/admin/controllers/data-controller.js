import { ecrRepos, githubRepos } from '~/src/config/mock-data'
import { sessions } from '~/src/api/oidc/helpers/session-store'
import { platformState } from '~/src/api/platform-state-lambda/platform-state'
import { teamsAndUsers } from '~/src/config/teams-and-users'

const dataController = {
  handler: async (request, h) => {
    const data = {
      github: githubRepos,
      ecr: ecrRepos,
      platform: platformState,
      teams: teamsAndUsers.teams,
      users: teamsAndUsers.users,
      sessions
    }

    return h.response(data).code(200)
  }
}

export { dataController }
