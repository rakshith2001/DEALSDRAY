const Employee = require('../models/employeeModel')
const mongoose = require('mongoose')

const getEmployee = async (req, res) => {
    const user_id = req.user._id
  
    const workouts = await Employee.find({f_Id:user_id}).sort({createdAt: -1})
  
    res.status(200).json(workouts)
  }

const getSingleEmployee = async (req,res) => {
    const { id } = req.params


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such employee'})
    }
    const employee = await Employee.findById(id)

    if (!employee) {
        return res.status(404).json({error: 'No such Employee'})
    }
    res.status(200).json(employee)
}

const createEmployee = async (req,res) => {
    const {f_Name,f_Email,f_Mobile,f_Designation,f_gender,f_Course} = req.body
    
    let emptyFields = []
    if (!f_Name) {
        emptyFields.push('Name')
    }
    if (!f_Email) {
        emptyFields.push('Email')
    }
    if (!f_Mobile) {
        emptyFields.push('Mobile')
    }
    if (!f_Designation) {
        emptyFields.push('Designation')
    }
    if (!f_gender){
        emptyFields.push('Gender')
    }
    if (!f_Course){
        emptyFields.push('Course')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({error: `Please fill in the following fields: ${emptyFields.join(', ')}`})
    }
    try{
        const f_Id = req.user._id
        console.log(f_Id)
        const employee = await Employee.create({f_Id,f_Name,f_Email,f_Mobile,f_Designation,f_gender,f_Course})
        res.status(201).json(employee)
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
}

const deleteEmployee = async (req,res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const employee = await Employee.findByIdAndDelete(id)

    if(!employee){
        return res.status(404).json({error: 'No such employee'})
    }
    res.status(200).json(employee)
}

const updateEmployee = async (req,res) => {
    const {id} = req.params
    const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such employee' });
    }

    const updates = {};
    if (f_Name) updates.f_Name = f_Name;
    if (f_Email) updates.f_Email = f_Email;
    if (f_Mobile) updates.f_Mobile = f_Mobile;
    if (f_Designation) updates.f_Designation = f_Designation;
    if (f_gender) updates.f_gender = f_gender;
    if (f_Course) updates.f_Course = f_Course;

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ error: 'No such employee' });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    getEmployee,
    getSingleEmployee,
    createEmployee,
    deleteEmployee,
    updateEmployee,
};