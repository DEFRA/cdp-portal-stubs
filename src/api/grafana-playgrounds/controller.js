import Joi from 'joi'
import { grafanaPlaygrounds } from '~/src/config/grafana-playground-state'

const paramsSchema = Joi.object({
  service: Joi.string().min(1).required()
})

export const getGrafanaPlaygroundsController = {
  options: {
    validate: {
      params: paramsSchema
    }
  },
  handler: (request, h) => {
    const { service } = request.params
    const playground = grafanaPlaygrounds[service] ?? {
      dashboards: [],
      alerts: []
    }

    return h
      .response({
        request_id: `stub-${service}`,
        service,
        dashboards: playground.dashboards ?? [],
        alerts: playground.alerts ?? [],
        updated: new Date().toISOString()
      })
      .code(200)
  }
}
