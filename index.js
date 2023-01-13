const express = require('express');
const config = require("config");
const app = express();

require('./Startup/logging')();
// require("./startup/cors")(app);
require('./Startup/routes')(app);
require('./Startup/db')();
require('./Startup/config')();
require('./Startup/validation')();
require('./Startup/prod')(app);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () => console.log(`I am listening on port ${port}...`));

module.exports = server;