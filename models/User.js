const log  = console.log;
const db  = require("../config/db.js");
require("dotenv").config();


const userTable = `
	CREATE TABLE IF NOT EXISTS freedb_freetestdb.user (
	  ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	  name VARCHAR(255) NULL,
	  email VARCHAR(45) NULL,
	  password VARCHAR(255) NULL
	)
  `;

db.query(userTable, (err, result) => {
  	if (err) {
  		log(err);
  	} else {
  		//log(result);
  		log("users table created or already exits");
  	}

});