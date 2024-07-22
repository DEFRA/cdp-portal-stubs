import * as crypto from 'crypto'

function lambdaDeploymentUpdate(
  awsAccountId,
  zone,
  service,
  cdpDeploymentId,
  lambdaId,
  taskId
) {
  return {
    id: crypto.randomUUID(),
    'detail-type': 'ECS Lambda Deployment Updated',
    source: 'aws.lambda',
    account: awsAccountId,
    region: 'eu-west-2',
    resources: [
      `arn:aws:ecs:eu-west-2:${awsAccountId}:service/infra-dev-ecs-public/${service}-${taskId}`
    ],
    detail: {
      eventType: 'INFO',
      eventName: 'IN_PROGRESS',
      deploymentId: lambdaId,
      reason: `Deployment arn:aws:ecs:eu-west-2:${awsAccountId}:service/infra-dev-ecs-public/${service} successfully updated`
    },
    deployed_by: 'Test, User',
    cdp_deployment_id: cdpDeploymentId
  }
}

export { lambdaDeploymentUpdate }
