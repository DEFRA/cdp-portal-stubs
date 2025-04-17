import * as crypto from 'crypto'

export function lambdaCodebuildCreate(
  awsAccountId,
  service,
  cdpMigrationId,
  buildId
) {
  return {
    id: crypto.randomUUID(),
    'detail-type': 'CodeBuild Lambda Created',
    source: 'aws.lambda',
    account: awsAccountId,
    region: 'eu-west-2',
    request: {}, // TODO: echo the original request back
    'cdp-migration-id': cdpMigrationId,
    'build-id': buildId
  }
}
