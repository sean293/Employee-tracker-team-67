const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	title: String,
	description: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const associationSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	}
});

module.exports = mongoose.model('Association', associationSchema);
module.exports = mongoose.model('Project', projectSchema);