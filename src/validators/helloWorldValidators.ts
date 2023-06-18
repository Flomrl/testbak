import Joi from 'joi'

const helloWorldValidators = Joi.object({
    message: Joi.string().required(),
})

export default helloWorldValidators