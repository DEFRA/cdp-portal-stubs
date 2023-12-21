import { aadUserData } from '~/src/api/aad/content/aad-users'

const msgraphUser = {
  handler: async (request, h) => {
    const id = request.params.id

    request.logger.info(`Searching for user ${id}`)
    const user = aadUserData.find((u) => u.id === id)
    request.logger.info(`Searching for user ${id} ${user}`)
    if (user) {
      return h.response(user).code(200)
    } else {
      return h.response().code(404)
    }
  }
}

export { msgraphUser }
