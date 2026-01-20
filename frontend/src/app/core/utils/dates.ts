export function compareDateDays(date1: Date, date2: Date): number {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    const diff = d1.getTime() - d2.getTime();
    return diff / (1000 * 60 * 60 * 24); // Days difference
}

// Pass a day of week number (sunday = 0), get the date of next day of week. If today is specified day, get today's date.
export function getNextDayDate(targetDay: number, startDate: Date): Date {
  const date = new Date(startDate);
  const currentDay = date.getDay();
  const diff = targetDay ? (targetDay + 7 - currentDay) % 7 : 0;
  date.setDate(date.getDate() + diff);
  return date;
}
