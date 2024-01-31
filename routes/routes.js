const {Router} = require('express');
const controller = require('../controllers/controllers');
const authController = require('../controllers/authcontrollers');
const {	authenticate } = require('../middlewares/authentication');
const {	tasksCache } = require('../middlewares/cache');
const router = Router();
const User = ('../models/user');


//Add new task
router.post('/', authenticate, controller.createTask);

//Get tasks
router.get('/', authenticate, tasksCache, controller.getTasks);

//Get task
router.get('/:taskId', authenticate, controller.getTask);

//Update task information
router.patch('/:taskId', authenticate, controller.updateTask);

//Delete task
router.delete('/:taskId', authenticate, controller.deleteTask);

module.exports = router;
