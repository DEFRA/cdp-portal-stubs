import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'

const triggerWorkflowComplete = async (sqs, repoName, mergedSha, delay = 7) => {
  const payload = {
    github_event: 'workflow_run',
    action: 'completed',
    workflow_run: {
      head_sha: mergedSha,
      head_branch: 'main',
      conclusion: 'success'
    },
    repository: {
      name: repoName
    }
  }
  const pendingMessage = {
    QueueUrl: config.get('sqsGithubQueue'),
    MessageBody: JSON.stringify(payload),
    DelaySeconds: delay,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  await sqs.send(new SendMessageCommand(pendingMessage))
}

export { triggerWorkflowComplete }
