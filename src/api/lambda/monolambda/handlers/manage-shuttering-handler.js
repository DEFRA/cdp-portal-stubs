import Joi from 'joi'
import { platformState } from '~/src/api/platform-state-lambda/platform-state'
import { sendPlatformStatePayload } from '~/src/api/platform-state-lambda/send-platform-state-payload'

const schema = Joi.object({
  action: Joi.string().valid('shutter', 'unshutter').required(),
  fqdn: Joi.string().required(),
  service_name: Joi.string().required(),
  shutter_type: Joi.string().valid('www', 'api').required(),
  web_acl_name: Joi.string().required(),
  dry_run: Joi.boolean().default(false)
}).unknown(true)

export async function manageShutteringHandler(server, payload, attr = {}) {
  Joi.assert(payload, schema)

  const service = payload.service_name
  const environment = attr.environment

  if (!environment) {
    throw new Error('manageShutteringHandler Missing environment attr')
  }

  // update the platform state field(s) and send platform status
  if (
    platformState[environment] &&
    platformState[environment][service] &&
    platformState[environment][service]?.urls[payload.fqdn]
  ) {
    server.logger.info(
      `shuttering ${service} url ${payload.fqdn} in ${environment}`
    )
    platformState[environment][service].urls[payload.fqdn].shuttered =
      payload.action === 'shutter'
  } else {
    server.logger.warn('Unable to find service for shutter payload:', payload)
  }

  // simulate cdp-tenant-config being updated
  await sendPlatformStatePayload(server.sqs, environment, 1)
}
