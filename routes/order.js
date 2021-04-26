const express = require('express')
const orderController = require('../controllers/orderController')
const router = express.Router()
const Van = require('../models/van')
const { check } = require('express-validator')
//make route for enabling placing order
router.post(
	'/verifyOrder/:vanId',
	[
		check('firstName').trim().not().isEmpty(),
		check('lastName').trim().not().isEmpty(),
		check('phoneNumber')
			.trim()
			.not()
			.isEmpty()
			.isNumeric()
			.isLength({ min: 9 }),
		check('email').trim().not().isEmpty(),
		check('seats').trim().not().isEmpty()
	],
	orderController.verifyOrder
)
router.get('/findOrder/:orderId', orderController.findOrder)
router.get('/downloadOrder/:orderId', orderController.getPdf)
router.post('/cancelOrder/:orderId')
module.exports = router
