import { getSlackChannelsController } from '~/src/api/slack/controller'

export const slackApiGatewayStub = {
  plugin: {
    name: 'slackApiGatewayStub',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/infra-dev/slack/channels',
          ...getSlackChannelsController
        },
        {
          method: 'GET',
          path: '/management/slack/channels',
          ...getSlackChannelsController
        }
      ])
    }
  }
}
