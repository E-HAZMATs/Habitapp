const Joi = require("joi");
const habitService = require("../services/habit.service");
const { sendError, sendSuccess } = require("../utils/responseHandler");

const habitCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  frequencyType: Joi.string().valid("daily", "weekly", "monthly").required(),
  frequencyAmount: Joi.number().min(1).required(),
  dayOfWeek: Joi.number().min(0).max(6),
  dayOfMonth: Joi.number().min(0).max(30),
  timeOfDay: Joi.string(), // How to validate Time datatype in Joi?
}).required();

const habitIdSchema = Joi.string().uuid({ version: "uuidv4" }).required();

exports.create = async (req, res) => {
  const { error } = habitCreateSchema.validate(req.body);
  if (error) return sendError(res, 400, error.details[0].message);
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
    timeOfDay: data.timeOfDay,
  });

  return sendSuccess(res, 201, undefined, {
    habit: habit,
  });
};

exports.update = async (req, res) => {
  const habitId = req.params.id;
  const { error: idError } = habitIdSchema.validate(habitId);
  if (idError) return res.status(400).send(req.__("invalidHabitId"));

  const { error } = habitCreateSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const response = await habitService.update(habitId, req.user.id, req.body);
  console.log(response);
  if (response === 0) return res.status(404).send(req.__("habitNoExist"));
  else if (response === -1)
    return res.status(400).send(req.__("cantEditOtherUsersHabits"));
  else return res.status(200).send(req.__("operationSuccess"));
};

exports.delete = async (req, res) => {
  const habitId = req.params.id;
  const response = await habitService.delete(habitId, req.user.id);
  if (response === -1) {
    return res.status(400).send(req.__("cantEditOtherUsersHabits"));
  } else if (response === 0) {
    return res.status(404).send(req.__("habitNoExist"));
  }
  return res.status(200).send(req.__("operationSuccess"));
};
