# CDP Portal Stubs

A set of stubs for mocking out calls to github & aws for the cdp-portal.

## Setup

### start defra-mock-oidc-server

### start mongo, redis, localstack

### create queues

### start cdp-portal-backend

### start cdp-self-service-ops

Override the following config items:

```bash
export GITHUB_BASE_URL=http://localhost:3939
export OIDC_ISSUER_BASE_URL=http://127.0.0.1:5557/oidc
export OIDC_KEYS_URL=http://127.0.0.1:5557/oidc/.well-known/jwks.json
```

### cdp-user-services

Override the following config items:

```bash
export AZURE_CLIENT_SECRET=test_value
export OIDC_ISSUER_BASE_URL=http://127.0.0.1:5557/oidc
export OIDC_KEYS_URL=http://127.0.0.1:5557/oidc/.well-known/jwks.json
```

### start cdp-portal-frontend

Override the following config items:

```bash
 export AZURE_CLIENT_SECRET=test_value
 export OAUTH_AUTH_URL=http://127.0.0.1:5557/oidc/authorize
 export OAUTH_TOKEN_URL=http://127.0.0.1:5557/oidc/token
```

## What it currently provides

Mock calls for github apis:

- Get/Set repo content
- Raise a PR
- Get Commit history
- Get repo data
- Trigger workflow
- Various graphql queries for enabling automerge and listing team data

Raising a PR will also result in a github webhook message being posted to the githubEvents queue, and in some cases a workflow complete message.
Creating a new repository results in a workflow run complete message.

Mocks calls to an ECR repository

- Lists available repositories
- Gets manifest
- Gets minimal layers

An admin endpoint is provided to simulate a new image being pushed `POST /_admin/trigger-ecr-push/{repo}/{tag}`

## Test Data

The base set of services is held in /config/services.js. Adding or removing services to this list will result in them being returned in the mock API calls.
