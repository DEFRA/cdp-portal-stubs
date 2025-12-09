import { teams } from '~/src/api/github/content/teams-and-repos'

const tenantServices = {
  'cdp-portal-frontend': {
    name: 'cdp-portal-frontend',
    zone: 'public',
    mongo: false,
    redis: true,
    service_code: 'CDP',
    team: teams[0].slug
  },
  'cdp-portal-backend': {
    name: 'cdp-portal-backend',
    zone: 'protected',
    mongo: true,
    redis: false,
    service_code: 'CDP',
    queues: ['message_notification.fifo', 'message_clearance_request.fifo'],
    topics: ['decision_notification.fifo', 'error_notification.fifo'],
    buckets: ['management-cdp-portal-backend-*'],
    s3_buckets: [
      {
        name: 'management-cdp-portal-backend-c63f2',
        versioning: 'Disabled'
      },
      {
        name: 'management-cdp-portal-backend-images-c63f2',
        versioning: 'Disabled'
      }
    ],
    sns_topics: [
      {
        name: 'decision_notification',
        cross_account_allow_list: [],
        fifo_topic: 'true',
        content_based_deduplication: false
      },
      {
        name: 'error_notification',
        cross_account_allow_list: [],
        fifo_topic: 'true',
        content_based_deduplication: false
      }
    ],
    sqs_queues: [
      {
        name: 'message_clearance_request',
        cross_account_allow_list: [],
        fifo_queue: 'true',
        content_based_deduplication: false,
        dlq_max_receive_count: 3,
        visibility_timeout_seconds: 300,
        subscriptions: [
          {
            queue_name: 'message_clearance_request.fifo',
            topics: ['error_notification.fifo'],
            filter_enabled: false,
            filter_policy: ''
          }
        ]
      },
      {
        name: 'message_notification',
        cross_account_allow_list: [],
        fifo_queue: 'true',
        content_based_deduplication: false,
        dlq_max_receive_count: 3,
        visibility_timeout_seconds: 300,
        subscriptions: [
          {
            queue_name: 'message_notification.fifo',
            topics: ['decision_notification.fifo', 'error_notification.fifo'],
            filter_enabled: false,
            filter_policy: ''
          }
        ]
      }
    ]
  },
  'cdp-self-service-ops': {
    name: 'cdp-self-service-ops',
    zone: 'protected',
    mongo: true,
    redis: false,
    service_code: 'CDP',
    queues: [],
    topics: [],
    buckets: [],
    s3_buckets: [],
    sns_topics: [],
    sqs_queues: []
  },
  'cdp-user-service': {
    name: 'cdp-user-service',
    zone: 'protected',
    mongo: true,
    redis: false,
    service_code: 'CDP',
    queues: [],
    topics: [],
    buckets: [],
    s3_buckets: [],
    sns_topics: [],
    sqs_queues: []
  },
  'cdp-env-test-suite': {
    name: 'cdp-env-test-suite',
    zone: 'public',
    mongo: false,
    redis: false,
    rds_aurora_postgres: false,
    test_suite: 'cdp-env-test-suite',
    service_code: 'CDP',
    queues: [],
    topics: [],
    buckets: [],
    s3_buckets: [],
    sns_topics: [],
    sqs_queues: []
  },
  'cdp-postgres-service': {
    name: 'cdp-postgres-service',
    zone: 'protected',
    mongo: false,
    redis: false,
    rds_aurora_postgres: true,
    test_suite: 'cdp-env-test-suite',
    service_code: 'CDP',
    queues: [],
    topics: [],
    buckets: [],
    s3_buckets: [],
    sns_topics: [],
    sqs_queues: []
  },
  'tenant-backend': {
    name: 'tenant-backend',
    zone: 'protected',
    mongo: true,
    redis: false,
    rds_aurora_postgres: false,
    service_code: 'CDP',
    queues: [],
    topics: [],
    buckets: [],
    s3_buckets: [],
    sns_topics: [],
    sqs_queues: []
  }
}

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
  { topic: { name: 'test-suite' } },
  { topic: { name: 'test' } }
]

const topicsPerfTestSuite = [
  { topic: { name: 'cdp' } },
  { topic: { name: 'tests' } },
  { topic: { name: 'test-suite' } },
  { topic: { name: 'performance' } }
]

const githubRepos = [
  {
    name: 'cdp-portal-frontend',
    topics: topicsFrontendService,
    team: teams[0].slug,
    createdAt: '2016-12-05T11:21:25Z'
  },
  {
    name: 'cdp-portal-backend',
    topics: topicsBackendService,
    team: teams[0].slug,
    createdAt: '2016-12-05T11:21:25Z'
  },
  {
    name: 'cdp-self-service-ops',
    topics: topicsBackendService,
    team: teams[0].slug,
    createdAt: '2016-12-05T11:21:25Z'
  },
  {
    name: 'cdp-user-service',
    topics: topicsBackendService,
    team: teams[0].slug,
    createdAt: '2016-12-05T11:21:25Z'
  },
  {
    name: 'cdp-env-test-suite',
    topics: topicsTestSuite,
    team: teams[0].slug,
    createdAt: '2016-12-05T11:21:25Z'
  },
  {
    name: 'cdp-postgres-service',
    topics: topicsBackendService,
    team: teams[0].slug,
    createdAt: '2016-12-05T11:21:25Z'
  },
  {
    name: 'tenant-backend',
    topics: topicsBackendService,
    team: teams[4].slug,
    createdAt: '2024-12-05T11:21:25Z'
  }
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
  },
  'cdp-postgres-service': {
    runMode: 'service',
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
