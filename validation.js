import Joi from 'joi';

const categorieSchema = Joi.object({
    name: Joi.string().required(),
});

export {
    categorieSchema,
}