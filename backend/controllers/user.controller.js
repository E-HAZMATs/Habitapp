const Joi = require('joi');
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(), // 
    password: Joi.string().min(1).required() //set up min as 1 for now. quicker.
});
exports.register = async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message); 
    console.log(req.body)
    res.send("registerd. ^_*")
}