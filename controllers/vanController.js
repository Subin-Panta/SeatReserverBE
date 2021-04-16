const { validationResult } = require('express-validator')
const Van = require('../models/van')
exports.createVan = async (req, res, next) => {
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
	const van = new Van({
		plateNumber: req.body.plateNumber,
		price: req.body.price
	})
	const result = await van.save()
	res.status(200).json({ result })
}
exports.getData = async (req, res, next) => {
	const data = await Van.find({ available: true }).limit(3)
	res.json({ data })
	console.log(data)
}
