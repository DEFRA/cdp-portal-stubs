import { githubRepos } from '~/src/config/services'

const teams = [
  {
    github: 'cdp-platform',
    name: 'CDP Platform Team'
  },
  {
    github: 'cdp-test-1',
    name: 'CDP Test 1 Team'
  },
  {
    github: 'cdp-test-2',
    name: 'CDP Test 2 Team'
  },
  {
    github: 'cdp-test-3',
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
          nodes: githubRepos.map(node)
        }
      }
    }
  }
}

const node = (service) => {
  return {
    slug: teams[0].github,
    repositories: {
      nodes: [
        {
          name: service.name,
          repositoryTopics: {
            nodes: service.topics
          },
          description: service.name,
          primaryLanguage: {
            name: 'JavaScript'
          },
          url: `https://localhost:3939/github/${service.name}`,
          isArchived: false,
          isTemplate: false,
          isPrivate: false,
          createdAt: '2016-12-05T11:21:25Z'
        }
      ]
    }
  }
}

export { teamsData, teamsAndReposData, teams }
