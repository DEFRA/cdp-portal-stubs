import {
  filterReposBySearchQuery,
  mapGithubRepo
} from '~/src/api/github/helpers/map-github-repo'

describe('map-github-repo helpers', () => {
  const repos = [
    {
      name: 'with-cdp',
      topics: [{ topic: { name: 'cdp' } }, { topic: { name: 'service' } }],
      team: 'cdp-platform',
      createdAt: '2016-12-05T11:21:25Z'
    },
    {
      name: 'without-cdp',
      topics: [{ topic: { name: 'other' } }],
      team: 'cdp-platform',
      createdAt: '2016-12-05T11:21:25Z'
    }
  ]

  test('filters by topic from the search query', () => {
    const filtered = filterReposBySearchQuery(repos, 'org:DEFRA topic:cdp')

    expect(filtered.map((repo) => repo.name)).toEqual(['with-cdp'])
  })

  test('maps repo into graphql repository shape', () => {
    expect(mapGithubRepo(repos[0])).toEqual({
      name: 'with-cdp',
      description: '',
      primaryLanguage: { name: 'JavaScript' },
      url: 'https://github.com/DEFRA/with-cdp',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: '2016-12-05T11:21:25Z',
      repositoryTopics: {
        nodes: [{ topic: { name: 'cdp' } }, { topic: { name: 'service' } }]
      }
    })
  })
})
