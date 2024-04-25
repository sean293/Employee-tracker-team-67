// server.js

// imports & requirements
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
jwt = require('jsonwebtoken')

// create our express app
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

// import & use our routes for handling backend requests
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const reportRoutes = require('./routes/reportRoutes');
const timeChangeRequestRoutes = require('./routes/timeChangeRoutes');
userRoutes(app);
projectRoutes(app);
reportRoutes(app);
timeChangeRequestRoutes(app);

// connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Team67', { useNewUrlParser: true, useUnifiedTopology: true });

// listen for successful connection
mongoose.connection.on('connected', () => {
	console.log('MongoDB connected');

	// start the server
	app.listen(PORT, () => {
		console.log(`Server is running on port: ${PORT}`);
	});
});

// listen for connection errors
mongoose.connection.on('error', (err) => {
	console.error('Error connecting to MongoDB:', err);
});
