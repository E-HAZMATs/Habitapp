const Joi = require('joi');
const habitService = require('../services/habit.service')
const habitCreateSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    frequencyType: Joi.string().max(50).required(),
    frequencyAmount: Joi.number().min(1).required(),
    dayOfWeek: Joi.number().min(0).max(6),
    dayOfMonth: Joi.number().min(0).max(30),
    timeOfDay: Joi.string() // How to validate Time datatype in Joi?
}).required()

exports.create = async (req, res) => {
    console.log(req.user)
    const { error } = habitCreateSchema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    try{
        const userId = req.user.id;
        const data = req.body;
        const habit = await habitService.create({
            userId,
            name: data.name,
            description: data.description,
            frequencyType: data.frequencyType,
            frequencyAmount: data.frequencyAmount,
            dayOfWeek: data.dayOfWeek,
            dayOfMonth: data.dayOfMonth,
            timeOfDay: data.timeOfDay
        });

        res.status(201).send(habit)
    }
    catch(e){
        res.status(500).send(e.message)
    }
}