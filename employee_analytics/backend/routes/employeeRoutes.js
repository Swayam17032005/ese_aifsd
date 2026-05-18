const express = require('express');
const { getEmployees, addEmployee, searchEmployees, deleteEmployee } = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getEmployees)
  .post(protect, addEmployee);

router.route('/search')
  .get(protect, searchEmployees);

router.route('/:id')
  .delete(protect, deleteEmployee);

module.exports = router;
