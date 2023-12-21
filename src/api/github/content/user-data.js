const githubUsers = [
  {
    github: 'cdp-foo-0911234',
    name: 'Foo Barr'
  },
  {
    github: 'cdp-bar-74629590',
    name: 'Bar Barrington'
  },
  {
    github: 'cdp-test-441241',
    name: 'Test Testing'
  }
]

const userData = {
  data: {
    organization: {
      membersWithRole: {
        nodes: githubUsers,
        pageInfo: {
          hasNextPage: false,
          endCursor: 'Y3Vyc29yOnYyOpHOAAM-Zg=='
        }
      }
    }
  }
}

export { githubUsers, userData }
