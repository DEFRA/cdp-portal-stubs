import { emailHistory } from '~/src/api/aad/content/email-history'

const msgraphEmail = {
  handler: async (request, h) => {
    const { sender } = request.params
    request.logger.info(`Mock sendMail called by: ${sender}`)
    request.logger.info(
      'Email payload:',
      JSON.stringify(request.payload, null, 2)
    )

    emailHistory.push(request.payload)
    return h.response().code(202) // Graph API responds with 202 No Content
  }
}

export { msgraphEmail }
