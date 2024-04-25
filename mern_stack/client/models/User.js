// model/User.js

// for storing users

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	clock_in_out_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ClockInOut',
		default: null
	},
	role: {
		type: String,
		enum: ['Employee', 'Manager', 'Administrator'],
		default: 'Administrator'
	},
});

module.exports = mongoose.model('User', userSchema);
