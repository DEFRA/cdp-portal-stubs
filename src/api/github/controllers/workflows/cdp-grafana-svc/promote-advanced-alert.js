import { grafanaPlaygrounds } from '~/src/config/grafana-playground-state'

export function promoteAlertWorkflow(request, inputs) {
  if (!inputs.service_name) {
    request.logger.warn(`${inputs.service_name} missing service name`)
    return
  }

  if (!grafanaPlaygrounds[inputs.service_name]?.alerts) {
    request.logger.warn(
      `${inputs.service_name} has no alerts or does not exist in playground`
    )
    return
  }

  const playgroundData = grafanaPlaygrounds[inputs.service_name]

  const uid = inputs.alert_uid

  const alertIdx = playgroundData.alerts.findIndex((d) => d.uid === uid)
  if (alertIdx === -1) {
    request.logger.error(`unable to find alert uid ${uid}`)
    return
  }
  playgroundData.alerts[alertIdx].updated = new Date().toISOString()
  playgroundData.alerts[alertIdx].promoted = true
  request.logger.info(playgroundData.alerts[alertIdx])
}
