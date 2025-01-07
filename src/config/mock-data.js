const tenantServices = [
  {
    'cdp-portal-frontend': {
      name: 'cdp-portal-frontend',
      zone: 'public',
      mongo: false,
      redis: true,
      service_code: 'CDP'
    },
    'cdp-portal-backend': {
      name: 'cdp-portal-backend',
      zone: 'protected',
      mongo: true,
      redis: false,
      service_code: 'CDP'
    },
    'cdp-self-service-ops': {
      name: 'cdp-self-service-ops',
      zone: 'protected',
      mongo: true,
      redis: false,
      service_code: 'CDP'
    },
    'cdp-user-service': {
      name: 'cdp-user-service',
      zone: 'protected',
      mongo: true,
      redis: false,
      service_code: 'CDP'
    },
    'cdp-env-test-suite': {
      name: 'cdp-env-test-suite',
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

function buckets(environment) {
  return [
    {
      name: `cdp-${environment}-forms-runner-c63f2`,
      exists: false,
      services_with_access: ['forms-runner']
    },
    {
      name: `cdp-${environment}-forms-manager-c63f2`,
      exists: false,
      services_with_access: ['forms-manager']
    },
    {
      name: `cdp-${environment}-cdp-example-node-frontend-c63f2`,
      exists: false,
      services_with_access: ['cdp-example-node-frontend']
    },
    {
      name: `${environment}-nms-frontend-alpha-c63f2`,
      exists: false,
      services_with_access: ['nms-backend-alpha', 'nms-frontend-alpha']
    },
    {
      name: `${environment}-epr-cdp-spike-rpd-s3-c63f2`,
      exists: false,
      services_with_access: []
    },
    {
      name: `${environment}-forms-submission-api-c63f2`,
      exists: false,
      services_with_access: ['forms-submission-api']
    },
    {
      name: `${environment}-eutd-fes-bc-c63f2`,
      exists: false,
      services_with_access: ['eutd-mmo-bc']
    },
    {
      name: `${environment}-find-ffa-data-ingester-c63f2`,
      exists: false,
      services_with_access: ['find-ffa-data-ingester']
    },
    {
      name: `${environment}-phi-etl-fera-backend-c63f2`,
      exists: false,
      services_with_access: ['phi-etl-fera-backend']
    },
    {
      name: `${environment}-btms-backend-c63f2`,
      exists: false,
      services_with_access: ['btms-backend']
    },
    {
      name: `${environment}-apha-file-frontend-c63f2`,
      exists: false,
      services_with_access: ['apha-file-frontend']
    }
  ]
}

const vanityUrls = {
  management: [
    {
      service: 'cdp-portal-frontend',
      url: 'portal.cdp-int.defra.cloud',
      shuttered: false,
      enabled: true
    }
  ],
  'infra-dev': [
    {
      service: 'cdp-portal-frontend',
      url: 'portal-test.cdp-int.defra.cloud',
      shuttered: true,
      enabled: true
    }
  ],
  prod: [
    {
      service: 'cdp-portal-frontend',
      url: 'portal.defra.gov',
      shuttered: false,
      enabled: false
    }
  ]
}

const appDeployments = {
  'infra-dev': {
    public: {
      'cdp-portal-frontend.json': {
        deploymentId: 'ead78ce6-f695-4b79-8cfc-d81020f2ef88',
        deploy: true,
        service: {
          name: 'cdp-portal-frontend',
          image: 'cdp-portal-frontend',
          version: '0.2.0',
          configuration: {
            commitSha: '5d8c8f63b22b2d3ff59aab7a4fcea0dd89204113'
          },
          serviceCode: 'CDP'
        },
        cluster: {
          environment: 'infra-dev',
          zone: 'public'
        },
        resources: {
          instanceCount: 2,
          cpu: 1024,
          memory: 2048
        },
        metadata: {
          user: {
            userId: '90552794-0613-4023-819a-512aa9d40023',
            displayName: 'admin'
          },
          deploymentEnvironment: 'infra-dev'
        }
      }
    }
  }
}

export {
  appDeployments,
  tenantServices,
  githubRepos,
  ecrRepos,
  topicsTestSuite,
  topicsFrontendService,
  topicsBackendService,
  topicsPerfTestSuite,
  buckets,
  vanityUrls
}
