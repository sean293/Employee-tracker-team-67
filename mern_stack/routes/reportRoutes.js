// routes/projectRoutes.js

// controls project requests such as creating new projects and getting all projects under a user

const User = require('../client/models/User');
const Project = require('../client/models/Project');
const Association = require('../client/models/Association');
const ClockInOut = require('../client/models/ClockInOut');

module.exports = function(app) {

	
	app.get('/getSelectionClockInOuts', async (req, res) => {
		const selection = req.query.selection;
		console.log("getting all clockinouts");

		try {

			// find selection project or username
			const project = await Project.findOne({title: selection});
			if (project)
			{
				console.log("found project",project);
				const clockinouts = await ClockInOut.find({project_id: project._id});
				res.status(200).json({ clockinouts});
				return;
			}

			const user = await User.findOne({username: selection});
			if (user)
			{
				console.log("found user");
				const clockinouts = await ClockInOut.find({user_id: user._id});
				res.status(200).json({ clockinouts});
				return;
			}
				
			} catch (err) {
				console.error('Error fetching clockinouts:', err);
			}
	});

	app.get('/getAllClockInOuts', async (req, res) => {
		const userId = req.query.username;
		console.log("getting all clockinouts");

		const clockinouts = await ClockInOut.find();
		
		try {
			res.status(200).json({ clockinouts});
		} catch (err) {
			console.error('Error fetching clockinouts:', err);
		}
	});

	app.get('/getUsernames', async (req, res) => {
		console.log("getting useranesm for report");

		const { userIds } = req.query;

		if (!userIds) {
			return
		}
	
		try {
		// Fetch users from the database using the provided user IDs
		const users = await User.find({ _id: { $in: userIds } });
	
		// Construct an object mapping user IDs to usernames
		const usernameMap = users.reduce((acc, user) => {
			acc[user._id] = user.username;
			return acc;
		}, {});

		console.log(userIds);
	
		res.status(200).json(usernameMap);
		} catch (error) {
		console.error('Error fetching usernames:', error);
		res.status(500).json({ error: 'Internal server error' });
		}
	});

	app.get('/getProjectTitles', async (req, res) => {
		
		const { projectIds } = req.query;
		console.log("getting project titles for report",projectIds);
		if (!projectIds) {
			return
		}
	
		try {
			// Fetch users from the database using the provided user IDs
			const projects = await Project.find({ _id: { $in: projectIds } });
		
			// Construct an object mapping user IDs to usernames
			const titleMap = projects.reduce((acc, project) => {
				acc[project._id] = project.title;
				return acc;
			}, {});

			console.log("sending titles back");
			res.status(200).json(titleMap);
		} catch (error) {
		console.log('Error fetching titles:', error);
		res.status(500).json({ error: 'Internal server error' });
		}
	});
};