import convict from 'convict'
import path from 'path'

import { version } from '~/package.json'

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3939,
    env: 'PORT'
  },
  version: {
    doc: 'Api version',
    format: String,
    default: version
  },
  serviceName: {
    doc: 'Api Service Name',
    format: String,
    default: 'cdp-portal-stubs'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.normalize(path.join(__dirname, '..', '..'))
  },
  appPathPrefix: {
    doc: 'Application url path prefix this is needed only until we have host based routing',
    format: String,
    default: '/cdp-portal-stubs'
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'production'
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: process.env.NODE_ENV !== 'production'
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'test'
  },
  logLevel: {
    doc: 'Logging level',
    format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
    default: 'info',
    env: 'LOG_LEVEL'
  },
  mongoUri: {
    doc: 'URI for mongodb',
    format: '*',
    default: 'mongodb://127.0.0.1:27017/',
    env: 'MONGO_URI'
  },
  mongoDatabase: {
    doc: 'database for mongodb',
    format: '*',
    default: 'cdp-portal-stubs',
    env: 'MONGO_DATABASE'
  },
  mongoCertPath: {
    doc: 'path for mongodb TLS truststore',
    format: '*',
    env: 'MONGO_CERT_PATH'
  },
  githubOrg: {
    doc: 'github org to mock',
    format: 'String',
    default: 'defra',
    env: 'GITHUB_ORG'
  },
  awsRegion: {
    doc: 'AWS region',
    format: String,
    default: 'eu-west-2',
    env: 'AWS_REGION'
  },
  sqsEndpoint: {
    doc: 'AWS SQS endpoint',
    format: String,
    default: 'http://127.0.0.1:4566',
    env: 'SQS_ENDPOINT'
  },
  sqsGithubQueue: {
    doc: 'URL of sqs queue providing github events',
    format: String,
    default: 'http://127.0.0.1:4566/000000000000/github-events',
    env: 'SQS_GITHUB_QUEUE'
  },
  sqsEcrQueue: {
    doc: 'URL of sqs queue providing github events',
    format: String,
    default: 'http://127.0.0.1:4566/000000000000/ecr-push-events',
    env: 'SQS_ECR_QUEUE'
  },
  sqsEcsQueue: {
    doc: 'URL of sqs queue providing ECS deployment events',
    format: String,
    default: 'http://127.0.0.1:4566/000000000000/ecs-deployments',
    env: 'SQS_ECS_QUEUE'
  },
  get oidcBasePath() {
    return {
      doc: 'the base path all oidc stubs will be served from',
      format: String,
      default: `/${this.oidcTenantId.default}/v2.0`,
      env: 'OIDC_BASE_PATH'
    }
  },
  oidcTenantId: {
    doc: 'Tenant id to use in the oidc stub',
    format: String,
    env: 'OIDC_TENANT_ID',
    default: '6f504113-6b64-43f2-ade9-242e05780007'
  },
  oidcClientId: {
    doc: 'client id to use in the oidc stub',
    format: String,
    default: '26372ac9-d8f0-4da9-a17e-938eb3161d8e',
    env: 'OIDC_CLIENT_ID'
  },
  oidcClientSecret: {
    doc: 'the client secret key for the oidc stub',
    format: String,
    default: 'test_value',
    env: 'OIDC_CLIENT_SECRET'
  },
  oidcPublicKeyBase64: {
    doc: 'base 64 encoded public pem',
    format: String,
    default: undefined,
    env: 'OIDC_PUBLIC_KEY_B64'
  },
  oidcPrivateKeyBase64: {
    doc: 'base 64 encoded private pem',
    format: String,
    default: undefined,
    env: 'OIDC_PRIVATE_KEY_B64'
  },
  oidcShowLogin: {
    doc: 'if set, shows login page, else it auto logs in as admin',
    format: Boolean,
    default: false,
    env: 'OIDC_SHOW_LOGIN'
  },
  sqsTestRunsFromPortal: {
    doc: 'The queue hooked up to the test suite topic, would normally go to the lambda',
    format: String,
    default: 'http://127.0.0.1:4566/000000000000/run-test-from-portal',
    env: 'SQS_TEST_RUNS_FROM_PORTAL'
  },
  sqsMigrationsFromPortal: {
    doc: 'The queue hooked up to the migration suite topic, would normally go to the lambda',
    format: String,
    default: 'http://127.0.0.1:4566/000000000000/run-migrations-from-portal',
    env: 'SQS_MIGRATIONS_FROM_PORTAL'
  },
  sqsGitHubWorkflowEvents: {
    doc: 'The queue hooked up to the test suite topic, would normally go to the lambda',
    format: String,
    default: 'http://127.0.0.1:4566/000000000000/cdp_workflow_events',
    env: 'SQS_GITHUB_WORKFLOW_EVENTS'
  },
  sqsGrafanaNotification: {
    doc: 'The queue hooked up to the test suite topic, would normally go to the lambda',
    format: String,
    default: 'http://127.0.0.1:4566/000000000000/cdp_grafana_alerts',
    env: 'SQS_ALERTS_GRAFANA'
  },
  sqsGitHubNotification: {
    doc: 'The queue hooked up to the test suite topic, would normally go to the lambda',
    format: String,
    default: 'http://127.0.0.1:4566/000000000000/cdp-notify-github-events',
    env: 'SQS_ALERTS_GITHUB'
  },

  lambda: {
    secretsUpdates: {
      queueIn: {
        doc: 'A queue that normally receives messages from self service ops',
        format: String,
        default:
          'http://127.0.0.1:4566/000000000000/secret_management_updates_lambda',
        env: 'SQS_SECRET_UPDATES_LAMBDA'
      },
      queueOut: {
        doc: 'A queue that normally sends messages to cdp portal backend',
        format: String,
        default: 'http://127.0.0.1:4566/000000000000/secret_management_updates',
        env: 'SQS_SECRET_UPDATES'
      },
      delay: {
        doc: 'A delay before processing secrets and respond by a lambda',
        format: Number,
        default: '3',
        env: 'SQS_SECRET_UPDATES_DELAY'
      }
    }
  },
  sendGitHubWorkflowsOnStartup: {
    doc: 'Sends github workflow messages when the stubs start',
    format: Boolean,
    default: false,
    env: 'SEND_GITHUB_WORKFLOWS_ON_STARTUP'
  },
  slack: {
    queue: {
      doc: 'Queue attached to the slack lambda topic',
      format: String,
      default: 'http://127.0.0.1:4566/000000000000/stub-slack-messages',
      env: 'SQS_STUB_SLACK_MESSAGES'
    }
  }
})

config.validate({ allowed: 'strict' })

export { config }
