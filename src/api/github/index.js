import { getContentController } from '~/src/api/github/controllers/get-content'
import { updateRepo } from '~/src/api/github/controllers/update-repo'
import { getRepoController } from '~/src/api/github/controllers/get-repo'
import {
  getCommitController,
  getRefsController,
  patchRefsController,
  postCommitsController,
  repoCommitsController
} from '~/src/api/github/controllers/commits'
import { graphqlController } from '~/src/api/github/controllers/graphql'
import { createPullRequest } from '~/src/api/github/controllers/pull-request'
import { triggerWorkflow } from '~/src/api/github/controllers/trigger-workflow'
import { accessTokenController } from '~/src/api/github/controllers/access-token'
import { postCreateBlobController } from '~/src/api/github/controllers/blobs'

const githubStub = {
  plugin: {
    name: 'githubStub',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/repos/{org}/{repo}/contents/{path}',
          ...getContentController
        },
        {
          method: 'POST',
          path: '/repos/{org}/{repo}',
          ...updateRepo
        },
        {
          method: 'GET',
          path: '/repos/{org}/{repo}',
          ...getRepoController
        },
        {
          method: 'GET',
          path: '/repos/{org}/{repo}/commits',
          ...repoCommitsController
        },
        {
          method: 'GET',
          path: '/repos/{org}/{repo}/git/commits/{commitSha}',
          ...getCommitController
        },
        {
          method: 'POST',
          path: '/repos/{org}/{repo}/git/commits',
          ...postCommitsController
        },
        {
          method: 'POST',
          path: '/repos/{org}/{repo}/git/blobs',
          ...postCreateBlobController
        },
        {
          method: 'POST',
          path: '/graphql',
          ...graphqlController
        },
        {
          method: 'GET',
          path: '/repos/{org}/{repo}/git/ref/{path}',
          ...getRefsController
        },
        {
          method: 'PATCH',
          path: '/repos/{org}/{repo}/git/refs/{path}',
          ...patchRefsController
        },
        {
          method: 'POST',
          path: '/repos/{org}/{repo}/pulls',
          ...createPullRequest
        },
        {
          method: 'POST',
          path: '/repos/{org}/{repo}/actions/workflows/{workflow}/dispatches',
          ...triggerWorkflow
        },
        {
          method: 'POST',
          path: '/app/installations/{appInstallationId}/access_tokens',
          ...accessTokenController
        }
      ])
    }
  }
}

export { githubStub }
