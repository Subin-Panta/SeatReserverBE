const { validationResult } = require('express-validator')
const Van = require('../models/van')
const Order = require('../models/order')
exports.verifyOrder = async (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		//loop thorugh the errors array
		console.log(errors.errors)
		const errorArray = []
		errors.errors.map(item => errorArray.push(item.msg))
		console.log(errorArray)
		const error = new Error(errorArray)
		error.statusCode = '422'
		return next(error)
	}
	//get the van Number
	const vanNumber = req.params.vanId
	// //if no vanNumber
	// if (!vanNumber) {
	// 	const error = new Error('Need a van Number')
	// 	error.statusCode = '400'
	// 	next(error)
	// }
	//we need seat numbers that are reserved
	const seats = req.body.seats.split(',')
	//get the data of the van

	try {
		const van = await Van.findOne({ plateNumber: vanNumber })

		//check if van Exists

		if (!van) {
			return res.status(404).json({ msg: 'No Such Van Exists' })
		}

		//check if van is available
		if (!van.available) {
			return res.status(403).json({ msg: 'Forbidden' })
		}

		//check to see if the seats on the seats array is available
		let firstPhase = true

		seats.map(seat => {
			firstPhase = firstPhase && van[seat]
		})
		if (!firstPhase) {
			return res.status(403).json({ msg: 'Forbidden' })
		}
		//remove duplicates inside the array
		trueSeats = [...new Set(seats)]
		//EveryCheck has been passed
		//calculate TotalPrice
		//Number of seats
		const length = trueSeats.length
		const totalPrice = length * van.price

		//create Order
		//for order we need firstName lastName seats(already extracted) vanNumber(extracted)
		//phoneNumber
		//email
		const firstName = req.body.firstName
		const lastName = req.body.lastName
		const phoneNumber = req.body.phoneNumber
		const email = req.body.email
		const order = new Order({
			seats: trueSeats,
			firstName,
			lastName,
			phoneNumber,
			email,
			vanNumber
		})
		const result = await order.save()
		//after creating order save the seats
		//reserve Seats
		seats.map(seat => {
			van[seat] = false
		})
		try {
			await van.save()
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500
			}
			return next(error)
		}
		res.status(200).json({ result, price: totalPrice })
	} catch (error) {
		//build a new Error and next it
		if (!error.statusCode) {
			error.statusCode = 500
		}
		return next(error)
	}
}

//link to get the