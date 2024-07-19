function ecsDeployStatusChangeEvent(
  awsAccountId,
  now,
  deploymentId,
  eventName,
  reason
) {
  return {
    version: '0',
    id: crypto.randomUUID(),
    'detail-type': 'ECS Deployment State Change',
    source: 'aws.ecs',
    account: awsAccountId,
    time: now,
    region: 'eu-west-2',
    resources: [
      `arn:aws:ecs:eu-west-2:${awsAccountId}:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5`
    ],
    detail: {
      eventType: 'INFO',
      eventName,
      deploymentId,
      updatedAt: now,
      reason
    }
  }
}
export { ecsDeployStatusChangeEvent }
