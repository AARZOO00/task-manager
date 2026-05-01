const express = require('express');
const router = express.Router();
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createTaskValidator, updateTaskValidator } = require('../validators/task.validator');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTaskValidator, validate, createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTaskValidator, validate, updateTask)
  .delete(deleteTask);

module.exports = router;
