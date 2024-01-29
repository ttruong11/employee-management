// server.js
const express = require('express');
const cors = require('cors'); // Import the cors middleware
const bodyParser = require('body-parser'); // Import bodyParser for handling JSON requests
const routes = require('./routes'); // Import your custom routes

const app = express();
const port = process.env.PORT || 3001; // Set the port for your server

app.use(cors());
app.use(bodyParser.json()); // Enable JSON request parsing

// Use the custom routes
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
