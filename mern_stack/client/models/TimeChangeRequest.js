// model/ClockInOut.js

// for tracking user time change requests

const mongoose = require('mongoose');

const TimeChangeRequestSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	project_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	},
	project_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	},
	clock_in_out: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ClockInOut'
	},
	new_clock_in_time: {
		type: Date,
		default: null
	},
	new_duration: {
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

const timeChangeRequest = mongoose.model('TimeChangeRequest', TimeChangeRequestSchema);
module.exports = timeChangeRequest;
