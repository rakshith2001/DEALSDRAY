const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema

const userSchema = new Schema({
    f_sno: {
        type: String,
        required: true,
        unique: true
    },
    f_userName: {
        type: String,
        required: true,
        unique: true
    },
    f_Pwd: {
        type: String,
        required: true
    }
  })



// static signup method
userSchema.statics.signup = async function(username, password) {

    // validation
    if (!username || !password) {
      throw Error('All fields must be filled')
    }

  
    const exists = await this.findOne({ f_userName:username })
  
    if (exists) {
      throw Error('User already in Present')
    }
  
    const salt = await bcrypt.genSalt(10)

    const hash = await bcrypt.hash(password, salt)

    const id = uuidv4()
  
    const user = await this.create({f_sno:id, f_userName:username, f_Pwd: hash })
  
    return user
}

userSchema.statics.login = async function(username, password) {

    if (!username || !password) {
      throw Error('All fields must be filled')
    }
  
    const user = await this.findOne({ f_userName:username })
    if (!user) {
      throw Error('Incorrect Username')
    }
  
    const match = await bcrypt.compare(password, user.f_Pwd)
    if (!match) {
      throw Error('Incorrect password')
    }
  
    return user
  }
  
  module.exports = mongoose.model('User', userSchema)




const User = mongoose.model('User', userSchema);

module.exports = User;