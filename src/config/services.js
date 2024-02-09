const tenantServices = [
  {
    'cdp-portal-frontend': {
      zone: 'public',
      mongo: false,
      redis: true
    },
    'cdp-portal-backend': {
      zone: 'protected',
      mongo: true,
      redis: false
    },
    'cdp-self-service-ops': {
      zone: 'protected',
      mongo: true,
      redis: false
    },
    'cdp-user-service': {
      zone: 'protected',
      mongo: true,
      redis: false
    }
  }
]

const topicsService = [
  { topic: { name: 'cdp' } },
  { topic: { name: 'service' } }
]
const topicsTestSuite = [
  { topic: { name: 'cdp' } },
  { topic: { name: 'tests' } }
]

const githubRepos = [
  { name: 'cdp-portal-frontend', topics: topicsService },
  { name: 'cdp-portal-backend', topics: topicsService },
  { name: 'cdp-self-service-ops', topics: topicsService },
  { name: 'cdp-user-service', topics: topicsService }
]

const ecrRepos = {
  'cdp-portal-frontend': ['0.1.0', '0.2.0', '0.3.0'],
  'cdp-portal-backend': ['0.1.0', '0.2.0', '0.3.0'],
  'cdp-self-service-ops': ['0.1.0', '0.2.0', '0.3.0'],
  'cdp-user-service': ['0.1.0', '0.2.0', '0.3.0']
}

export { tenantServices, githubRepos, ecrRepos, topicsTestSuite, topicsService }
