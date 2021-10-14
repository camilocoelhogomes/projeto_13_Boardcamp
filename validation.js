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

export {
    categorieSchema,
    gamesSchema,
}