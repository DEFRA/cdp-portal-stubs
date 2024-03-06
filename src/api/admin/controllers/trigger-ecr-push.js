// Simulates a new image being pushed to the ECR registry
import { config } from '~/src/config'
import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { ecrRepos } from '~/src/config/mock-data'
import crypto from 'crypto'

const triggerEcrPush = {
  handler: async (request, h) => {
    const repo = request.params.repo
    const tag = request.params.tag
    const runMode = request.query.runMode ? request.query.runMode : 'service'

    if (ecrRepos[repo] === undefined) {
      ecrRepos[repo] = {
        runMode,
        tags: []
      }
    }

    ecrRepos[repo].tags.push(tag)

    const payload = JSON.stringify(generateMessage(repo, tag))
    const msg = {
      QueueUrl: config.get('sqsEcrQueue'),
      MessageBody: payload,
      DelaySeconds: 0,
      MessageAttributes: {},
      MessageSystemAttributes: {}
    }

    const command = new SendMessageCommand(msg)
    const resp = await request.sqs.send(command)

    return h.response(resp).code(200)
  }
}

const generateMessage = (service, tag) => {
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

export { triggerEcrPush }
