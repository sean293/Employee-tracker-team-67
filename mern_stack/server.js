const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
jwt = require('jsonwebtoken')

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

const User = require('./client/models/User');
const Project = require('./client/models/Project')
const Association = require('./client/models/Association')

app.post('/newProject', async (req, res) => {
	const { username, title, description } = req.body;
    console.log(username, title, description);
	const user = await User.findOne({username: username});
	try {
		let project = new Project({
			title,
			description
		});
		
		await project.save();

		let association = new Association({
			user: user,
			project, project
		});

		await association.save();
		
		return res.status(201).json({msg: 'Project registered successfully'});
	} catch (err) {
		console.error('Error registering project:', err);
		return res.status(500).json({ msg: 'Server Error' });
	}
});

app.get('/getProjects', async (req, res) => {
	const userId = req.query.username;
	console.log("getting projects from "+userId);
	const user = await User.findOne({username: userId});
	try {
		// Fetch all projects from the database
		// console.log("finding projects under "+user);
		const projects = await Association.find({user: user});
		res.status(200).json({ success: true, projects });
	} catch (err) {
		console.error('Error fetching projects:', err);
		res.status(500).json({msg: 'Failed to fetch projects' });
	}
});

app.post('/register', async (req, res) => {
	try {
		console.log("TRYING TO POST");
		const {username, email, password} = req.body;
		
		let user = await User.findOne({email});
		if (user) {
			return res.status(400).json({msg: 'User already exists'});
		}
		
		user = new User({
			username,
			email,
			password
		});
		
		await user.save();
		
		return res.status(201).json({msg: 'User registered successfully'});
	} catch (err) {
		console.error('Error registering user:', err);
		return res.status(500).json({ msg: 'Server Error' });
	}
});

app.post('/login', async (req, res) => {
	console.log("TRYING TO POST");
	const {username, password} = req.body;
	try {
		const user = await User.findOne({$or: [{username}, {email: username}]});
		if (!user) {
			return res.status(401).json({msg: 'Invalid credidentials.'});
		}
		if (password != user.password)
		{
			return res.status(401).json({msg: 'Invalid credidentials.'});
		}
		const token = jwt.sign({userId: user._id}, 'your_secret_key', {expiresIn: '1h'});
		res.json({token});
		console.log(token);
	} catch (err) {
		console.error('Error registering user:', err);
		res.status(500).json({msg: "Server Error"});
	}
});


app.get('/projects', async (req, res) => {
	try {
		// Find all associations for the user
		const associations = await Association.find({ user: userId }).populate('project');
		
		// Extract the projects from associations
		const projects = associations.map(assoc => assoc.project);
		
		// Send the list of projects to the client
		res.json(projects);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Team67', { useNewUrlParser: true, useUnifiedTopology: true });

// Listen for successful connection
mongoose.connection.on('connected', () => {
	console.log('MongoDB connected');

	// Start the server
	app.listen(PORT, () => {
		console.log(`Server is running on port: ${PORT}`);
	});
});

// Listen for connection errors
mongoose.connection.on('error', (err) => {
	console.error('Error connecting to MongoDB:', err);
});