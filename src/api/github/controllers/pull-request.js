import * as crypto from 'crypto'

const createPullRequest = {
  handler: async (request, h) => {
    const repo = request.params.repo
    const payload = request.payload

    // Payload looks something like this
    // "{\"head\":\"defra-cdp-sandpit:deploy-cdp-portal-frontend-0.1.0-1697630060408\",\"base\":\"master\",\"title\":\"Deploy cdp-portal-frontend:0.1.0 to public cluster\",\"body\":\"Auto generated Pull Request to set cdp-portal-frontend to use version 0.1.0 in 'environments/infra-dev/services/public_services.json'\",\"draft\":false}",

    const commitId = crypto.randomBytes(16).toString('hex')
    const nodeId = crypto.randomBytes(16).toString('hex')

    if (repo === 'tf-svc') {
      await triggerMergeResponse(repo, commitId, 1)
      triggerDeployWorkflow(repo, commitId)
    }

    if (repo === 'tf-svc-infra') {
      await triggerMergeResponse(repo, commitId, 1)
      triggerCreateRepoWorkflow(repo, commitId)
    }

    if (repo === 'cdp-app-config') {
      triggerMergeResponse(repo, commitId, 1)
    }

    return h
      .response({
        nodeId
      })
      .code(200)
  }
}

const triggerDeployWorkflow = async (repo, commitId) => {}

const triggerCreateRepoWorkflow = async (repo, commitId) => {}

const triggerMergeResponse = async (repo, commitId, delay) => {}

export { createPullRequest }
