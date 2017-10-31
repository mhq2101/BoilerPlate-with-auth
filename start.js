const db = require('./db');
const app = require('./server');
const port = process.env.PORT || 3000;
const debug = require('debug')('sql');
const chalk = require('chalk');
var server = require('http').createServer(app)
var io = require('socket.io')(server)
require('./server/socket')(io);


db.sync({ force: true })
  // sync our database
  .then(ok => console.log(chalk.blue(`Synced models to db webDaw`)))
  .then(function () {
    server.listen(port) // then start listening with our express server once we have synced
  })
  .catch(error => console.error(error))