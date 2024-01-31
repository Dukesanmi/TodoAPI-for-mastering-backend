const log = console.log;
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { createToken, decodeToken } = require('../services/jwtservice');

// Database reconnect
async function reconnect() {
  await db.connect(function(err) {
  if (err) {
    log(err);
    throw err
  } else {
      if (db.config.database === process.env.MYSQLDATABASE || db.config.database === process.env.MYSQLREMOTEDATABASE) {
      //if (connectDeets.config.database === process.env.MYSQLREMOTEDATABASE) {
          log(`MySQL Server is Connected to ${db.config.host}!`);
          log('connectDeets.state');
          log(db.stream.connecting);
          log(db._fatalError);
        //log(connectDeets);

      }
    }
  });
}

// Wait for connection
async function waitForConnection() {
	while (db.stream.connecting || db._fatalError) {
		await new Promise((resolve) => setTimeout(resolve, 200));
	}
}

// Signup
module.exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    log(req.body);

    try {
        db.query(`SELECT email from user WHERE email = '${email}'`, async(err, result) => {
            if (err) {
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
            if (result.length > 0) {
                log(result);
                res.status(400).json({ status: 400, message: "User already exist" });
            } else {
                const token = createToken(email);

                //Hash password
                const hashPassword = await bcrypt.hash(password, 10);
                log(hashPassword);

                db.query('INSERT INTO user SET ?', { name: name, email: email, password: hashPassword}, (err, result)=> {
                    if (err) {
                        res.status(500).json({ status: 500, message: "Something went wrong while creating account" });
                    } else if (result) {
                        log(result);
                        res.status(201).json({ status: 200, message:"User successfully created", token: token });
                    }
                });
            }

        });
    }
    catch(err) {
        log(`Our error is ${err}`);
        throw err;
        res.status(500).json({ status: 500, message: "Server error!" });

    }
}


// Login
module.exports.login = async (req, res) => {
const { email, password } = req.body;

    try {
        db.query(`SELECT * from user WHERE email = '${email}'`, async(err, result) => {
            if (err) {
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
            if (result.length = 1 && result[0] != undefined) {
            	log(result[0]);
                const passcheck = await bcrypt.compare(password, result[0].password);
                if (!passcheck) {
                    res.status(400).json({ status: 400, message: "Wrong email or password" });
                } else {
                    const token = createToken(email);
                    log(result);
                    res.status(200).json({ status: 200, message: "User logged in successfully", token: token });
                }

            } else {
               res.status(400).json({ status: 400, message: "Wrong email or password" });
            }

        });
    } catch(err) {
        log(`Our error is ${err}`);
        throw err;
        res.status(500).json({ status: 500, message: "Server error!" });
    }
}


//Edit user name (user function)
module.exports.updateUserName= async (req, res) => {
	const { name, password } = req.body;
	const id = req.params.userId;
	try {
		const updateUser = await new Promise((resolve) => {
			db.query(`UPDATE user SET name='${name}' WHERE ID = '${id}'`, (err, result) => {
				resolve(result);
			});
		}); 
		res.status(200).json({status: 200, message: "User name update successful"});
	} catch(err) {
		log(err);
		res.status(400).json({ err });
	}
}

//Edit user password (user function)
module.exports.updateUserPassword= async (req, res) => {
	const { name, password } = req.body;
	const id = req.params.userId;
	var newpassword;
	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		newpassword = hash;
		log(newpassword);
		
		const updateUser = await new Promise((resolve) => {
			db.query(`UPDATE user SET password='${newpassword}' WHERE ID = '${id}'`, (err, result) => {
				resolve(result);
			});
		});
		res.status(200).json({status: 200, message: "User password update successful"});
	} catch(err) {
		log(err);
		res.status(400).json({ err });
	}
}


// Admin functions
module.exports.findUsers = async (req, res)=> {
	try {
		const findUsers = await new Promise((resolve) => {
			db.query(`SELECT * from user`, (err, result) => {
				resolve(result);
			});
		}); 
		res.status(200).json({users: findUsers });
	} catch (err) {
		res.status(400).json({ err });
	}
}


//Delete user
module.exports.deleteUser = async (req, res)=> {
	const id = req.params.userId;
	try {
		deleteUser = await new Promise((resolve) => {
			db.query(`DELETE FROM user WHERE ID = ${id}`, (err, result) => {
				resolve(result);
			});
		});
		res.status(200).json({message: "User has been successfully deleted"}); 
	} catch(err) {
		res.status(400).json({ err });
	}
}
