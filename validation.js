import Joi from 'joi';

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
    cpf: Joi.string().pattern(/^\d{11}$/),
    birthday: Joi.date(),
})

export {
    categorieSchema,
    gamesSchema,
    customerSchema,
}