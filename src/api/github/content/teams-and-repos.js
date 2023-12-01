import { allServices } from '~/src/config/services'

const teamName = 'cdp-platform'

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
          nodes: allServices().map(node)
        }
      }
    }
  }
}

const node = (service) => {
  return {
    slug: teamName,
    repositories: {
      nodes: [
        {
          name: service,
          description: service,
          primaryLanguage: {
            name: 'JavaScript'
          },
          url: `https://localhost:3939/github/${service}`,
          isArchived: false,
          isTemplate: false,
          isPrivate: false,
          createdAt: '2016-12-05T11:21:25Z'
        }
      ]
    }
  }
}

export { teamsAndReposData }
