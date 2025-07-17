import { emailHistory } from '~/src/api/aad/content/email-history'

export const listSentEmails = {
  handler: async (request, h) => {
    return h.response(emailHistory).code(200)
  }
}

export const resetEmails = {
  handler: async (request, h) => {
    while (emailHistory.length > 0) {
      emailHistory.pop()
    }

    return h.response().code(200)
  }
}
