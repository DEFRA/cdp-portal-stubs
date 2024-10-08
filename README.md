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
    - [Start cdp-portal-stubs](#start-cdp-portal-stubs)
    - [start cdp-portal-backend](#start-cdp-portal-backend)
    - [start cdp-self-service-ops](#start-cdp-self-service-ops)
    - [Start cdp-user-services](#start-cdp-user-service-backend)
    - [Start cdp-portal-frontend](#start-cdp-portal-frontend)

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

## Default Data Set

See `~/src/config/mock-data.js` for the starting data set. As the stub is used thse records are updated. Note: these are
NOT currently persistent across restarts.

## Admin Endpoints

`POST /_admin/trigger-ecr-push/{repo}/{tag}?runMode=service` - simulates a docker image being published. runmode can be service or job.

`GET /_admin/oidc/sessions` - dumps the current ODIC sessions

`GET /_admin/data` - dumps the current state of the mock github/ecr/tenant data

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
awslocal sqs create-queue --queue-name deployments-from-portal --region eu-west-2
awslocal sqs create-queue --queue-name run-test-from-portal
awslocal sns create-topic --name run-test-topic
awslocal sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:run-test-topic --protocol sqs --notification-endpoint  arn:aws:sqs:eu-west-2:000000000000:run-test-from-portal
awslocal sns create-topic --name secret_management
awslocal sqs create-queue --queue-name secret_management_updates
awslocal sqs create-queue --queue-name secret_management_updates_lambda
awslocal sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:secret_management --protocol sqs --notification-endpoint  arn:aws:sqs:eu-west-2:000000000000:secret_management_updates
awslocal sns subscribe --topic-arn arn:aws:sns:eu-west-2:000000000000:secret_management --protocol sqs --notification-endpoint  arn:aws:sqs:eu-west-2:000000000000:secret_management_updates_lambda
```

### Setup cdp-portal-stubs

```bash
npm install
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

### Start cdp-portal-backend

[DEFRA/cdp-portal-backend](https://github.com/DEFRA/cdp-portal-backend)

Run in stubbed mode

> Note you need to generate a random key for local testing using
> `ssh-keygen -t rsa -b 4096 -m PEM -f /tmp/mock.key -q -P '' && cat /tmp/mock.key | base64 -w0`
> See [launchSettings.json](https://github.com/DEFRA/cdp-portal-backend/blob/b9dc08a84ec557966d3e8900896cf676f427f286/Defra.Cdp.Backend.Api/Properties/launchSettings.json#L27)

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

(Note: the OIDC url can be replaced with any value as long as its the same across local services, in this example we've used a random UUID)

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

## Test Data

The base set of services is held in /config/mock-data.js. Adding or removing services to this list will result in them
being returned in the mock API calls.

### Stub Secrets

#### Add secret

Add to pending in portal backend.

`curl -H "Content-Type: application/json" -d '{"environment":"infra-dev", "service": "cdp-portal-frontend","secretKey":"SOME_KEY","action":"add_secret"}'  http://localhost:5094/secrets/register/pending`

Add to queue that simulates the lambda consuming it after a slight delay.

`awslocal sqs send-message --queue-url "http://localhost:4566/000000000000/secret_management_updates_lambda" --region eu-west-2 --message-body '{"source": "cdp-secret-manager-lambda", "statusCode": 200, "action": "add_secret", "Message": {"action": "add_secret", "name": "cdp-portal-frontend",  "environment": "infra-dev", "secret_key": "SOME_KEY", "secret_value": "Some value"}}'`

Or add directly to Portal Backend.

`awslocal sqs send-message --queue-url "http://localhost:4566/000000000000/secret_management_updates" --region eu-west-2 --message-body '{"source": "cdp-secret-manager-lambda", "statusCode": 200, "action": "add_secret", "body": {"add_secret": true, "secret": "cdp/services/cdp-portal-frontend",  "environment": "infra-dev", "secret_key": "SOME_KEY" }}'`

Add `BLOWUP` as value to simulate the lambda throwing exception.

`awslocal sqs send-message --queue-url "http://localhost:4566/000000000000/secret_management_updates_lambda" --region eu-west-2 --message-body '{"source": "cdp-secret-manager-lambda", "statusCode": 200, "action": "add_secret", "Message": {"action": "add_secret", "name": "cdp-portal-frontend",  "environment": "infra-dev", "secret_key": "SOME_KEY", "secret_value": "BLOWUP"}}'`

#### Get all secret

Updates secret keys in portal backend.

`awslocal sqs send-message --queue-url "http://localhost:4566/000000000000/secret_management_updates" --region eu-west-2 --message-body '{"source": "cdp-secret-manager-lambda", "statusCode": 200, "action": "get_all_secret_keys", "body": {"environment": "infra-dev", "secretKeys": {"/cdp/services/cdp-portal-frontend": {"keys": ["TEST_KEY"],"lastChangedDate":"2024-07-01 10:05:15","createdDate":"2024-07-01 10:05:15"}}}}'`
