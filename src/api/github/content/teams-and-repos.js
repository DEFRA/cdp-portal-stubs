import { githubRepos } from '~/src/config/mock-data'

const teams = [
  {
    slug: 'cdp-platform',
    name: 'CDP Platform Team'
  },
  {
    slug: 'cdp-test-1',
    name: 'CDP Test 1 Team'
  },
  {
    slug: 'cdp-test-2',
    name: 'CDP Test 2 Team'
  },
  {
    slug: 'cdp-test-3',
    name: 'CDP Test 3 Team'
  }
]

const teamsData = () => {
  return {
    data: {
      organization: {
        teams: {
          nodes: teams
        },
        pageInfo: {
          hasNextPage: false,
          endCursor: 'Y3Vyc29yOnYyOpMCs0FEUC1QbGF0Zm9ybS1BZG1pbnPOAIFBcA=='
        }
      }
    }
  }
}

const teamsAndReposData = () => {
  return {
    data: {
      organization: {
        id: 'MDEyOk9yZ2FuaXphdGlvbjU1Mjg4MjI=',
        teams: {
          pageInfo: {
            hasNextPage: false,
            endCursor: 'Y3Vyc29yOnYyOpMCsVdhdGVyIEFic3RyYWN0aW9uzgAlEAg='
          },
          nodes: githubRepos.map(teamRepositoryNode)
        }
      }
    }
  }
}

function reposDataForTeam(teamSlug) {
  return {
    data: {
      organization: {
        id: 'MDEyOk9yZ2FuaXphdGlvbjU1Mjg4MjI=',
        team: {
          repositories: {
            pageInfo: {
              hasNextPage: false,
              endCursor: 'Y3Vyc29yOnYyOpMCsVdhdGVyIEFic3RyYWN0aW9uzgAlEAg='
            },
            nodes: githubRepos
              .filter((repo) => repo.team === teamSlug)
              .map(repositoryNode)
          }
        }
      }
    }
  }
}

const teamRepositoryNode = (service) => {
  return {
    slug: service.team,
    repositories: {
      nodes: [repositoryNode(service)]
    }
  }
}

const repositoryNode = (service) => {
  return {
    name: service.name,
    repositoryTopics: {
      nodes: service.topics
    },
    description: service.name,
    primaryLanguage: {
      name: 'JavaScript'
    },
    url: `https://github.com/DEFRA/${service.name}`,
    isArchived: false,
    isTemplate: false,
    isPrivate: false,
    createdAt: service.createdAt
  }
}

export { teamsData, teamsAndReposData, teams, reposDataForTeam }
