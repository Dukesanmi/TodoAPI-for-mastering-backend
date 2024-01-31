const log = console.log;
const db = require('../config/db');
const {decodeToken} = require('../services/jwtservice');
const Task = require('../models/task');
const User = require('../models/user');

// New task
exports.createTask = async (req, res) => {
 const { task, description, due_date, priority, done } = req.body;
 const token = req.headers.authorization.split(' ')[1];
 const decode = decodeToken(token);
 log(decode)

  // Create new task
  try {
    //Find user ID
    const findUser = await new Promise((resolve) => {
      db.query(`SELECT ID FROM user WHERE email = '${decode.email}'`, (err, result) => {
        resolve(result);
      });
    });
    log(findUser);

    // Add new task
    const newTask = await new Promise((resolve) => {
        db.query(`INSERT INTO task SET?`, {task: task, description: description, due_date: due_date, priority: priority, done: done, userId: findUser[0].ID}, (err, result) => {
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({ message: 'Invalid pagination parameters' });
  }
  const offset = (page - 1) * limit;

  try {
    const tasks = await new Promise((resolve) => {
      db.query(`SELECT * FROM task LIMIT ${limit} OFFSET ${offset}`, (err, result) => {
        resolve(result);
      });
    });

    const totalPages = Math.ceil(tasks.length / limit);

    res.setHeader('X-Total-Count', tasks.length);
    res.setHeader('X-Current-Page', page);
    res.setHeader('X-Total-Pages', totalPages);

    res.status(200).json({ status: 200, tasks: tasks });
  } 
  catch(err) {
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

//2018-03-22 08:30:58.000000000005'