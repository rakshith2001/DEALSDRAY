const express = require('express')
const { createEmployee,updateEmployee,getEmployee,getSingleEmployee, deleteEmployee} = require('../controllers/employeeController')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()
const path = require('path')
const multer = require('multer')

// only logged in users can access these routes
router.use(requireAuth)

const storage = multer.diskStorage({
    destination: function(req, res,cb){
        cb(null,"./public/images")
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
    
})

const upload = multer({
    storage: storage,
})

// get all employees
router.get('/',  getEmployee)

// get single employee
router.get('/:id',getSingleEmployee)
//create employee
router.post('/',  upload.single('file'), createEmployee);
//delete employee
router.delete('/:id', deleteEmployee)
//update employee
router.patch('/:id', upload.single('file'),updateEmployee)

module.exports = router