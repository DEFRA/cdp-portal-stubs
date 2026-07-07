import Joi from 'joi'
import { changeShutterState } from '~/src/api/platform-state-lambda/create-tenant'
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

  try {
    changeShutterState(
      environment,
      service,
      payload.fqdn,
      payload.action === 'shutter'
    )
    server.logger.info(
      `shuttering ${service} url ${payload.fqdn} in ${environment}`
    )
  } catch (err) {
    server.logger.warn(
      { err, payload },
      'Unable to find service for shutter payload'
    )
  }

  // simulate cdp-tenant-config being updated
  await sendPlatformStatePayload(server.sqs, environment, 1)
}
