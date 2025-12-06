const habitService = require("../services/habit.service");
const { sendError, sendSuccess } = require("../utils/responseHandler");
const { habitCreateSchema, habitIdSchema } = require('../validation/habit.validation')

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
