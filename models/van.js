const mongoose = require('mongoose')
const Schema = mongoose.Schema
const vanSchema = new Schema({
	seat1: {
		type: Boolean,
		default: true
	},
	seat2: {
		type: Boolean,
		default: true
	},
	seat3: {
		type: Boolean,
		default: true
	},
	seat4: {
		type: Boolean,
		default: true
	},
	seat5: {
		type: Boolean,
		default: true
	},
	seat6: {
		type: Boolean,
		default: true
	},
	seat7: {
		type: Boolean,
		default: true
	},
	seat8: {
		type: Boolean,
		default: true
	},
	seat9: {
		type: Boolean,
		default: true
	},
	seat10: {
		type: Boolean,
		default: true
	},
	seat11: {
		type: Boolean,
		default: true
	},
	seat12: {
		type: Boolean,
		default: true
	},
	seat13: {
		type: Boolean,
		default: true
	},
	seat14: {
		type: Boolean,
		default: true
	},
	seat15: {
		type: Boolean,
		default: true
	},
	seat16: {
		type: Boolean,
		default: true
	},
	seat17: {
		type: Boolean,
		default: true
	},
	price: {
		type: Number,
		required: true
	},
	plateNumber: {
		type: String,
		required: true
	},
	available: {
		type: Boolean,
		default: true
	}
})
module.exports = mongoose.model('Van', vanSchema)
