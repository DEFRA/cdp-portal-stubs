import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { config } from '~/src/config'

/**
 *
 * @param sqs
 * @param {string} workflowRepo
 * @param {string} workflowFile
 * @param {string} runId
 * @param {string} action
 * @param {string|null} conclusion
 * @param {number} delay
 * @returns {Promise<void>}
 */
const triggerWorkflowStatus = async (
  sqs,
  workflowRepo,
  workflowFile,
  runId,
  action,
  conclusion,
  delay = 1
) => {
  const payload = {
    github_event: 'workflow_run',
    action,
    workflow_run: {
      head_sha: 'f1d2d2f924e986ac86fdf7b36c94bcdf32beec15',
      head_branch: 'main',
      name: runId,
      id: 1,
      conclusion,
      html_url: 'http://localhost:3939/#local-stub',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      path: `.github/workflows/${workflowFile}`,
      run_number: 1,
      head_commit: {
        message: 'commit message',
        author: {
          name: 'stub'
        }
      }
    },
    repository: {
      name: workflowRepo,
      html_url: 'http://localhost:3939/#local-stub'
    },
    workflow: {
      path: `.github/workflows/${workflowFile}`
    }
  }
  const command = {
    QueueUrl: config.get('sqsGithubQueue'),
    MessageBody: JSON.stringify(payload),
    DelaySeconds: delay,
    MessageAttributes: {},
    MessageSystemAttributes: {}
  }

  await sqs.send(new SendMessageCommand(command))
}

export { triggerWorkflowStatus }
