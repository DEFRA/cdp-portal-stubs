import { ecrRepos } from '~/src/config/mock-data'
import { config } from '~/src/config'
import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { createLogger } from '~/src/helpers/logging/logger'
import crypto from 'node:crypto'

const logger = createLogger()

export async function populateECR(sqs) {
  for (const repo of Object.keys(ecrRepos)) {
    await populateEcrRepo(sqs, repo)
  }
}

export async function populateEcrRepo(sqs, repo) {
  for (const tag of ecrRepos[repo].tags) {
    const payload = JSON.stringify(generateECRMessage(repo, tag))
    const msg = {
      QueueUrl: config.get('sqsEcrQueue'),
      MessageBody: payload,
      DelaySeconds: 1, // delay to allow stubs to start before PBE gets messages
      MessageAttributes: {},
      MessageSystemAttributes: {}
    }
    const command = new SendMessageCommand(msg)
    const resp = await sqs.send(command)
    logger.info(resp)
  }
}

export const generateECRMessage = (service, tag) => {
  const digest =
    'sha256:' +
    crypto
      .createHash('sha256')
      .update(service + ':' + tag)
      .digest('hex')
  return {
    version: '0',
    id: '94d2fb77-c8b1-c698-d675-313ae585ae3f',
    'detail-type': 'ECR Image Action',
    source: 'aws.ecr',
    account: '000000000000',
    time: '2023-09-12T10:50:24Z',
    region: 'eu-west-2',
    resources: [],
    detail: {
      result: 'SUCCESS',
      'repository-name': service,
      'image-digest': digest,
      'action-type': 'PUSH',
      'artifact-media-type': 'application/vnd.docker.container.image.v1+json',
      'image-tag': tag,
      'manifest-media-type':
        'application/vnd.docker.distribution.manifest.v2+json'
    }
  }
}
