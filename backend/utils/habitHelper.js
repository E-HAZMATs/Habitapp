exports.calculateInitialDueDate = (data) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  switch (data.frequencyType) {
    case 'daily': {
      const [hour, minute, second] = data.timeOfDay ? data.timeOfDay.split(':').map(Number) : [0, 0, 0];
      date.setHours(hour, minute, second);
      break;
    }
    case 'weekly': {
      const dateDay = date.getDay();
      let daysToAdd = Number(data.dayOfWeek) - dateDay;
      if (daysToAdd < 0) daysToAdd += 7;
      date.setDate(date.getDate() + daysToAdd);
      break;
    }
    case 'monthly': {
      if (Number(data.dayOfMonth) < date.getDate())
        date.setMonth(date.getMonth() + 1);
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      date.setDate(Math.min(data.dayOfMonth, lastDayOfMonth));
      break;
    }
  }
  return date;
};

exports.calculateNextDueDate = (habit, fromDate) => {
  const nextDue = new Date(fromDate);
  nextDue.setHours(0,0,0,0); //CHECKIMP: This could problomatic due to timezones. 
  switch (habit.frequencyType) {
    case 'daily':
      nextDue.setDate(nextDue.getDate() + habit.frequencyAmount);
     
      if (habit.timeOfDay) {
        const [hours, minutes, seconds] = habit.timeOfDay.split(':').map(Number);
        nextDue.setHours(hours, minutes, seconds || 0, 0);
      }
      break;
 
    case 'weekly':
      nextDue.setDate(nextDue.getDate() + (7 * habit.frequencyAmount));
     
      const currentDay = nextDue.getDay();
      const targetDay = habit.dayOfWeek;
      let daysToAdd = targetDay - currentDay;
     
      if (daysToAdd < 0) {
        daysToAdd += 7;
      }
      nextDue.setDate(nextDue.getDate() + daysToAdd);
      break;
 
    case 'monthly':
      nextDue.setMonth(nextDue.getMonth() + habit.frequencyAmount);
     
      const lastDayOfMonth = new Date(
        nextDue.getFullYear(),
        nextDue.getMonth() + 1,
        0
      ).getDate();
     
      const targetDayOfMonth = Math.min(habit.dayOfMonth, lastDayOfMonth);
      nextDue.setDate(targetDayOfMonth);      
      break;
  }
 
  return nextDue;
}
 