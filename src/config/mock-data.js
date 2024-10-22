const tenantServices = [
  {
    'cdp-portal-frontend': {
      zone: 'public',
      mongo: false,
      redis: true,
      service_code: 'CDP'
    },
    'cdp-portal-backend': {
      zone: 'protected',
      mongo: true,
      redis: false,
      service_code: 'CDP'
    },
    'cdp-self-service-ops': {
      zone: 'protected',
      mongo: true,
      redis: false,
      service_code: 'CDP'
    },
    'cdp-user-service': {
      zone: 'protected',
      mongo: true,
      redis: false,
      service_code: 'CDP'
    },
    'cdp-env-test-suite': {
      zone: 'public',
      mongo: false,
      redis: false,
      test_suite: 'cdp-env-test-suite',
      service_code: 'CDP'
    }
  }
]

const topicsFrontendService = [
  { topic: { name: 'cdp' } },
  { topic: { name: 'service' } },
  { topic: { name: 'node' } },
  { topic: { name: 'frontend' } }
]
const topicsBackendService = [
  { topic: { name: 'cdp' } },
  { topic: { name: 'service' } },
  { topic: { name: 'node' } },
  { topic: { name: 'backend' } }
]
const topicsTestSuite = [
  { topic: { name: 'cdp' } },
  { topic: { name: 'environment' } },
  { topic: { name: 'test' } }
]

const topicsPerfTestSuite = [
  { topic: { name: 'cdp' } },
  { topic: { name: 'tests' } },
  { topic: { name: 'performance' } }
]

const githubRepos = [
  { name: 'cdp-portal-frontend', topics: topicsFrontendService },
  { name: 'cdp-portal-backend', topics: topicsBackendService },
  { name: 'cdp-self-service-ops', topics: topicsBackendService },
  { name: 'cdp-user-service', topics: topicsBackendService },
  { name: 'cdp-env-test-suite', topics: topicsTestSuite }
]

const ecrRepos = {
  'cdp-portal-frontend': {
    runMode: 'service',
    tags: ['0.1.0', '0.2.0', '0.3.0']
  },
  'cdp-portal-backend': {
    runMode: 'service',
    tags: ['0.1.0', '0.2.0', '0.3.0']
  },
  'cdp-self-service-ops': {
    runMode: 'service',
    tags: ['0.1.0', '0.2.0', '0.3.0']
  },
  'cdp-user-service': {
    runMode: 'service',
    tags: ['0.1.0', '0.2.0', '0.3.0']
  },
  'cdp-env-test-suite': {
    runMode: 'job',
    tags: ['0.1.0']
  }
}

export {
  tenantServices,
  githubRepos,
  ecrRepos,
  topicsTestSuite,
  topicsFrontendService,
  topicsBackendService,
  topicsPerfTestSuite
}
