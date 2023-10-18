// Simulates a new image being pushed to the ECR registry
import { config } from '~/src/config'
import { SendMessageCommand } from '@aws-sdk/client-sqs'

const triggerEcrPush = {
  handler: async (request, h) => {
    const repo = request.params.repo
    const tag = request.params.tag

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
      'image-digest':
        'sha256:44e6d7b2641f3666a507cc6a582a343d42c27a3d7dbfb64c2e672dab94831562',
      'action-type': 'PUSH',
      'artifact-media-type': 'application/vnd.docker.container.image.v1+json',
      'image-tag': tag,
      'manifest-media-type':
        'application/vnd.docker.distribution.manifest.v2+json'
    }
  }
}

export { triggerEcrPush }
