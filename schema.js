const Joi= require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(100),
        image: Joi.alternatives().try(
            Joi.string().uri(),
            Joi.object({
                url: Joi.string().uri()
            })
        )
    }).required(),
});

module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required(),
});
