import {
  createTeamValidator,
  removeTeamValidator,
  updateTeamValidator
} from '~/src/api/github/controllers/workflow-validators'
import Joi from 'joi'
import { teamsAndUsers } from '~/src/config/teams-and-users'
import { triggerTeams } from '~/src/api/workflows/teams/trigger-teams'

/**
 * @param {{}} request
 * @param {{ namespace: string|null, action:string|null, args: {} }} cmd
 */
export async function handleTeamCommands(request, cmd) {
  request.logger.info(`cdp-generic-cli team ${JSON.stringify(cmd)}`)
  const inputs = inputToTeam(cmd.args)

  switch (cmd.action) {
    case 'add':
      request.logger.info(`creating team ${JSON.stringify(inputs)}`)
      createTeam(inputs)
      break
    case 'update':
      request.logger.info(`updating team ${JSON.stringify(inputs)}`)
      updateTeam(inputs)
      break
    case 'remove':
      request.logger.info(`removing team ${JSON.stringify(inputs)}`)
      removeTeam(inputs)
      break
    case 'publish':
      await triggerTeams(request.sqs)
      break
  }
}

function createTeam(inputs) {
  Joi.assert(inputs, createTeamValidator)

  if (!teamsAndUsers.teams.some((t) => t.team_id === inputs.team_id)) {
    teamsAndUsers.teams.push(inputs)
  }
}

function updateTeam(inputs) {
  Joi.assert(inputs, updateTeamValidator)
  const idx = teamsAndUsers.teams.findIndex((t) => t.team_id === inputs.team_id)

  if (idx === -1) {
    throw new Error(`Team ${inputs.team_id} not found`)
  }

  for (const key of Object.keys(inputs)) {
    if (key === 'team_id') continue
    teamsAndUsers.teams[idx][key] = inputs[key]
  }
}

function removeTeam(inputs) {
  Joi.assert(inputs, removeTeamValidator)
  teamsAndUsers.teams = teamsAndUsers.teams.filter(
    (t) => t.team_id !== inputs.team_id
  )
}

function inputToTeam(input) {
  return {
    team_id: input.team_id,
    name: input.team_name,
    description: input.description,
    service_code: input.service_code,
    github: input.github,
    slack_channels: {
      prod: input.slack_prod,
      non_prod: input.slack_non_prod,
      team: input.slack_team
    }
  }
}
