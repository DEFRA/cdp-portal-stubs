const postCreateBlobController = {
  handler: async (request, h) => {
    const blob = {
      sha: 'de9c0445ed21abb62d709daa7ebb84cd20f13076'
    }
    return h.response(blob).code(201)
  }
}

export { postCreateBlobController }
