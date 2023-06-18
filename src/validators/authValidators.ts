import Joi from 'joi'

const authValidators = Joi.object({
    main_token: Joi.string().required(),
    refresh_token: Joi.string().required()
})

export default authValidators