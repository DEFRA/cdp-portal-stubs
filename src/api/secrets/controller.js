import Joi from 'joi'

const addSecretSchema = Joi.object({
  secret_name: Joi.string().min(1).required(),
  secret_key_pair_name: Joi.string().min(1).required(),
  secret_key_pair_value: Joi.string().required()
})

const removeSecretSchema = Joi.object({
  secret_name: Joi.string().min(1).required(),
  secret_key_pair_name: Joi.string().min(1).required()
})

export const addSecretKeyValuePairController = {
  options: {
    validate: {
      payload: addSecretSchema
    }
  },
  handler: (request, h) => {
    return h
      .response({
        statusCode: 200,
        body: null
      })
      .code(200)
  }
}

export const removeSecretKeyValuePairController = {
  options: {
    validate: {
      payload: removeSecretSchema
    }
  },
  handler: (request, h) => {
    return h
      .response({
        statusCode: 200,
        body: null
      })
      .code(200)
  }
}
