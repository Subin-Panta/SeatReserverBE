const mongoose = require('mongoose')
const Schema = mongoose.Schema
const orderSchema = new Schema(
	{
		seats: {
			type: Array,
			required: true
		},
		firstName: {
			type: String,
			required: true
		},
		lastName: { type: String, required: true },
		phoneNumber: {
			type: Number,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		vanNumber: {
			type: String,
			required: true
		}
	},
	{ timeStamps: true }
)
module.exports = mongoose.model('Order', orderSchema)
