import * as crypto from 'crypto'

export function lambdaCodebuildCreate(
  awsAccountId,
  service,
  cdpMigrationId,
  buildId,
  request
) {
  return {
    id: crypto.randomUUID(),
    'detail-type': 'CodeBuild Lambda Created',
    source: 'aws.lambda',
    account: awsAccountId,
    region: 'eu-west-2',
    request,
    cdpMigrationId,
    buildId
  }
}
