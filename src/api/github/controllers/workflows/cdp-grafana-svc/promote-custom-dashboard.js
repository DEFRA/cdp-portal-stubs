import { sendPlatformStatePayload } from '~/src/api/platform-state-lambda/send-platform-state-payload'
import { platformState } from '~/src/api/platform-state-lambda/platform-state'
import { environments } from '~/src/config/environments'
import { grafanaPlaygrounds } from '~/src/config/grafana-playground-state'

export function promoteDashboardWorkflow(request, inputs) {
  if (
    inputs.service_name &&
    grafanaPlaygrounds[inputs.service_name]?.dashboards
  ) {
    const playgroundData = grafanaPlaygrounds[inputs.service_name]

    const uid = inputs.dashboard_uid

    const dbIdx = playgroundData.dashboards.findIndex((d) => d.uid === uid)
    if (dbIdx === -1) {
      request.logger.error(`unable to find dashboard uid ${uid}`)
      return
    }

    playgroundData.dashboards[dbIdx].updated = new Date().toISOString()
    playgroundData.dashboards[dbIdx].promoted = true
    const db = playgroundData.dashboards[dbIdx]

    const slugParts = db.url.split('/')
    const slug = slugParts[slugParts.length - 1]
    const publishedUid = determinePromotedUid(inputs.service_name, slug)

    for (const env of environments) {
      if (!platformState[env][inputs.service_name]) {
        continue
      }
      const serviceData = platformState[env][inputs.service_name]?.tenant

      const idx = serviceData.metrics.findIndex((m) => m.uid === publishedUid)

      if (idx > 0) {
        platformState[env][inputs.service_name].tenant.alerts[idx].version += 1
      } else {
        platformState[env][inputs.service_name].tenant.metrics.push({
          url: `https://metrics.${env}.cdp-int.defra.cloud/d/${inputs.service_name}/${publishedUid}`,
          type: 'custom',
          uid: publishedUid,
          scope: '',
          version: 1
        })
      }
      request.logger.info(
        `promoted dashboard ${uid} -> ${publishedUid} in ${env}`
      )
      sendPlatformStatePayload(request.sqs, env, 0)
    }
  }
}

function determinePromotedUid(folderName, slug) {
  const parts = slug.split('-')
  const title = `${folderName} (${parts[parts.length - 1]})`
  const digest = crypto
    .createHash('sha1')
    .update(title)
    .digest('hex')
    .slice(0, 8)

  // Leave room for "-<hash>"
  const maxSlugLen = 40 - digest.length - 1
  return `${slug.slice(0, maxSlugLen)}-${digest}`
}
