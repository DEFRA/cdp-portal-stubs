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
    default: 'defra-cdp-sandpit',
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
  oidcBasePath: {
    doc: 'the base path all oidc stubs will be served from',
    format: String,
    default: '/63983fc2-cfff-45bb-8ec2-959e21062b9a/v2.0',
    env: 'OIDC_BASE_PATH'
  },
  oidcClientId: {
    doc: 'client id to use in the oidc stub',
    format: String,
    default: '63983fc2-cfff-45bb-8ec2-959e21062b9a',
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
  }
})

config.validate({ allowed: 'strict' })

export { config }
