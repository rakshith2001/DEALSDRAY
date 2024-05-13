require('dotenv').config()
const express = require('express')
const userRoutes = require('./routes/user')
const connectToDB = require('./models/connection/dbConnection')
const cors = require('cors')
const employeeRoutes = require('./routes/employee')



const app = express()

// middleware
app.use(express.json())
app.use(express.static('public'))
// Enable CORS
app.use(cors())

// connect to db
connectToDB()

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/user', userRoutes)
app.use('/api/employee', employeeRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
