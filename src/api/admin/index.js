import { triggerEcrPush } from '~/src/api/admin/controllers/trigger-ecr-push'
import { oidcSessionController } from '~/src/api/admin/controllers/oidc-session-controller'
import { dataController } from '~/src/api/admin/controllers/data-controller'
import { triggerWorkflow } from '~/src/api/admin/controllers/trigger-workflow.js'
import {
  listSendPagerdutyMessages,
  resetPagerduty
} from '~/src/api/admin/controllers/pagerduty-admin'
import {
  listSentEmails,
  resetEmails
} from '~/src/api/admin/controllers/email-admin'
import { triggerAlert } from '~/src/api/admin/controllers/trigger-alert'
import {
  listSlackMessages,
  resetSlack
} from '~/src/api/admin/controllers/slack-admin'
import { monoLambdaPlatformState } from '~/src/api/admin/controllers/mono-lambda-platform-state'

const adminStub = {
  plugin: {
    name: 'adminStub',
    register: async (server) => {
      server.route([
        {
          method: 'POST',
          path: '/_admin/trigger-ecr-push/{repo}/{tag}',
          options: { id: 'admin.trigger-ecr' },
          ...triggerEcrPush
        },
        {
          method: 'GET',
          path: '/_admin/oidc/sessions',
          options: { id: 'admin.sessions' },
          ...oidcSessionController
        },
        {
          method: 'GET',
          path: '/_admin/data',
          options: { id: 'admin.data' },
          ...dataController
        },
        {
          method: 'GET',
          path: '/_admin/trigger/{workflow}',
          ...triggerWorkflow
        },
        {
          method: 'GET',
          path: '/_admin/lambda/mono-lambda/state',
          ...monoLambdaPlatformState
        },
        {
          method: 'GET',
          path: '/_admin/pagerduty',
          ...listSendPagerdutyMessages
        },
        {
          method: 'DELETE',
          path: '/_admin/pagerduty',
          ...resetPagerduty
        },
        {
          method: 'GET',
          path: '/_admin/email',
          ...listSentEmails
        },
        {
          method: 'DELETE',
          path: '/_admin/email',
          ...resetEmails
        },
        {
          method: 'GET',
          path: '/_admin/slack',
          ...listSlackMessages
        },
        {
          method: 'DELETE',
          path: '/_admin/slack',
          ...resetSlack
        },
        {
          method: 'POST',
          path: '/_admin/alert/{source}',
          ...triggerAlert
        }
      ])
    }
  }
}

export { adminStub }
