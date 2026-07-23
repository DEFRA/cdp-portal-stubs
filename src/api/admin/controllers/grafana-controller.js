import { grafanaPlaygrounds } from '~/src/config/grafana-playground-state'

export const updatePlaygroundDashboard = {
  handler: async (request, h) => {
    const service = request.params.service
    const uid = request.params.uid

    if (!grafanaPlaygrounds[service]) {
      return h.response({ error: `Service ${service} not found` }).code(404)
    }

    for (const dashboard of grafanaPlaygrounds[service].dashboards) {
      if (dashboard.uid === uid) {
        dashboard.updated = new Date()
        dashboard.promoted = false
      }
    }

    return h.response().code(200)
  }
}
