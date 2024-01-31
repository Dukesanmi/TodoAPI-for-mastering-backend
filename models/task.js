const log  = console.log;
const db  = require("../config/db.js");
require("dotenv").config();


const taskTable = `
	CREATE TABLE IF NOT EXISTS freedb_freetestdb.task (
	  ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	  task VARCHAR(255) NULL,
	  description VARCHAR(45) NULL,
	  due_date DATETIME NULL,
	  priority ENUM('High', 'Medium', 'Low') NULL,
	  done BOOLEAN DEFAULT false,
	  userID INT NULL
	)
  `;
  	  //done ENUM('Completed', 'Not Completed') NULL,
db.query(taskTable, (err, result) => {
  	if (err) {
  		log(err);
  	} else {
  		//log(result);
  		log("task table created or already exits");
  	}

});