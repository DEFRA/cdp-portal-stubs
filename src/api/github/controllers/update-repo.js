const updateRepo = {
  handler: async (request, h) => {
    const body = request.payload.body

    request.logger.info(body)

    return h.response().code(201)
  }
}

export { updateRepo }
