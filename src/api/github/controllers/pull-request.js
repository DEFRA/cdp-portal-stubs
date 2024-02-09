import * as crypto from 'crypto'
import { triggerMergeResponse } from '~/src/api/github/events/trigger-merge-response'
import { triggerWorkflowComplete } from '~/src/api/github/events/trigger-workflow-complete'

const createPullRequest = {
  handler: async (request, h) => {
    const repo = request.params.repo

    const commitId = crypto.randomBytes(16).toString('hex')
    const nodeId = crypto.randomBytes(16).toString('hex')

    request.logger.info(request.payload)
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
