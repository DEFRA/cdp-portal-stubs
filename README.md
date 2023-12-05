# CDP Portal Stubs

A set of stubs for mocking calls to Github, Aws and Microsoft OIDC for the cdp-portal suite of applications.

- [CDP Portal Stubs](#cdp-portal-stubs)
  - [What it currently provides](#what-it-currently-provides)
  - [Setup](#setup)
    - [MongoDB](#mongodb)
      - [Start MongoDB](#start-mongodb)
    - [Redis](#redis)
    - [Localstack](#localstack)
      - [Create queues](#create-queues)
    - [start cdp-portal-backend](#start-cdp-portal-backend)
    - [start cdp-self-service-ops](#start-cdp-self-service-ops)
    - [Start cdp-user-services](#start-cdp-user-service-backend)
    - [Start cdp-portal-frontend](#start-cdp-portal-frontend)
    - [Start cdp-portal-stubs](#start-cdp-portal-stubs)
  - [Test Data](#test-data)

## What it currently provides

Mock calls for github apis:

- Get/Set repo content
- Raise a PR
- Get Commit history
- Get repo data
- Trigger workflow
- Various graphql queries for enabling automerge and listing team data

Raising a PR will also result in a github webhook message being posted to the githubEvents queue, and in some cases a
workflow complete message.
Creating a new repository results in a workflow run complete message.

Mocks calls to an ECR repository

- Lists available repositories
- Gets manifest
- Gets minimal layers

An admin endpoint is provided to simulate a new image being pushed `POST /_admin/trigger-ecr-push/{repo}/{tag}`

## Setup

### MongoDB

Install [MongoDB](https://www.mongodb.com/docs/manual/tutorial/#installation) on your local machine

#### Start MongoDB

```bash
sudo mongod --dbpath ~/mongodb-cdp
```

### Redis

[https://redis.io/docs/getting-started/installation](https://redis.io/docs/getting-started/installation)

### Localstack

```bash
docker run -d -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack:latest
```

#### Create queues

```bash
awslocal sqs create-queue --queue-name ecr-push-deployments --region eu-west-2
awslocal sqs create-queue --queue-name ecs-deployments --region eu-west-2
awslocal sqs create-queue --queue-name ecr-push-events --region eu-west-2
awslocal sqs create-queue --queue-name github-events --region eu-west-2
```

### Start cdp-portal-backend

[DEFRA/cdp-portal-backend](https://github.com/DEFRA/cdp-portal-backend)

You can add the following to `launchSettings.json` in your checkout of the `cdp-portal-backend`

> Note please obtain the test `Github__AppKey` from another dev

```json5
{
  // other launch settings
  Stubbed: {
    commandName: 'Project',
    dotnetRunMessages: true,
    launchBrowser: false,
    applicationUrl: 'http://localhost:5094',
    environmentVariables: {
      ASPNETCORE_ENVIRONMENT: 'Development',
      Mongo__DatabaseUri: 'mongodb://127.0.0.1:27017',
      AzureAd__Instance: 'http://localhost:3939/',
      AzureAd__RequireHttpsMetadata: 'false',
      Github__AppKey: '<OBTAIN_FROM_ANOTHER_DEV>',
      Github__ApiUrl: 'http://localhost:3939'
    }
  }
}
```

Run

```bash
dotnet run --project Defra.Cdp.Backend.Api --launch-profile Stubbed
```

### Start cdp-self-service-ops

[DEFRA/cdp-self-service-ops](https://github.com/DEFRA/cdp-self-service-ops)

Override the following config items/environment variables:

```bash
export GITHUB_BASE_URL=http://localhost:3939
export OIDC_WELL_KNOWN_CONFIGURATION_URL=http://localhost:3939/63983fc2-cfff-45bb-8ec2-959e21062b9a/v2.0/.well-known/openid-configuration
```

Override using `npm` scripts

```bash
GITHUB_BASE_URL=http://localhost:3939 OIDC_WELL_KNOWN_CONFIGURATION_URL=http://localhost:3939/63983fc2-cfff-45bb-8ec2-959e21062b9a/v2.0/.well-known/openid-configuration npm run dev
```

### Start cdp-user-service-backend

[DEFRA/cdp-user-service-backend](https://github.com/DEFRA/cdp-user-service-backend)

Override the following config items/environment variables:

```bash
export GITHUB_BASE_URL=http://localhost:3939
export OIDC_WELL_KNOWN_CONFIGURATION_URL=http://localhost:3939/63983fc2-cfff-45bb-8ec2-959e21062b9a/v2.0/.well-known/openid-configuration
export OIDC_AUDIENCE=63983fc2-cfff-45bb-8ec2-959e21062b9a
```

Override using `npm` scripts

```bash
GITHUB_BASE_URL=http://localhost:3939 OIDC_WELL_KNOWN_CONFIGURATION_URL=http://localhost:3939/63983fc2-cfff-45bb-8ec2-959e21062b9a/v2.0/.well-known/openid-configuration  OIDC_AUDIENCE=63983fc2-cfff-45bb-8ec2-959e21062b9a npm run dev
```

### Start cdp-portal-frontend

[DEFRA/cdp-portal-frontend](https://github.com/DEFRA/cdp-portal-frontend)

Override the following config items/environment variables:

```bash
export AZURE_CLIENT_SECRET=test_value
export GITHUB_BASE_URL=http://localhost:3939
export OIDC_WELL_KNOWN_CONFIGURATION_URL=http://localhost:3939/63983fc2-cfff-45bb-8ec2-959e21062b9a/v2.0/.well-known/openid-configuration
export AZURE_TENANT_ID=63983fc2-cfff-45bb-8ec2-959e21062b9a
export APP_BASE_URL=http://localhost:3000
```

Override using `npm` scripts

```bash
AZURE_CLIENT_SECRET=test_value GITHUB_BASE_URL=http://localhost:3939  OIDC_WELL_KNOWN_CONFIGURATION_URL=http://localhost:3939/63983fc2-cfff-45bb-8ec2-959e21062b9a/v2.0/.well-known/openid-configuration AZURE_TENANT_ID=63983fc2-cfff-45bb-8ec2-959e21062b9a APP_BASE_URL=http://localhost:3000 npm run dev
```

### Start cdp-portal-stubs

Run in watch (dev) mode:

> Note with watch mode your refresh tokens will not work. You will have to sign out and in again to get a valid token

```bash
npm run dev
```

Run:

```bash
npm start
```

## Test Data

The base set of services is held in /config/services.js. Adding or removing services to this list will result in them
being returned in the mock API calls.
