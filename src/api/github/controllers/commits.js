const postCommitsController = {
  handler: async (request, h) => {
    request.logger.info(request.payload)
    return h.response({}).code(201)
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

export { repoCommitsController, postCommitsController, patchRefsController }
