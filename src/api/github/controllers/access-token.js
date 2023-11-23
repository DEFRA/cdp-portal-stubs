const accessTokenController = {
  handler: async (request, h) => {
    return h.response({ token: '123456768' }).code(200)
  }
}

export { accessTokenController }
