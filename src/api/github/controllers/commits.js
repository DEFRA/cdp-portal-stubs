const postCommitsController = {
  handler: async (request, h) => {
    request.logger.info(request.payload)
    return h.response({}).code(201)
  }
}

const getCommitController = {
  handler: async (request, h) => {
    const commit = {
      tree: {
        sha: request.params.commitSha
      }
    }
    return h.response(commit).code(200)
  }
}

const repoCommitsController = {
  handler: async (request, h) => {
    const commits = [
      {
        sha: 'dda3c4f370626fd61189f0ccb6be335a63d993f9',
        commit: {
          tree: {
            sha: 'dda3c4f370626fd61189f0ccb6be335a63d993f9'
          }
        }
      }
    ]
    return h.response(commits).code(200)
  }
}

const patchRefsController = {
  handler: async (request, h) => {
    return h.response({}).code(201)
  }
}

const getRefsController = {
  handler: async (request, h) => {
    const ref = {
      object: {
        sha: 'aa218f56b14c9653891f9e74264a383fa43fefbd'
      }
    }
    return h.response(ref).code(200)
  }
}

export {
  getRefsController,
  repoCommitsController,
  getCommitController,
  postCommitsController,
  patchRefsController
}
