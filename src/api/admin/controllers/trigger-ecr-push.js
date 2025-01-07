// Simulates a new image being pushed to the ECR registry
import { config } from '~/src/config'
import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { ecrRepos } from '~/src/config/mock-data'
import { generateECRMessage } from '~/src/api/workflows/populate-ecr/populate-ecr'

export const triggerEcrPush = {
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

    const payload = JSON.stringify(generateECRMessage(repo, tag))
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
