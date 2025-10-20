import { teams } from '~/src/api/github/content/teams-and-repos'
import {
  addBucket,
  addQueue,
  createTenant,
  addTopic,
  addSqlDatabase
} from '~/src/api/platform-state-lambda/create-tenant'
import { environments } from '~/src/config/environments'

const defaultTenants = [
  {
    name: 'cdp-portal-frontend',
    zone: 'public',
    mongo: false,
    redis: true,
    service_code: 'CDP',
    team: teams[0].slug,
    type: 'Microservice',
    subtype: 'Frontend'
  },
  {
    name: 'cdp-portal-backend',
    zone: 'protected',
    mongo: true,
    redis: false,
    service_code: 'CDP',
    team: teams[0].slug,
    type: 'Microservice',
    subtype: 'Backend',
    s3_buckets: [
      {
        name: 'cdp-portal-backend',
        versioning: 'Disabled'
      },
      {
        name: 'cdp-portal-backend-images',
        versioning: 'Disabled'
      }
    ],
    sqs_queues: [
      {
        name: 'message_clearance_request',
        fifo_queue: 'true',
        content_based_deduplication: false,
        subscriptions: ['error_notification.fifo']
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
    ]
  },
  {
    name: 'cdp-self-service-ops',
    zone: 'protected',
    mongo: true,
    redis: false,
    service_code: 'CDP',
    team: teams[0].slug,
    type: 'Microservice',
    subtype: 'Backend'
  },
  {
    name: 'cdp-postgres-service',
    zone: 'protected',
    mongo: false,
    redis: false,
    service_code: 'CDP',
    team: teams[0].slug,
    type: 'Microservice',
    subtype: 'Backend',
    rds_aurora_postgres: [
      {
        instance_count: 1,
        min_capacity: 0.5,
        max_capacity: 4.0
      }
    ]
  },
  {
    name: 'tenant-backend',
    zone: 'protected',
    mongo: true,
    redis: false,
    service_code: 'CDP',
    team: teams[4].slug,
    type: 'Microservice',
    subtype: 'Backend'
  },
  {
    name: 'cdp-env-test-suite',
    zone: 'public',
    mongo: false,
    redis: false,
    test_suite: 'cdp-env-test-suite',
    service_code: 'CDP',
    type: 'TestSuite',
    subtype: 'Journey'
  }
]

function initPlatformState() {
  for (const config of defaultTenants) {
    createTenant(config.name, config)

    if (config.sqs_queues) {
      config.sqs_queues.forEach((queue) =>
        addQueue(config.name, environments, queue)
      )
    }

    if (config.sns_topics) {
      config.sns_topics.forEach((topic) =>
        addTopic(config.name, environments, topic)
      )
    }

    if (config.s3_buckets) {
      config.s3_buckets.forEach((bucket) =>
        // TODO: bucket names are unique per env, for now we just send the management one
        addBucket(config.name, ['management'], bucket)
      )
    }

    if (config.rds_aurora_postgres) {
      addSqlDatabase(config.name, environments)
    }
  }
}

export { initPlatformState }
