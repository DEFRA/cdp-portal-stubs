import {
  sendWorkflowEventsBatchMessage,
  workflowEvent
} from '~/src/api/workflows/helpers/workflow-event'

import { teamsAndUsers } from '~/src/config/teams-and-users'

export async function triggerTeams(sqs, delay = 0) {
  const payload = JSON.stringify(
    workflowEvent('teams', {
      teams: teamsAndUsers.teams
    })
  )

  const msg = {
    Id: crypto.randomUUID(),
    MessageBody: payload
  }

  await sendWorkflowEventsBatchMessage([msg], 'teams', sqs, delay)
}
