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

    if (inputs[key]) {
      teamsAndUsers.teams[idx][key] = inputs[key]
    }
  }
}

function removeTeam(inputs) {
  Joi.assert(inputs, removeTeamValidator)
  teamsAndUsers.teams = teamsAndUsers.teams.filter(
    (t) => t.team_id !== inputs.team_id
  )
}

function inputToTeam(input) {
  const slack = {}
  if (input.slack_prod) {
    slack.prod = input.slack_prod
  }
  if (input.slack_non_prod) {
    slack.prod = input.slack_non_prod
  }
  if (input.slack_team) {
    slack.prod = input.slack_team
  }

  const team = {
    team_id: input.team_id,
    name: input.team_name,
    description: input.description,
    service_code: input.service_code,
    delivery_group_id: input.delivery_group_id,
    github: input.github
  }
  if (slack && slack !== {}) {
    team.slack_channels = slack
  }
  return Object.fromEntries(
    Object.entries(team).filter(([, value]) => value !== null)
  )
}
