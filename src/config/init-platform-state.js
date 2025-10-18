import { teams } from '~/src/api/github/content/teams-and-repos'
import {
  createQueue,
  createTenant
} from '~/src/api/platform-state-lambda/create-tenant'
import { environmentMappings } from '~/src/config/environments'

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
    sqs_queues: [
      {
        name: 'message_clearance_request',
        fifo_queue: 'true',
        content_based_deduplication: false,
        subscriptions: ['error_notification.fifo']
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
    subtype: 'Backend'
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
  }

  // TODO: add queues, dbs etc
  for (const config of defaultTenants) {
    if (!config.sqs_queues) continue

    config.sqs_queues.forEach((queue) => {
      Object.keys(environmentMappings).forEach((env) => {
        createQueue(config.name, env, queue)
      })
    })
  }
}

export { initPlatformState }
