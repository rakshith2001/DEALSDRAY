const Employee = require('../models/employeeModel')
const mongoose = require('mongoose')


const path = require('path')
const multer = require('multer')

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
    const {f_Name,f_Email,f_Mobile,f_Designation,f_gender,f_Course,} = req.body
    let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    function isEmailValid(email) {
    
        if(email.length>254)
            return res.status(400).json({error: 'Email is too long'})
    
        var valid = emailRegex.test(email);
        if(!valid)
            return res.status(400).json({error: 'Email is invalid'})
    
        // Further checking of some things regex can't handle
        let parts = email.split("@");
        if(parts[0].length>64)
            return false;
    
        let domainParts = parts[1].split(".");
        if(domainParts.some(function(part) { return part.length>63; }))
            return res.status(400).json({error: 'Email is invalid'})
    
    }
    
    
    let emptyFields = []
    if (!f_Name) {
        emptyFields.push('Name')
    }
    if (!f_Email) {
        emptyFields.push('Email')
    }
    if (!f_Mobile ) {
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
    if (!req.file) {
        return res.status(400).json({error: 'Please upload an image'})
    }
    if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
        return res.status(400).json({error: 'Please upload a valid image'})
    }
    if (f_Mobile.length !== 10) {
        return res.status(400).json({error: 'Mobile number must be 10 digits'})
    }
    isEmailValid(f_Email)
    

    

    try{
        const f_Id = req.user._id
        const file = req.file
        console.log('Received File:', req.file);
        console.log('Received File:', req.file);
        const employee = await Employee.create({f_Id,f_Name,f_Email,f_Mobile,f_Designation,f_gender,f_Course,f_Image:file.filename})
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

    let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such employee' });
    }
    if(f_Mobile && f_Mobile.length !== 10){
        return res.status(400).json({error: 'Mobile number must be 10 digits'})
    }

    function isEmailValid(email) {
    
        if(email.length>254)
            return res.status(400).json({error: 'Email is too long'})
    
        var valid = emailRegex.test(email);
        if(!valid)
            return res.status(400).json({error: 'Email is invalid'})
    
        // Further checking of some things regex can't handle
        let parts = email.split("@");
        if(parts[0].length>64)
            return false;
    
        let domainParts = parts[1].split(".");
        if(domainParts.some(function(part) { return part.length>63; }))
            return res.status(400).json({error: 'Email is invalid'})
    
    }
    isEmailValid(f_Email)
    

    const updates = {};
    if (f_Name) updates.f_Name = f_Name;
    if (f_Email) updates.f_Email = f_Email;
    if (f_Mobile) updates.f_Mobile = f_Mobile;
    if (f_Designation) updates.f_Designation = f_Designation;
    if (f_gender) updates.f_gender = f_gender;
    if (f_Course) updates.f_Course = f_Course;
    if (req.file) updates.f_Image = req.file.filename;


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