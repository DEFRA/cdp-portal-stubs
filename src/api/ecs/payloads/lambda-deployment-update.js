import * as crypto from 'crypto'

function lambdaDeploymentUpdate(awsAccountId, zone, service) {
  return {
    id: crypto.randomUUID(),
    'detail-type': 'ECS Lambda Deployment Updated',
    source: 'aws.lambda',
    account: awsAccountId,
    region: 'eu-west-2',
    resources: [
      `arn:aws:ecs:eu-west-2:${awsAccountId}:service/infra-dev-ecs-public/cdp-demo-test-6`
    ],
    detail: {
      eventType: 'INFO',
      eventName: 'COMPLETED',
      deploymentId: 'ecs-svc/3070225588939604476',
      reason: `Deployment arn:aws:ecs:eu-west-2:${awsAccountId}:service/infra-dev-ecs-public/${service} successfully updated`
    },
    deployed_by: 'Test, User'
  }
}

export { lambdaDeploymentUpdate }

/*
{"id": "4da63452-9358-4c9a-8d8b-55e2be62c2ff", "detail-type": "ECS Lambda Deployment Starting", "source": "aws.lambda", "account": "506190012364", "region": "eu-west-2", "resources": [null], "detail": {"eventType": "INFO", "eventName": null, "deploymentId": null, "reason": "Deployment for cdp-demo-test-15 requested"}, "deployed_by": "Abdulrazeg, Mo"}
{"version":"0","id":"da07ef40-d1c6-8525-ad60-02e1be51531d","detail-type":"ECS Task State Change","source":"aws.ecs","account":"332499610595","time":"2023-11-24T11:09:23Z","region":"eu-west-2","resources":["arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5"],"detail":{"attachments":[{"id":"c46d7066-32b4-4efa-8ca0-81315a4b9ab6","type":"sdi","status":"ATTACHED","details":[]},{"id":"fbdff5f2-f52d-445c-b818-f9fefb135926","type":"eni","status":"ATTACHED","details":[{"name":"subnetId","value":"subnet-009c35c0ed8a54136"},{"name":"networkInterfaceId","value":"eni-0185952374ce3062a"},{"name":"macAddress","value":"06:c7:53:64:b5:72"},{"name":"privateDnsName","value":"ip-10-249-47-254.eu-west-2.compute.internal"},{"name":"privateIPv4Address","value":"10.249.47.254"}]}],"attributes":[{"name":"ecs.cpu-architecture","value":"x86_64"}],"availabilityZone":"eu-west-2a","clusterArn":"arn:aws:ecs:eu-west-2:332499610595:cluster/dev-ecs-public","connectivity":"CONNECTED","connectivityAt":"2023-11-24T11:08:49.019Z","containers":[{"containerArn":"arn:aws:ecs:eu-west-2:332499610595:container/dev-ecs-public/f8bec92bed774ee4b27711702a862de5/2fe15c3c-1d90-47a3-a424-3cd6a1ead322","lastStatus":"RUNNING","name":"cdp-demo-test-15_log_router","image":"094954420758.dkr.ecr.eu-west-2.amazonaws.com/cdp-fluent-bit:latest","imageDigest":"sha256:c15b434e7f7aaa42ef9b1f4e3a806d9e5ee0504c2afe2e14e980c8bdf60c6e93","runtimeId":"f8bec92bed774ee4b27711702a862de5-1894169077","taskArn":"arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5","networkInterfaces":[{"attachmentId":"fbdff5f2-f52d-445c-b818-f9fefb135926","privateIpv4Address":"10.249.47.254"}],"cpu":"0","managedAgents":[{"name":"ExecuteCommandAgent","status":"RUNNING","lastStartedAt":"2023-11-24T11:09:13.802Z"}]},{"containerArn":"arn:aws:ecs:eu-west-2:332499610595:container/dev-ecs-public/f8bec92bed774ee4b27711702a862de5/499d6f34-a842-470a-9dcb-122c786e0619","lastStatus":"RUNNING","name":"cdp-demo-test-15_ssl","image":"094954420758.dkr.ecr.eu-west-2.amazonaws.com/cdp-ssl-sidecar:12","imageDigest":"sha256:758be6e3b4262e4bb89253a7c33f60b5f2bea9e377ae34300e658adc0d0691c1","runtimeId":"f8bec92bed774ee4b27711702a862de5-4155932435","taskArn":"arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5","networkInterfaces":[{"attachmentId":"fbdff5f2-f52d-445c-b818-f9fefb135926","privateIpv4Address":"10.249.47.254"}],"cpu":"0","managedAgents":[{"name":"ExecuteCommandAgent","status":"RUNNING","lastStartedAt":"2023-11-24T11:09:21.786Z"}]},{"containerArn":"arn:aws:ecs:eu-west-2:332499610595:container/dev-ecs-public/f8bec92bed774ee4b27711702a862de5/4ea14053-c77f-4eb8-ad19-9c7f9dafa4b0","lastStatus":"RUNNING","name":"cdp-demo-test-15","image":"094954420758.dkr.ecr.eu-west-2.amazonaws.com/cdp-demo-test-15:0.1.0","imageDigest":"sha256:ae81d8e895da216863393eb04294f4e2387656bb7416fc6db7ce3da15dbed7d0","runtimeId":"f8bec92bed774ee4b27711702a862de5-4271147282","taskArn":"arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5","networkInterfaces":[{"attachmentId":"fbdff5f2-f52d-445c-b818-f9fefb135926","privateIpv4Address":"10.249.47.254"}],"cpu":"0","managedAgents":[{"name":"ExecuteCommandAgent","status":"RUNNING","lastStartedAt":"2023-11-24T11:09:21.786Z"}]},{"containerArn":"arn:aws:ecs:eu-west-2:332499610595:container/dev-ecs-public/f8bec92bed774ee4b27711702a862de5/9409e11e-afc6-4aa4-9baf-a5f46f0277a3","lastStatus":"RUNNING","name":"cdp-demo-test-15_cwagent","image":"094954420758.dkr.ecr.eu-west-2.amazonaws.com/cdp-cloudwatch-agent:latest","imageDigest":"sha256:39ec1b56fdd4577c2d829cd068d48c9da8a31c6016821543a6747742ddae8a6b","runtimeId":"f8bec92bed774ee4b27711702a862de5-227701546","taskArn":"arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5","networkInterfaces":[{"attachmentId":"fbdff5f2-f52d-445c-b818-f9fefb135926","privateIpv4Address":"10.249.47.254"}],"cpu":"0","managedAgents":[{"name":"ExecuteCommandAgent","status":"RUNNING","lastStartedAt":"2023-11-24T11:09:21.786Z"}]}],"cpu":"1024","createdAt":"2023-11-24T11:08:45.576Z","desiredStatus":"RUNNING","enableExecuteCommand":true,"ephemeralStorage":{"sizeInGiB":20},"group":"service:cdp-demo-test-15","launchType":"FARGATE","lastStatus":"RUNNING","memory":"2048","overrides":{"containerOverrides":[{"name":"cdp-demo-test-15_log_router"},{"name":"cdp-demo-test-15_ssl"},{"name":"cdp-demo-test-15"},{"name":"cdp-demo-test-15_cwagent"}]},"platformVersion":"1.4.0","pullStartedAt":"2023-11-24T11:08:56.567Z","pullStoppedAt":"2023-11-24T11:09:06.756Z","startedAt":"2023-11-24T11:09:23.826Z","startedBy":"ecs-svc/7617799119934277582","taskArn":"arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5","taskDefinitionArn":"arn:aws:ecs:eu-west-2:332499610595:task-definition/cdp-demo-test-15:1","updatedAt":"2023-11-24T11:09:23.826Z","version":5}}

{
    "version": "0",
    "id": "da07ef40-d1c6-8525-ad60-02e1be51531d",
    "detail-type": "ECS Task State Change",
    "source": "aws.ecs",
    "account": "332499610595",
    "time": "2023-11-24T11:09:23Z",
    "region": "eu-west-2",
    "resources": [
        "arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5"
    ],
    "detail": {
        "attachments": [
            {
                "id": "c46d7066-32b4-4efa-8ca0-81315a4b9ab6",
                "type": "sdi",
                "status": "ATTACHED",
                "details": [

                ]
            },
            {
                "id": "fbdff5f2-f52d-445c-b818-f9fefb135926",
                "type": "eni",
                "status": "ATTACHED",
                "details": [
                    {
                        "name": "subnetId",
                        "value": "subnet-009c35c0ed8a54136"
                    },
                    {
                        "name": "networkInterfaceId",
                        "value": "eni-0185952374ce3062a"
                    },
                    {
                        "name": "macAddress",
                        "value": "06:c7:53:64:b5:72"
                    },
                    {
                        "name": "privateDnsName",
                        "value": "ip-10-249-47-254.eu-west-2.compute.internal"
                    },
                    {
                        "name": "privateIPv4Address",
                        "value": "10.249.47.254"
                    }
                ]
            }
        ],
        "attributes": [
            {
                "name": "ecs.cpu-architecture",
                "value": "x86_64"
            }
        ],
        "availabilityZone": "eu-west-2a",
        "clusterArn": "arn:aws:ecs:eu-west-2:332499610595:cluster/dev-ecs-public",
        "connectivity": "CONNECTED",
        "connectivityAt": "2023-11-24T11:08:49.019Z",
        "containers": [
            {
                "containerArn": "arn:aws:ecs:eu-west-2:332499610595:container/dev-ecs-public/f8bec92bed774ee4b27711702a862de5/2fe15c3c-1d90-47a3-a424-3cd6a1ead322",
                "lastStatus": "RUNNING",
                "name": "cdp-demo-test-15_log_router",
                "image": "094954420758.dkr.ecr.eu-west-2.amazonaws.com/cdp-fluent-bit:latest",
                "imageDigest": "sha256:c15b434e7f7aaa42ef9b1f4e3a806d9e5ee0504c2afe2e14e980c8bdf60c6e93",
                "runtimeId": "f8bec92bed774ee4b27711702a862de5-1894169077",
                "taskArn": "arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5",
                "networkInterfaces": [
                    {
                        "attachmentId": "fbdff5f2-f52d-445c-b818-f9fefb135926",
                        "privateIpv4Address": "10.249.47.254"
                    }
                ],
                "cpu": "0",
                "managedAgents": [
                    {
                        "name": "ExecuteCommandAgent",
                        "status": "RUNNING",
                        "lastStartedAt": "2023-11-24T11:09:13.802Z"
                    }
                ]
            },
            {
                "containerArn": "arn:aws:ecs:eu-west-2:332499610595:container/dev-ecs-public/f8bec92bed774ee4b27711702a862de5/499d6f34-a842-470a-9dcb-122c786e0619",
                "lastStatus": "RUNNING",
                "name": "cdp-demo-test-15_ssl",
                "image": "094954420758.dkr.ecr.eu-west-2.amazonaws.com/cdp-ssl-sidecar:12",
                "imageDigest": "sha256:758be6e3b4262e4bb89253a7c33f60b5f2bea9e377ae34300e658adc0d0691c1",
                "runtimeId": "f8bec92bed774ee4b27711702a862de5-4155932435",
                "taskArn": "arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5",
                "networkInterfaces": [
                    {
                        "attachmentId": "fbdff5f2-f52d-445c-b818-f9fefb135926",
                        "privateIpv4Address": "10.249.47.254"
                    }
                ],
                "cpu": "0",
                "managedAgents": [
                    {
                        "name": "ExecuteCommandAgent",
                        "status": "RUNNING",
                        "lastStartedAt": "2023-11-24T11:09:21.786Z"
                    }
                ]
            },
            {
                "containerArn": "arn:aws:ecs:eu-west-2:332499610595:container/dev-ecs-public/f8bec92bed774ee4b27711702a862de5/4ea14053-c77f-4eb8-ad19-9c7f9dafa4b0",
                "lastStatus": "RUNNING",
                "name": "cdp-demo-test-15",
                "image": "094954420758.dkr.ecr.eu-west-2.amazonaws.com/cdp-demo-test-15:0.1.0",
                "imageDigest": "sha256:ae81d8e895da216863393eb04294f4e2387656bb7416fc6db7ce3da15dbed7d0",
                "runtimeId": "f8bec92bed774ee4b27711702a862de5-4271147282",
                "taskArn": "arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5",
                "networkInterfaces": [
                    {
                        "attachmentId": "fbdff5f2-f52d-445c-b818-f9fefb135926",
                        "privateIpv4Address": "10.249.47.254"
                    }
                ],
                "cpu": "0",
                "managedAgents": [
                    {
                        "name": "ExecuteCommandAgent",
                        "status": "RUNNING",
                        "lastStartedAt": "2023-11-24T11:09:21.786Z"
                    }
                ]
            },
            {
                "containerArn": "arn:aws:ecs:eu-west-2:332499610595:container/dev-ecs-public/f8bec92bed774ee4b27711702a862de5/9409e11e-afc6-4aa4-9baf-a5f46f0277a3",
                "lastStatus": "RUNNING",
                "name": "cdp-demo-test-15_cwagent",
                "image": "094954420758.dkr.ecr.eu-west-2.amazonaws.com/cdp-cloudwatch-agent:latest",
                "imageDigest": "sha256:39ec1b56fdd4577c2d829cd068d48c9da8a31c6016821543a6747742ddae8a6b",
                "runtimeId": "f8bec92bed774ee4b27711702a862de5-227701546",
                "taskArn": "arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5",
                "networkInterfaces": [
                    {
                        "attachmentId": "fbdff5f2-f52d-445c-b818-f9fefb135926",
                        "privateIpv4Address": "10.249.47.254"
                    }
                ],
                "cpu": "0",
                "managedAgents": [
                    {
                        "name": "ExecuteCommandAgent",
                        "status": "RUNNING",
                        "lastStartedAt": "2023-11-24T11:09:21.786Z"
                    }
                ]
            }
        ],
        "cpu": "1024",
        "createdAt": "2023-11-24T11:08:45.576Z",
        "desiredStatus": "RUNNING",
        "enableExecuteCommand": true,
        "ephemeralStorage": {
            "sizeInGiB": 20
        },
        "group": "service:cdp-demo-test-15",
        "launchType": "FARGATE",
        "lastStatus": "RUNNING",
        "memory": "2048",
        "overrides": {
            "containerOverrides": [
                {
                    "name": "cdp-demo-test-15_log_router"
                },
                {
                    "name": "cdp-demo-test-15_ssl"
                },
                {
                    "name": "cdp-demo-test-15"
                },
                {
                    "name": "cdp-demo-test-15_cwagent"
                }
            ]
        },
        "platformVersion": "1.4.0",
        "pullStartedAt": "2023-11-24T11:08:56.567Z",
        "pullStoppedAt": "2023-11-24T11:09:06.756Z",
        "startedAt": "2023-11-24T11:09:23.826Z",
        "startedBy": "ecs-svc/7617799119934277582",
        "taskArn": "arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/f8bec92bed774ee4b27711702a862de5",
        "taskDefinitionArn": "arn:aws:ecs:eu-west-2:332499610595:task-definition/cdp-demo-test-15:1",
        "updatedAt": "2023-11-24T11:09:23.826Z",
        "version": 5
    }
}


 */
