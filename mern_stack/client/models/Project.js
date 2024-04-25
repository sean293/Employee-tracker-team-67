// model/Project.js

// for creating new projects

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	title: String,
	manager: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	description: String,
	createdAt: {
		type: Date,
		default: Date.now
	},
	client: {
		type: String,
		required: true,
	}
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
