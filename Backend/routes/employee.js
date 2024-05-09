const express = require('express')
const { createEmployee,updateEmployee,getEmployee,getSingleEmployee, deleteEmployee} = require('../controllers/employeeController')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// only logged in users can access these routes
router.use(requireAuth)

// get all employees
router.get('/', getEmployee)

// get single employee
router.get('/:id',getSingleEmployee)
//create employee
router.post('/',  createEmployee);
//delete employee
router.delete('/:id', deleteEmployee)
//update employee
router.patch('/:id', updateEmployee)

module.exports = router