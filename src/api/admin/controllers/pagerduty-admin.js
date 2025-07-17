import { pagerDutyHistory } from '~/src/api/pagerduty/pageduty-history'

export const listSendPagerdutyMessages = {
  handler: async (request, h) => {
    return h.response(pagerDutyHistory).code(200)
  }
}

export const resetPagerduty = {
  handler: async (request, h) => {
    while (pagerDutyHistory.length > 0) {
      pagerDutyHistory.pop()
    }

    return h.response().code(200)
  }
}
