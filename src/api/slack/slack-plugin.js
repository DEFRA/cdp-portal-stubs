import { slackListener } from '~/src/api/slack/slack-listener'

const slackPlugin = {
  plugin: {
    name: 'slack-plugin',
    version: '1.0.0',
    register: function (server) {
      slackListener(server)
    }
  }
}

export { slackPlugin }
