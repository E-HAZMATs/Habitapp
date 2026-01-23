exports.calculateNextDueDate = (habit, fromDate) => {
  const nextDue = new Date(fromDate);
 
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
 