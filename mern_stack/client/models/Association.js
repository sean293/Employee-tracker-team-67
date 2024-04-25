// model/Association.js

// for linking projects to users & vice versa

const mongoose = require('mongoose');

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

const Association = mongoose.model('Association', associationSchema);
module.exports = Association;