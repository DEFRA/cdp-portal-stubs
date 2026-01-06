import { commitDeploymentFile } from '~/src/api/github/controllers/commit-deployment-file'
import { githubUsers } from '~/src/api/github/content/user-data'
import { teams } from '~/src/api/github/content/teams-and-repos'
import { githubRepos } from '~/src/config/mock-data'

export const resolvers = {
  GitObjectID: {
    __parseValue(value) {
      return value
    },
    __serialize(value) {
      return value
    },
    __parseLiteral(ast) {
      return ast.value
    }
  },
  Base64String: {
    __parseValue(value) {
      return value
    },
    __serialize(value) {
      return value
    },
    __parseLiteral(ast) {
      return ast.value
    }
  },

  Mutation: {
    createCommitOnBranch: (_, args) => {
      const { input } = args
      if (
        input?.branch?.repositoryNameWithOwner === 'DEFRA/cdp-app-deployments'
      ) {
        commitDeploymentFile(input).then()
      }

      return {
        clientMutationId: input.clientMutationId || null
      }
    }
  },

  Query: {
    user: (_, { login }) => ({ login }),
    organization: (_, { login }) => ({ login }),

    repository: (_, { name }) => {
      const repo = githubRepos.find((r) => r.name === name)
      return (
        repo && {
          name: repo.name,
          description: '',
          primaryLanguage: { name: 'JavaScript' },
          url: `https://github.com/DEFRA/${repo.name}`,
          isArchived: false,
          isTemplate: false,
          isPrivate: false,
          createdAt: repo.createdAt,
          repositoryTopics: {
            nodes: repo.topics
          }
        }
      )
    }
  },

  User: {
    login: (user) => {
      const foundUser = githubUsers.find((u) => u.login === user.login)
      if (!foundUser) {
        throw new Error(
          `Could not resolve to a User with the login of '${user.login}'`
        )
      }
      return user.login
    },
    organization: (user, { login }) => {
      if (login.toUpperCase() !== 'DEFRA') {
        return null
      }
      return { login }
    }
  },

  Organization: {
    login: (org) => org.login,
    team: (_, { slug }) => ({ slug }),
    teams: (_, { first, after }) => ({
      nodes: teams,
      pageInfo: { hasNextPage: false, endCursor: null }
    }),
    membersWithRole: ({ first = 100, after }) => ({
      pageInfo: { hasNextPage: false, endCursor: null },
      nodes: githubUsers
    })
  },

  Team: {
    repositories: (team, { first, after }) => {
      const hasNextPage = false
      const endCursor = null

      const repos = githubRepos
        .filter((r) => r.team === team.slug)
        .map((r) => ({
          name: r.name,
          description: '',
          primaryLanguage: { name: 'JavaScript' },
          url: `https://github.com/DEFRA/${r.name}`,
          isArchived: false,
          isTemplate: false,
          isPrivate: false,
          createdAt: r.createdAt,
          repositoryTopics: {
            nodes: r.topics
          }
        }))

      return {
        pageInfo: { hasNextPage, endCursor },
        nodes: repos
      }
    }
  }
}
