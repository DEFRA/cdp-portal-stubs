import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'

const triggerDeployWorkflow = async (sqs, accountId, org, repo, version) => {
  const taskId = `${repo}-${crypto.randomUUID()}`
  const deploymentId = crypto.randomUUID()
  const ts = new Date().toISOString()

  const payload = {
    version: '0',
    id: deploymentId,
    'detail-type': 'ECS Task State Change',
    source: 'aws.ecs',
    account: accountId,
    region: '$REGION',
    time: ts,
    resources: [
      `arn:aws:ecs:us-west-2:${accountId}:task/FargateCluster/c13b4cb40f1f4fe4a2971f76ae5a47ad`
    ],
    detail: {
      availabilityZone: 'eu-west-2c',
      containers: [
        {
          lastStatus: 'RUNNING',
          name: 'FargateApp',
          image: `${accountId}.dkr.ecr.us-west-2.amazonaws.com/${repo}:${version}`,
          imageDigest:
            'sha256:74b2c688c700ec95a93e478cdb959737c148df3fbf5ea706abe0318726e885e6'
        }
      ],
      taskDefinitionArn: taskId,
      createdAt: ts,
      cpu: '256',
      memory: '512',
      desiredStatus: 'RUNNING',
      lastStatus: 'PENDING',
      connectivity: 'CONNECTED',
      connectivityAt: ts,
      pullStartedAt: ts,
      startedAt: ts,
      pullStoppedAt: ts,
      updatedAt: ts
    }
  }
  const pendingMessage = {
    QueueUrl: config.get('sqsEcsQueue'),
    MessageBody: JSON.stringify(payload),
    DelaySeconds: 1,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  await sqs.send(new SendMessageCommand(pendingMessage))

  payload.detail.lastStatus = 'RUNNING'
  const doneMessage = {
    QueueUrl: config.get('sqsEcsQueue'),
    MessageBody: JSON.stringify(payload),
    DelaySeconds: 2,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  return await sqs.send(new SendMessageCommand(doneMessage))
}

export { triggerDeployWorkflow }
