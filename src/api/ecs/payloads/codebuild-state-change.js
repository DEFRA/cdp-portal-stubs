export function codebuildStateChange(awsAccountId, service, buildId, status) {
  return {
    account: awsAccountId,
    detailType: 'CodeBuild Build State Change',
    region: 'eu-west-2',
    source: 'aws.codebuild',
    time: new Date().toISOString(),
    notificationRuleArn:
      'arn:aws:codestar-notifications:eu-west-2:000000000000:notificationrule/2ea28b4da14de167b5a9c3b8346f1933316250d2',
    detail: {
      'build-status': status,
      'project-name': `${service}-liquibase`,
      'build-id': buildId,
      'additional-information': {
        cache: {
          type: 'NO_CACHE'
        },
        'timeout-in-minutes': 60,
        'build-complete': false,
        initiator: 'cdp-infra-dev-devops/username',
        'build-start-time': 'Apr 14, 2025 11:41:39 AM',
        source: {
          location: 'temp-connection-logs/AWSLogs/000000000000/bar.zip',
          type: 'S3'
        },
        artifact: {
          location: ''
        },
        'vpc-config': {
          'security-group-ids': ['sg-05a015cc8c8477e58'],
          subnets: [
            {
              'build-fleet-az': 'eu-west-2b',
              'customer-az': 'eu-west-2b',
              'subnet-id': 'subnet-015cde5fb5d981a80'
            },
            {
              'build-fleet-az': 'eu-west-2a',
              'customer-az': 'eu-west-2a',
              'subnet-id': 'subnet-0bbbf9ff1edc414bb'
            },
            {
              'build-fleet-az': 'eu-west-2c',
              'customer-az': 'eu-west-2c',
              'subnet-id': 'subnet-0a19a23c650bc803f'
            }
          ],
          'vpc-id': 'vpc-0000'
        },
        environment: {
          image:
            '000000000000.dkr.ecr.eu-west-2.amazonaws.com/liquibase:latest',
          'privileged-mode': false,
          'image-pull-credentials-type': 'SERVICE_ROLE',
          'compute-type': 'BUILD_GENERAL1_SMALL',
          type: 'LINUX_CONTAINER',
          'environment-variables': [
            {
              name: 'PGHOST',
              type: 'PLAINTEXT',
              value:
                'cdp-example-node-postgres-be.cluster-0000.eu-west-2.rds.amazonaws.com'
            },
            {
              name: 'PGDATABASE',
              type: 'PLAINTEXT',
              value: 'cdp_example_node_postgres_be'
            },
            {
              name: 'PGUSER',
              type: 'PLAINTEXT',
              value: 'cdp_example_node_postgres_be_ddl'
            },
            {
              name: 'REGION',
              type: 'PLAINTEXT',
              value: 'eu-west-2'
            },
            {
              name: 'PGPORT',
              type: 'PLAINTEXT',
              value: '5432'
            },
            {
              name: 'LIQUIBASE_COMMAND_USERNAME',
              type: 'PLAINTEXT',
              value: 'cdp_example_node_postgres_be_ddl'
            },
            {
              name: 'LIQUIBASE_COMMAND_URL',
              type: 'PLAINTEXT',
              value:
                'jdbc:postgresql://cdp-example-node-postgres-be.cluster-0000.eu-west-2.rds.amazonaws.com/cdp_example_node_postgres_be?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory'
            },
            {
              name: 'LIQUIBASE_COMMAND_CHANGELOG_FILE',
              type: 'PLAINTEXT',
              value: '/changelog/db.changelog.xml'
            }
          ]
        },
        'project-file-system-locations': [],
        logs: {
          'deep-link':
            'https://console.aws.amazon.com/cloudwatch/home?region=eu-west-2#logsV2:log-groups'
        },
        'queued-timeout-in-minutes': 480
      },
      'current-phase': 'SUBMITTED',
      'current-phase-context': '[]',
      version: '1'
    },
    resources: [
      'arn:aws:codebuild:eu-west-2:000000000000:build/kurne-test-liquibase:d5ac2e30-dd0d-494f-a57d-515726439d85'
    ],
    additionalAttributes: {}
  }
}
