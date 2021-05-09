const { validationResult } = require('express-validator')
const Van = require('../models/van')
const Order = require('../models/order')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
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
			vanNumber,
			price: totalPrice,
			pricePerSeat: van.price
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
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		// Create a pdf documnet
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		console.log(result)
		const pdfDoc = new PDFDocument()
		//pipe it to a file
		const invoiceName = 'Invoice-' + result._id + '.pdf'
		const invoicePath = path.join('data', 'invoices', invoiceName)
		pdfDoc.pipe(fs.createWriteStream(invoicePath))
		//create it
		pdfDoc.fontSize(26).text('Invoice')
		pdfDoc.text('---------------------------------------')
		pdfDoc.fontSize(10)
		pdfDoc.text(`Order Number: ${result._id}`)
		pdfDoc.text('---------------------------------------')
		pdfDoc.fontSize(20).text('Details')
		pdfDoc.fontSize(10)
		pdfDoc.text(`Name: ${result.firstName} ${result.lastName}`)
		pdfDoc.text(`Contact: ${result.phoneNumber}`)
		pdfDoc.text(`Email: ${result.email}`)
		pdfDoc.text(`Van Number: ${result.vanNumber} `)
		pdfDoc.text(`Seats: ${result.seats.toString()}`)
		pdfDoc.text(`Number of Seats: ${result.seats.length} `)
		pdfDoc.text(`Price/Seat: ${result.pricePerSeat} `)
		pdfDoc.text('---------------------------------------')
		pdfDoc.text(`Total: ${result.price}`)
		pdfDoc
			.fontSize(8)
			.text(
				'To cancel your order please go to the orders tab on our homepage',
				{
					underline: true
				}
			)
		pdfDoc.end()
		res.status(200).json({ result })
	} catch (error) {
		//build a new Error and next it
		if (!error.statusCode) {
			error.statusCode = 500
		}
		return next(error)
	}
}

//link to get the
exports.getPdf = async (req, res, next) => {
	//get the pdf
	//create a readble stream
	const orderId = req.params.orderId
	if (!orderId) {
		const error = new Error('The orderId is required')
		error.statusCode = 422
		return next(error)
	}
	//check if the supplied orderId is valid moongooseId
	var cond = mongoose.Types.ObjectId.isValid(orderId)
	if (!cond) {
		const err = new Error('The Id is not of correct format')
		err.statusCode = 422
		return next(err)
	}
	//convert orderId into mongoose objectId
	const mongooseId = mongoose.Types.ObjectId(orderId)
	//check if the order is in the database
	try {
		const result = await Order.findById(mongooseId)
		if (!result) {
			throw new Error('No Such Error')
		}
		const invoicePath = path.join(
			__dirname,
			`../data/invoices/Invoice-${orderId}.pdf`
		)
		//create a read stream
		const file = fs.createReadStream(invoicePath)
		//pipe it to res
		file.pipe(res)
		file.on('error', error => {
			return next(error)
		})
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500
		}
		next(error)
	}
}

exports.findOrder = async (req, res, next) => {
	//get the order
	const orderId = req.params.orderId
	if (!orderId) {
		const error = new Error('The orderId is required')
		error.statusCode = 422
		return next(error)
	}
	//find the order in mongoose
	//check if the supplied orderId is valid moongooseId
	var cond = mongoose.Types.ObjectId.isValid(orderId)
	if (!cond) {
		const err = new Error('The Id is not of correct format')
		err.statusCode = 422
		return next(err)
	}
	//first convert string into mongoose ObjectId
	const convertedId = mongoose.Types.ObjectId(orderId)

	try {
		const result = await Order.findById(convertedId)
		if (!result) {
			throw new Error('No Such Order')
		}
		res.status(200).json({ result })
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500
		}
		next(error)
	}
}
