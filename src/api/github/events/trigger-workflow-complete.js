import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'

const triggerWorkflowComplete = async (sqs, repoName, mergedSha, delay = 7) => {
  const payload = {
    github_event: 'workflow_run',
    action: 'completed',
    workflow_run: {
      name: 'Terraform Apply',
      id: Math.floor(Math.random() * 9999999),
      html_url: 'http://localhost:3939/#local-stub',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      head_sha: mergedSha,
      head_branch: 'main',
      conclusion: 'success',
      run_number: 1,
      head_commit: {
        message: 'commit message',
        author: {
          name: 'stub'
        }
      }
    },
    repository: {
      name: repoName,
      html_url: 'http://localhost:3939/#local-stub'
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
