const mongoose = require('mongoose');

// Association Schema (Many-to-Many relationship)
const associationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming you have a User model
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
});

const Association = mongoose.model('Association', associationSchema);
module.exports = Association;