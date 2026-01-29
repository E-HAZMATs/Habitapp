// workers/habitWorker.js
const cron = require('node-cron');
const habitService = require('../services/habit.service');

class HabitWorker {
  constructor() {
    this.missedHabitsTask = null;
  }

  start() {
    this.missedHabitsTask = cron.schedule('*/30 * * * *', async () => {
      console.log('Habit Worker Running:', new Date().toISOString());
      await this.checkMissedHabits();
    });

    this.checkMissedHabits();
  }

  stop() {
    if (this.missedHabitsTask) {
      this.missedHabitsTask.stop();
      console.log('Habit Worker stopped');
    }
  }

  async checkMissedHabits() {
    try {
      const habits = await habitService.getOverdueHabits();
      console.log(`Habit Worker Found ${habits.length} overdue habits`);

      for (const habit of habits) {
        await this.processMissedHabit(habit);
      }
      
    } catch (error) {
      console.error('Habit Worker Error checking missed habits:', error);
    }
  }

  async processMissedHabit(habit) {
    try {
      const userTimezone = habit.User?.timezone || 'UTC';
      await habitService.logMissedHabit(habit, userTimezone);
    } catch (error) {
      console.error('Habit Worker Error processing missed habit:', error);
    }
  }
}

module.exports = new HabitWorker();