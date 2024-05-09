const mongoose = require('mongoose')

require('dotenv').config()
const connectToDB = () => {
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    console.log('Connected to DB')
  })
  .catch((error) => {
    console.log(error)
})

}
module.exports = connectToDB