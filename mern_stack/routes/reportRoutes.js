// routes/reportRoutes.js

// controls report data on the backend

const User = require('../client/models/User');
const Project = require('../client/models/Project')
const ClockInOut = require('../client/models/ClockInOut')
const moment = require('moment');

module.exports = function(app) {

	// report get functions
	
	// get clock in out events from a user or project
	app.get('/getSelectionClockInOuts', async (req, res) => {
		const selection = req.query.selection;
		try {

			// find selection project or username
			const project = await Project.findOne({title: selection});
			if (project)
			{
				console.log("found project",project);
				const clockinouts = await ClockInOut.find({project_id: project._id});
				res.json({ clockinouts});
				return;
			}

			const user = await User.findOne({username: selection});
			if (user)
			{
				console.log("found user");
				const clockinouts = await ClockInOut.find({user_id: user._id});
				res.json({ clockinouts});
				return;
			}
				
		} catch (err) {
			console.error('Error fetching clockinouts:', err);
		}
	});

	// get all clock in and out events
	app.get('/getAllClockInOuts', async (req, res) => {
		console.log("getting all clockinouts");

		try {
			const clockinouts = await ClockInOut.find();
			res.json({ clockinouts});
		} catch (err) {
			console.error('Error fetching clockinouts:', err);
		}
	});

	// get usernames map for report
	app.get('/getUsernames', async (req, res) => {
		console.log("getting usernames for report");

		const { userIds } = req.query;

		if (!userIds) {
			return;
		}
	
		try {
			const users = await User.find({ _id: { $in: userIds } });
		
			// construct an object mapping user IDs to usernames
			const usernameMap = users.reduce((acc, user) => {
				acc[user._id] = user.username;
				return acc;
			}, {});

			console.log("usernames found");
		
			res.json(usernameMap);
		} catch (error) {
			console.error('Error fetching usernames:', error);
		}
	});

	// get project title map for report
	app.get('/getProjectTitles', async (req, res) => {
		
		const { projectIds } = req.query;
		console.log("getting project titles for report", projectIds);

		if (!projectIds) {
			return
		}
	
		try {
			const projects = await Project.find({ _id: { $in: projectIds } });
		
			// construct an object mapping project IDs to titles
			const titleMap = projects.reduce((acc, project) => {
				acc[project._id] = project.title;
				return acc;
			}, {});

			console.log("project titles found");

			res.json(titleMap);

		} catch (error) {
			console.error('Error fetching titles:', error);
			res.json({ error: 'Internal server error' });
		}
	});

	// get clocked in time for users
	app.get('/getTotalClockedInTime', async (req, res) => {
		try {
			const users = await User.find();

			// object to store total clocked-in time for each user
			const totalTimeByUser = {};
	
			// loop through each user and calculate total clocked-in time
			for (const user of users) {
				const userId = user._id;
	
				const clockIns = await ClockInOut.find({ user_id: userId });
	
				// calculate the total time spent clocked in for the user
				let totalTimeInSeconds = 0;
				clockIns.forEach(entry => {
					const durationInSeconds = moment(entry.clock_out_time).diff(moment(entry.clock_in_time), 'seconds');
	
					// add the duration to the total time
					totalTimeInSeconds += durationInSeconds;
				});
	
				// store the total time for the user in the object
				totalTimeByUser[user.username] = totalTimeInSeconds;
			}
			console.log("Times:", totalTimeByUser);
			res.json(totalTimeByUser);

		} catch (error) {
			console.error('Error fetching total clocked in time:', error);
		}
	});
};