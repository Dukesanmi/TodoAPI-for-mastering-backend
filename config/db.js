const log  = console.log;
const mysql  = require('mysql2');
require('dotenv').config();

log(process.env.NODE_ENV);


// Connection details
if (process.env.NODE_ENV === 'development') {
    var setDatabase = process.env['MYSQLDATABASE'];
    // LOCAL
    var connectDeets = mysql.createConnection({
        host: process.env['MYSQLHOSTLOCAL'],
        user: process.env['MYSQLUSERNAME'],
        password: process.env['MYSQLPASSWORD'],
        database: process.env['MYSQLDATABASE']
    });
} else {
    var setDatabase = process.env['MYSQLREMOTEDATABASE'];
    // REMOTE SERVER
    var connectDeets = mysql.createConnection({
        host: process.env['MYSQLREMOTEHOST'],
        user: process.env['MYSQLREMOTEUSERNAME'],
        password: process.env['MYSQLREMOTEPASSWORD'],
        database: process.env['MYSQLREMOTEDATABASE']
    });
}

log(setDatabase);
// Connect to DB
connectDeets.connect(function(err) {
  if (err) {
    log(err);
    throw err
  } else {
    if (connectDeets.config.database === process.env.MYSQLDATABASE || connectDeets.config.database === process.env.MYSQLREMOTEDATABASE) {
    //if (connectDeets.config.database === process.env.MYSQLREMOTEDATABASE) {
        log(`MySQL Server is Connected to ${connectDeets.config.database}!`);
        log(`MySQL Server is Connected to ${connectDeets.config.host}!`);
        log('connectDeets.state');
        //log(connectDeets);

    } else {
        connectDeets.query(`CREATE SCHEMA ${setDatabase}`, function(err, result) {
            if (err) {
                log(err);
                throw err;
            }
            log('Database created!');
        });
    }
  }
});

module.exports = connectDeets;
