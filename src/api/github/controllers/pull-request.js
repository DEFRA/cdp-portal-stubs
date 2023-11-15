import * as crypto from 'crypto'
import { triggerDeployWorkflow } from '~/src/api/github/events/trigger-deployment-workflow'
import { triggerMergeResponse } from '~/src/api/github/events/trigger-merge-response'
import { environmentMappings } from '~/src/config/environments'
import { extractTagFromTitle } from '~/src/api/github/helpers/extract-tag-from-title'
import { triggerWorkflowComplete } from '~/src/api/github/events/trigger-workflow-complete'

const createPullRequest = {
  handler: async (request, h) => {
    const org = request.params.org
    const repo = request.params.repo

    const commitId = crypto.randomBytes(16).toString('hex')
    const nodeId = crypto.randomBytes(16).toString('hex')

    request.logger.info(request.payload)

    if (repo === 'tf-svc') {
      const { service, version, environment } = extractTagFromTitle(
        request.payload.title
      )

      const accountId = environmentMappings[environment]

      request.logger.info(
        `Triggering deployment workflow ${service}:${version}`
      )

      const res = await triggerDeployWorkflow(
        request.sqs,
        accountId,
        org,
        service,
        version
      )

      request.logger.info(res)
    }

    const number = Math.floor(Math.random() * 9999999)

    await triggerMergeResponse(request.sqs, repo, number, nodeId, commitId)
    await triggerWorkflowComplete(request.sqs, repo, commitId)

    return h
      .response({
        head: {
          sha: commitId,
          ref: 'branch' + number
        },
        number,
        html_url: `http://localhost/org/repo/pull_request/${number}`,
        node_id: nodeId
      })
      .code(200)
  }
}

export { createPullRequest }
