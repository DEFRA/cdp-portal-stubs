import Joi from 'joi'

export const createTeamValidator = Joi.object({
  team_id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  service_code: Joi.string().max(3).min(3).uppercase(),
  github: Joi.string()
})

export const updateTeamValidator = Joi.object({
  team_id: Joi.string().required(),
  name: Joi.string(),
  description: Joi.string(),
  service_code: Joi.string().max(3).min(3).uppercase(),
  github: Joi.string()
})

export const removeTeamValidator = Joi.object({
  team_id: Joi.string().required()
})
