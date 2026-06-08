# Habitapp

A personal habit tracking app I built for myself and as practice in full-stack development, mainly using Angular ExpressJS. Not deployed.

## Functionality

The app allows the user to store and track habits with repetition frequencies such as **daily**, **weekly**, and **monthly**. User can also set the frequency to be N-times the frequency like every N month.

A dashboard shows the user's saved habits sorted in order of closest due date. Due habits enable a `complete` button to log that habit occurrence as complete. Upon completion, the habit occurrence is logged in the HabitLogs page. If user forgets to complete a due habit, a `missed` instance will be logged by the worker running in the server. In both cases, the habit's due date will be recalculated to the next due date.

Due dates are relative to the user's explicitly given time zone. Upon a time zone change, the user's habits' due dates will be recalculated to fit the new time zone.

The app also has: JWT authentication with refresh tokens, Arabic and English with RTL support, and dark/light theme modes.

