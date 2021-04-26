const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const app = express()
require('dotenv').config()
const port = process.env.PORT

//routes
const vanRoutes = require('./routes/van')
const orderRoutes = require('./routes/order')

//middleware
app.use(helmet())
app.use(express.json()) //json bodyParser
app.use(
	express.urlencoded({
		extended: true
	})
) //parsing form data sent by form tag

//CORS ISSUE SOLVER
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, PATCH, DELETE'
	)
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	next()
})
//routes
app.use('/van', vanRoutes)
app.use('/order', orderRoutes)
//error handling middleware
app.use((error, req, res, next) => {
	console.log(error)
	const status = error.statusCode || 500
	const message = error.message
	res.status(status).json({ message })
})
//connect to mongoDb
//connecting to database
const mongoURI = process.env.MONGO_URI
const run = async () => {
	try {
		await mongoose.connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		})
		console.log('mongoDb Connected')
		app.listen(port)
		console.log('listening in ' + port)
	} catch (error) {
		console.log(error)
	}
}
run().catch(err => console.log(err))
