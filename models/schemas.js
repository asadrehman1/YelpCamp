const Joi = require('joi');
const SanitizeHtml = require('sanitize-html');

const joi = Joi.extend((joi) => {

    return {

        type: 'string',
        base: joi.string(),
        rules: {
            htmlStrip: {
                validate(value) {
                    return SanitizeHtml(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                    });
                },
            },
        },
    };
});

module.exports.campgroundSchema = joi.object({
    campground:joi.object({
    title:joi.string().htmlStrip().required(),
    price:joi.number().required().min(0),
    // images:joi.string().required(),
    location:joi.string().htmlStrip().required(),
    description:joi.string().htmlStrip().required()
    }).required()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        body:joi.string().htmlStrip().required(),
        rating:joi.number().required().min(1).max(5),
    }).required()
})
