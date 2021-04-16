const express = require('express')
const vanController = require('../controllers/vanController')
const router = express.Router()
const Van = require('../models/van')
const { check } = require('express-validator')
//validate numberPlate is unique and is in the request body
router.post(
	'/addVan',
	[
		check('plateNumber').custom(async value => {
			if (!value) {
				throw new Error('Empty Field')
			}
			if (value.length < 7) {
				throw new Error('Number Plate cannot be less than 7 characters')
			}
			//check to see if it is unique
			const van = await Van.find({ plateNumber: value })
			console.log(van)
			if (van.length > 0) {
				throw new Error('Number Plate must be Unique')
			}
		}),
		check('price').not().isEmpty().isNumeric()
	],
	vanController.createVan
)
//get data of 3 vans that have available=true property
router.get('/getData', vanController.getData)
module.exports = router
