import { aadUserData } from '~/src/api/aad/content/aad-users'

const msgraphUsers = {
  handler: async (request, h) => {
    const payload = {
      value: aadUserData
    }
    return h.response(payload).code(200)
  }
}

export { msgraphUsers }
