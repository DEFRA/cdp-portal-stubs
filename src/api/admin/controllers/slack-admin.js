import { slackHistory } from '~/src/api/slack/slack-history'

const listSlackMessages = {
  handler: async (request, h) => {
    return h.response(slackHistory).code(200)
  }
}

const resetSlack = {
  handler: async (request, h) => {
    while (slackHistory.length > 0) {
      slackHistory.pop()
    }

    return h.response().code(200)
  }
}

export { resetSlack, listSlackMessages }
