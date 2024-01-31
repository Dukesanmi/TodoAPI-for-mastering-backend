const log = console.log;
const db = require('../config/db');
const { setToRedis } = require('../config/redis');
const {decodeToken} = require('../services/jwtservice');
const Task = require('../models/task');
const User = require('../models/user');

// New task
exports.createTask = async (req, res) => {
 const { task, description, due_date, priority, done } = req.body;
 const token = req.headers.authorization.split(' ')[1];
 const decode = decodeToken(token);
 log(decode);

  // Create new task
  try {
    // Add new task
    const newTask = await new Promise((resolve) => {
        db.query(`INSERT INTO task SET?`, {task: task, description: description, due_date: due_date, priority: priority, done: done, userEmail: decode.email }, (err, result) => {
            if (err) {
              log(err);
              //res.status(500).json({status: 500, message: "Something went wrong"});
            }
            resolve(result);
            res.status(200).json({status: 200, message: "New task added successfuly"})
          });
      });
  } catch (err) {
    	log(err);
      throw err;
    	res.status(400).json({ status: 500, message: "Server error" });
  }

}

//View tasks
module.exports.getTasks = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decode = decodeToken(token);
  log(decode.email);
  

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({ message: 'Invalid pagination parameters' });
  }
  const offset = (page - 1) * limit;

  try {
    const tasks = await new Promise((resolve) => {
      db.query(`SELECT * FROM task WHERE userEmail='${decode.email}' LIMIT ${limit} OFFSET ${offset}`, (err, result) => {
        resolve(result);
      });
    });
    //log(tasks);
    const totalPages = Math.ceil(tasks.length / limit);

    res.setHeader('X-Total-Count', tasks.length);
    res.setHeader('X-Current-Page', page);
    res.setHeader('X-Total-Pages', totalPages);
    
    // Prepare key and value for cache
    const key = `page ${page}`;
    const stringifiedTasks = JSON.stringify(tasks);

    // Set tasks data to redis for caching
    await setToRedis(key, stringifiedTasks, 10000);
    log("Done with redis");

    res.status(200).json({ status: 200, tasks: tasks });
  } 
  catch(err) {
    log(err);
    res.status(500).json({ status:500, message: "Something went wrong" });
  }
}


// Get task by taskId
module.exports.getTask = async (req, res) => {
  const id = req.params.taskId;
    try {
      const task = await new Promise((resolve) => {
        db.query(`SELECT * FROM task WHERE ID =${id}`, (err, result) => {
          resolve(result);
        });
      });
      res.status(200).json({ status: 200, tasks: tasks });
  }  
  catch(err) {
    res.status(500).json({ status:500, message: "Something went wrong" });
  }
}


//Update task
module.exports.updateTask = async (req, res) => { 
  const { task, description, due_date, priority, status } = req.body;
  const id = req.params.taskId;

  try {
    const updateUser = await new Promise((resolve) => {
      db.query(`UPDATE user SET task ='${task}', description='${description}', due_date = ${due_date}, priority = ${priority}, status = ${status} WHERE ID = '${id}'`, (err, result) => {
        resolve(result);
      });
    }); 
    res.status(200).json({status: 200, message: "Task update successful"});
  }
  catch(err) {
    res.status(400).json({ err });
  }
}

//Delete task
module.exports.deleteTask = async (req, res)=> {
  const id = req.params.id;
  try {
    deleteUser = await new Promise((resolve) => {
      db.query(`DELETE FROM task WHERE ID = ${id}`, (err, result) => {
        resolve(result);
      });
    });
    res.status(200).json({message: "Task has been successfully deleted"});
  } catch(err) {
    log(err);
    res.status(400).json({ err });
  }
}
