import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'

const triggerCreateRepoWorkflow = async (sqs, repoName) => {
  const payload = {
    github_event: 'workflow_run',
    action: 'completed',
    workflow_run: {
      head_sha: 'f1d2d2f924e986ac86fdf7b36c94bcdf32beec15',
      headBranch: 'main',
      name: repoName,
      conclusion: 'success'
    },
    repository: {
      name: 'cdp-create-workflows'
    }
  }
  const pendingMessage = {
    QueueUrl: config.get('sqsGithubQueue'),
    MessageBody: JSON.stringify(payload),
    DelaySeconds: 1,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  await sqs.send(new SendMessageCommand(pendingMessage))
}

export { triggerCreateRepoWorkflow }
