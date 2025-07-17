import { pagerDutyController } from '~/src/api/pagerduty/controllers/pager-duty'

const pagerDutyStub = {
  plugin: {
    name: 'pagerdutyStub',
    register: async (server) => {
      server.route([
        {
          method: 'POST',
          path: '/pagerduty/v2/enqueue',
          ...pagerDutyController
        }
      ])
    }
  }
}

export { pagerDutyStub }
