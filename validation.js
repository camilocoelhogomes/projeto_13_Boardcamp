import Joi from 'joi'
import joi from '@joi/date'
const extendedJoi = Joi.extend(joi)

const categorieSchema = Joi.object({
    name: Joi.string().required(),
});


const gamesSchema = Joi.object({
    name: Joi.string().required(),
    stockTotal: Joi.number().greater(0).required(),
    pricePerDay: Joi.number().greater(0).required(),
    image: Joi
        .string()
        .required(),
    categoryId: Joi.number().required(),
})

const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string(),
    cpf: Joi.string().pattern(/^\d{11}$/).required(),
    birthday: extendedJoi.date().format('YYYY-MM-DD').utc(),
})

export {
    categorieSchema,
    gamesSchema,
    customerSchema,
}