const cron = require('node-cron');
const { Habit, HabitLog, User } = require('../models');

class HabitWorker {

  start() {
    this.missedHabitsTask = cron.schedule('*/30 * * * *', async () => {
      console.log('Habit Worker Running:', new Date().toISOString());
    });
    console.log('habit worker started.')
  }

  stop() {
    if (this.missedHabitsTask) {
      console.log('Habit Worker stopped');
    }
  }

}


module.exports = new HabitWorker();
