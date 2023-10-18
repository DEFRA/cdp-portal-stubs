import { createLogger } from '~/src/helpers/logging/logger'

const keysController = {
  handler: async (request, h) => {
    const logger = createLogger()
    logger.info('Stubbing keys endpoint')
    return h
      .response({
        keys: [
          {
            kty: 'RSA',
            e: 'AQAB',
            use: 'sig',
            kid: 'CXup',
            n: 'hrwD-lc-IwzwidCANmy4qsiZk11yp9kHykOuP0yOnwi36VomYTQVEzZXgh2sDJpGgAutdQudgwLoV8tVSsTG9SQHgJjH9Pd_9V4Ab6PANyZNG6DSeiq1QfiFlEP6Obt0JbRB3W7X2vkxOVaNoWrYskZodxU2V0ogeVL_LkcCGAyNu2jdx3j0DjJatNVk7ystNxb9RfHhJGgpiIkO5S3QiSIVhbBKaJHcZHPF1vq9g0JMGuUCI-OTSVg6XBkTLEGw1C_R73WD_oVEBfdXbXnLukoLHBS11p3OxU7f4rfxA_f_72_UwmWGJnsqS3iahbms3FkvqoL9x_Vj3GhuJSf97Q'
          }
        ]
      })
      .code(200)
  }
}

export { keysController }
