function ecsTestRunEvent(
  awsAccountId,
  zone,
  service,
  version,
  taskArn,
  lambdaId,
  taskId,
  status,
  desired
) {
  const now = new Date().toISOString()
  return {
    version: '0',
    id: crypto.randomUUID(),
    'detail-type': 'ECS Task State Change',
    source: 'aws.ecs',
    account: awsAccountId,
    time: now,
    region: 'eu-west-2',
    resources: [
      `arn:aws:ecs:eu-west-2:${awsAccountId}:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5`
    ],
    detail: {
      attachments: [],
      attributes: [
        {
          name: 'ecs.cpu-architecture',
          value: 'x86_64'
        }
      ],
      availabilityZone: 'eu-west-2a',
      clusterArn: `arn:aws:ecs:eu-west-2:${awsAccountId}:cluster/dev-ecs-public`,
      connectivity: 'CONNECTED',
      connectivityAt: new Date().toISOString(),
      containers: [
        {
          containerArn: `arn:aws:ecs:eu-west-2:${awsAccountId}:container/dev-ecs-public/f8bec92bed774ee4b27711702a862de5/2fe15c3c-1d90-47a3-a424-3cd6a1ead322`,
          lastStatus: 'RUNNING',
          name: `${service}_log_router`,
          image: `${awsAccountId}.dkr.ecr.eu-west-2.amazonaws.com/cdp-fluent-bit:latest`,
          imageDigest:
            'sha256:c15b434e7f7aaa42ef9b1f4e3a806d9e5ee0504c2afe2e14e980c8bdf60c6e93',
          runtimeId: 'f8bec92bed774ee4b27711702a862de5-1894169077',
          taskArn:
            'arn:aws:ecs:eu-west-2:000000000000:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5',
          networkInterfaces: [
            {
              attachmentId: 'fbdff5f2-f52d-445c-b818-f9fefb135926',
              privateIpv4Address: '10.249.47.254'
            }
          ],
          cpu: '0',
          managedAgents: [
            {
              name: 'ExecuteCommandAgent',
              status: 'RUNNING',
              lastStartedAt: '2023-11-24T11:09:13.802Z'
            }
          ]
        },
        {
          containerArn: `arn:aws:ecs:eu-west-2:${awsAccountId}:container/dev-ecs-public/f8bec92bed774ee4b27711702a862de5/499d6f34-a842-470a-9dcb-122c786e0619`,
          lastStatus: 'RUNNING',
          name: `chrome-sidecar`,
          image: 'chrome-driver:latest',
          imageDigest:
            'sha256:758be6e3b4262e4bb89253a7c33f60b5f2bea9e377ae34300e658adc0d0691c1',
          runtimeId: 'f8bec92bed774ee4b27711702a862de5-4155932435',
          taskArn: `arn:aws:ecs:eu-west-2:${awsAccountId}:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5`,
          networkInterfaces: [
            {
              attachmentId: 'fbdff5f2-f52d-445c-b818-f9fefb135926',
              privateIpv4Address: '10.249.47.254'
            }
          ],
          cpu: '0',
          managedAgents: [
            {
              name: 'ExecuteCommandAgent',
              status: 'RUNNING',
              lastStartedAt: '2023-11-24T11:09:21.786Z'
            }
          ]
        },
        {
          containerArn: `arn:aws:ecs:eu-west-2:${awsAccountId}:container/dev-ecs-public/f8bec92bed774ee4b27711702a862de5/4ea14053-c77f-4eb8-ad19-9c7f9dafa4b0`,
          lastStatus: status,
          name: `${service}`,
          image: `000000000000.dkr.ecr.eu-west-2.amazonaws.com/${service}:${version}`,
          imageDigest:
            'sha256:ae81d8e895da216863393eb04294f4e2387656bb7416fc6db7ce3da15dbed7d0',
          runtimeId: 'f8bec92bed774ee4b27711702a862de5-4271147282',
          taskArn: `arn:aws:ecs:eu-west-2:${awsAccountId}:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5`,
          networkInterfaces: [
            {
              attachmentId: 'fbdff5f2-f52d-445c-b818-f9fefb135926',
              privateIpv4Address: '10.249.47.254'
            }
          ],
          cpu: '0',
          managedAgents: [
            {
              name: 'ExecuteCommandAgent',
              status: 'RUNNING',
              lastStartedAt: '2023-11-24T11:09:21.786Z'
            }
          ]
        }
      ],
      cpu: '1024',
      createdAt: now,
      desiredStatus: desired,
      enableExecuteCommand: true,
      ephemeralStorage: {
        sizeInGiB: 20
      },
      group: `family:${service}`,
      launchType: 'FARGATE',
      lastStatus: status,
      memory: '2048',
      overrides: {
        containerOverrides: []
      },
      platformVersion: '1.4.0',
      pullStartedAt: now,
      pullStoppedAt: now,
      startedAt: now,
      startedBy: `ecs-svc/${lambdaId}`,
      taskArn,
      taskDefinitionArn: `arn:aws:ecs:eu-west-2:000000000000:task-definition/${service}:${taskId}`,
      updatedAt: now,
      version: 5
    }
  }
}

export { ecsTestRunEvent }
