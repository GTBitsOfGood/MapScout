// Import external frameworks
require("dotenv").config({ path: __dirname + "/../.env" });

const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('cookie-session');
const app = express();
const PORT = process.env.PORT || 3000;

// Pull data from the environment variables
const connect = process.env.MONGODB_URI;
const secret = process.env.SESSION_SECRET;
const emailRoute = process.env.HOST_EMAIL_ROUTE;

// Ensure data is present
const errors = [];
if (!connect) {
  errors.push("MONGODB_URI");
}
if (!secret) {
  errors.push("SESSION_SECRET");
}

if (!emailRoute) {
  errors.push("HOST_EMAIL_ROUTE");
}

if (!process.env.STORAGE_SERVICE) {
  errors.push("STORAGE_SERVICE");
} else {
  if (process.env.STORAGE_SERVICE === "AWS") {
    if (!process.env.AWS_ACCESS_KEY_ID) {
      errors.push("AWS_ACCESS_KEY_ID");
    }
    if (!process.env.AWS_SECRET_ACCESS_KEY) {
      errors.push("AWS_SECRET_ACCESS_KEY");
    }
    if (!process.env.AWS_REGION) {
      errors.push("AWS_REGIOn");
    }
  } else if (process.env.STORAGE_SERVICE !== "Azure") {
    errors.push("STORAGE_SERVICE");
  } else {
    if (!process.env.AZURE_STORAGE_ACCOUNT_NAME) {
      errors.push("AZURE_STORAGE_ACCOUNT_NAME");
    }
    if (!process.env.AZURE_STORAGE_CONTAINER_NAME) {
      errors.push("AZURE_STORAGE_CONTAINER_NAME");
    }
    if (!process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY) {
      errors.push("AZURE_STORAGE_ACCOUNT_ACCESS_KEY");
    }
  }
}

if (errors.length > 0) {
    console.error(
        "Missing Environment Variables. Add the following to env.sh:\n"
    );
    errors.forEach(err => {
        console.error(err + "=");
    });
    console.error("\n");
    // Exit the server if some environment variables were not present
    process.exit();
}

// Import app
const generalRoutes = require('./backend/routes/routes');

// Connecting to mongo
mongoose.connect(connect);

// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret,
  name: 'my_session',
  keys: ['secret key'],
}));

// Prefix all backend routes with "/api"
app.use('/api/', generalRoutes);

// All other routes go to the frontend
app.get("*", (request, response) => {
    response.sendFile(__dirname + "/public/index.html"); // For React/Redux
});

// Listen on the proper port for the application
app.listen(PORT, err => {
    err
        ? console.error(err)
        : console.info(
              `Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`
          );
});
