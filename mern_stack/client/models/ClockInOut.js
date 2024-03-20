// model/ClockInOut.js

// for tracking user clock in/out

const mongoose = require('mongoose');

// ClockInOut Schema
const ClockInOutSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	project_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	},
	clock_in_time: {
		type: Date,
		default: Date.now
	},
	clock_out_time: {
		type: Date,
		default: null
	},
	duration: {
		hours: {
			type: Number,
			default: 0
		},
		minutes: {
			type: Number,
			default: 0
		},
		seconds: {
			type: Number,
			default: 0
		}
	}
});

const clockInOut = mongoose.model('ClockInOut', ClockInOutSchema);
module.exports = clockInOut;
