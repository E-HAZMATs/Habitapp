exports.calculateInitialDueDate = (data) => {
  const timezone = data.timezone || 'UTC';
  const date = getStartOfDayUTC(timezone);
  switch (data.frequencyType) {
    case 'daily': {
      const [hour, minute, second] = data.timeOfDay ? data.timeOfDay.split(':').map(Number) : [0, 0, 0];
      date.setTime(date.getTime() - getTimezoneOffsetMs(timezone, date) + (hour * 3600 + minute * 60 + second) * 1000);
      break;
    }
    case 'weekly': {
      const tzDayStr = new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'short' }).format(date);
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const dateDay = days.indexOf(tzDayStr);
      let daysToAdd = Number(data.dayOfWeek) - dateDay;
      if (daysToAdd < 0) daysToAdd += 7;
      date.setUTCDate(date.getUTCDate() + daysToAdd);
      break;
    }
    case 'monthly': {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit'
      }).formatToParts(date);
      const p = Object.fromEntries(parts.filter(x => x.type !== 'literal').map(x => [x.type, Number(x.value)]));
      if (Number(data.dayOfMonth) < p.day)
        date.setUTCMonth(date.getUTCMonth() + 1);
      const lastDayOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
      date.setUTCDate(Math.min(data.dayOfMonth, lastDayOfMonth));
      break;
    }
  }
  return date;
};

exports.calculateNextDueDate = (habit, fromDate, timezone) => {
  timezone = timezone || 'UTC';
  const from = new Date(fromDate);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(from);
  const p = Object.fromEntries(parts.filter(x => x.type !== 'literal').map(x => [x.type, Number(x.value)]));
  const offsetMs = getTimezoneOffsetMs(timezone, from);
  const nextDue = new Date(Date.UTC(p.year, p.month - 1, p.day, 0, 0, 0, 0) - offsetMs);

  switch (habit.frequencyType) {
    case 'daily':
      nextDue.setUTCDate(nextDue.getUTCDate() + habit.frequencyAmount);
      if (habit.timeOfDay) {
        const [hours, minutes, seconds] = habit.timeOfDay.split(':').map(Number);
        const base = new Date(nextDue);
        nextDue.setTime(base.getTime() - getTimezoneOffsetMs(timezone, base) + (hours * 3600 + minutes * 60 + (seconds || 0)) * 1000);
      }
      break;
 
    case 'weekly':
      nextDue.setUTCDate(nextDue.getUTCDate() + (7 * habit.frequencyAmount));
      const tzDayStr = new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'short' }).format(nextDue);
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const currentDay = days.indexOf(tzDayStr);
      const targetDay = Number(habit.dayOfWeek);
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd < 0) daysToAdd += 7;
      nextDue.setUTCDate(nextDue.getUTCDate() + daysToAdd);
      break;
 
    case 'monthly':
      nextDue.setUTCMonth(nextDue.getUTCMonth() + habit.frequencyAmount);
      const lastDayOfMonth = new Date(Date.UTC(nextDue.getUTCFullYear(), nextDue.getUTCMonth() + 1, 0)).getUTCDate();
      const targetDayOfMonth = Math.min(habit.dayOfMonth, lastDayOfMonth);
      nextDue.setUTCDate(targetDayOfMonth);      
      break;
  }
  return nextDue;
}
 
exports.getStartOfDayUTC = (timezone) => {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const p = Object.fromEntries(parts.filter(x => x.type !== 'literal').map(x => [x.type, Number(x.value)]));
  return new Date(Date.UTC(p.year, p.month - 1, p.day, 0, 0, 0, 0) - getTimezoneOffsetMs(timezone, now));
};

const getTimezoneOffsetMs = (timezone, date) => {
  const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const tzStr  = date.toLocaleString('en-US', { timeZone: timezone });
  return new Date(tzStr).getTime() - new Date(utcStr).getTime();
}; 
