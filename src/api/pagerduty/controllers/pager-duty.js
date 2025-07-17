import { pagerDutyHistory } from '~/src/api/pagerduty/pageduty-history'

const pagerDutyController = {
  handler: (request, h) => {
    request.logger.info(
      `Received PagerDuty message for ${request.payload?.summary}`
    )
    pagerDutyHistory.push(request.payload)

    return h
      .response({
        status: 'success',
        message: 'Event processed',
        dedup_key: 'mock-dedup-key'
      })
      .code(202)
  }
}

export { pagerDutyController }
