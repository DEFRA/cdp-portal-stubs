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
    const { secret_name: secretName, secret_key_pair_name: secretKeyPairName } =
      request.payload

    return h
      .response({
        action: 'add_secret_key_value_pair',
        secret_name: secretName,
        secret_key_pair_name: secretKeyPairName
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
    const { secret_name: secretName, secret_key_pair_name: secretKeyPairName } =
      request.payload

    return h
      .response({
        action: 'remove_secret_key_value_pair',
        secret_name: secretName,
        secret_key_pair_name: secretKeyPairName
      })
      .code(200)
  }
}
