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
  if (idError) return sendError(res, 400, req.__('invalidHabitId'))

  const { error } = habitCreateSchema.validate(req.body);
  if (error) return sendError(res, 400, error.details[0].message)

  const response = await habitService.update(habitId, req.user.id, req.body);
  if (response === 0) return sendError(res, 404, req.__('habitNoExist'));
  else if (response === -1)
    return sendError(res, 400, req.__("cantEditOtherUsersHabits"))
  else return sendSuccess(res, 200, req.__("operationSuccess"))
};

exports.delete = async (req, res) => {
  const habitId = req.params.id;
  const response = await habitService.delete(habitId, req.user.id);
  if (response === -1) {
    return sendError(res, 400, req.__("cantEditOtherUsersHabits"))
  } else if (response === 0) {
    return sendError(res, 404, req.__("habitNoExist"));
  }
  return sendSuccess(res, 200, req.__("operationSuccess"));
};

exports.getAllByUser = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {return sendError(res, 401, req.__('AuthRequired'))}
  const habits = await habitService.getAllByUser(userId)
  return sendSuccess(res, 200, req.__('operationSuccess'), habits)
}

exports.getById = async (req, res) => {
  const habitId = req.params.id
  const { error: idError } = habitIdSchema.validate(habitId);  
  if (idError) return sendError(res, 400, req.__('invalidHabitId'))

  const habit = await habitService.getById(habitId);
  if (!habit) return sendError(res, 404, req.__('notFound'))
    
  if (habit.userId !== req.user.id){
    if(req.user.role !== 'admin') return sendError(res, 401, req.__("notAuthorized"))
  }
  return sendSuccess(res, 200, req.__('operationSuccess'), habit)
}