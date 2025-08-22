This is a Wix Grow onboarding project, with the goal to closely replicate most of the general functionality of the Google Calendar web-app.

It features a locally run .json server to simulate event creation and have persistent memory to display, edit or delete them.

1. To run the server, navigate to calendar-server via terminal ('cd calendar-server').
   Run 'npm install' (or your packagemanager of choice).
   Then run 'npm run start' to start it. It will run on Port 3000 by default.

2. To start the actual React calendar web-app, navigate to calendar-app via another terminal window ('cd calendar-app').
   Run 'npm install' (or your packagemanager of choice).
   Then run 'npm start' to start it. It will run on Port 3001 by default.

If there's issues, you can adjust the start script in calendar-app/package.json by removing the default port of PORT=3001, then running step 2 and letting the device choose its own port of choice.
