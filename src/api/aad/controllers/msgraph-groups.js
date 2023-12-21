import * as crypto from 'crypto'

const msgraphGroups = {
  handler: async (request, h) => {
    const payload = {
      id: crypto.randomUUID()
    }
    return h.response(payload).code(200)
  }
}

export { msgraphGroups }
