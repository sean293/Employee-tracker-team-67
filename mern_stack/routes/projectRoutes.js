// routes/projectRoutes.js

// controls project requests such as creating new projects and getting all projects under a user

const User = require('../client/models/User');
const Project = require('../client/models/Project')
const Association = require('../client/models/Association')
const ClockInOut = require('../client/models/ClockInOut')

module.exports = function(app) {

	// handles new projects
	app.post('/newProject', async (req, res) => {
		const { username, title, description } = req.body;
		// const projectCount = await Project.countDocuments();
		// const titleCount = title+projectCount;
		console.log("creating new project under "+username, title, description);
		const user = await User.findOne({username: username});
		try {
			let project = new Project({
				title: title,
				description: description
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

	// handles getting projects that user has access to
	app.get('/getProject', async (req, res) => {
		const userId = req.query.username;
		console.log("getting projects from "+userId);

		// find our user
		const user = await User.findOne({username: userId});

		try {
			// find all associations with user
			const associations = await Association.find({ user: user }).populate('project');
			// compose list of projects based on associations
			const projects = associations.map(association => association.project);
			res.status(200).json({ success: true, projects });
		} catch (err) {
			console.error('Error fetching projects:', err);
			res.status(500).json({msg: 'Failed to fetch projects' });
		}
	});

	// handles getting a project's data
	app.get('/checkAccess', async (req, res) => {
		console.log("CHECKING ACCESS");
		const username = req.query.username;
		const title = req.query.title;
		console.log(username, title);

		const user = await User.findOne({username: username});
		const project = await Project.findOne({title: title});
		if (!user || !project)
		{
			return;
		}
		const userId = user._id;
		const projectId = project._id;
		console.log("userId "+userId, "projectId "+projectId);
		
		const association = await Association.findOne({user: userId, project: projectId});
		console.log(association);

		res.status(200).json({association});
	});

	// handles getting a project's data
	app.get('/getProjectData', async (req, res) => {
		const title = req.query.title;
		console.log("getting project "+title);

		// find our user
		const project = await Project.findOne({title: title});
		res.status(200).json({ project });
	});

	// handles user clocking into project
	app.post('/clockUserIn', async (req, res) => {
		const {title, username} = req.body;

		console.log("ATTEMPTING TO CLOCK",username,"INTO",title);
		try {
			// find our project and user
			const project = await Project.findOne({title: title});
			const user = await User.findOne({username: username});

			if (user.clock_in_out_id != null)
			{
				console.log("USER IS ALREADY CLOCKED IN");
				return res.status(404).json({msg:"user already clocked in"});
			}

			console.log("USER + PROJECT FOUND",user);

			// get their IDs
			const projectId = project._id;
			const userId = user._id;

			// make a new object
			let clockInOut = new ClockInOut({
				user_id: userId,
				project_id: projectId
			});
			await clockInOut.save();

			// save a reference of our clock in out item to the user
			user.clock_in_out_id = clockInOut._id;
			user.save();
			console.log(username,"IS NOW CLOCKED IN WITH ID",user.clock_in_out_id);

			res.status(200).json({ clockInOut });
		} catch(err) {
			console.error('Error clocking in:', err);
			res.status(500).json({msg: 'Failed to clock in' });
		}
	});

	// handles user clocking into project
	app.post('/clockUserOut', async (req, res) => {
		const {username, title} = req.body;

		console.log("ATTEMPTING TO CLOCK",username,"OUT");
		try {
			// find our user and project ID
			const user = await User.findOne({username: username});
			const project = await Project.findOne({title: title});
			const projectId = project._id;

			// get our clock in item
			const clockInOutId = user.clock_in_out_id;
			
			if (clockInOutId == null)
			{
				console.log("NOTHING TO CLOCK OUT OF");
				return res.status(404).json({msg:"User is not clocked in to any project."});
			}

			const clockInOutItem = await ClockInOut.findById(clockInOutId);
			

			if (clockInOutItem.project_id.toString() != projectId.toString())
			{
				console.log("THIS IS NOT THE RIGHT PROJECT",projectId,' ',clockInOutItem.project_id);
				return res.status(404).json({msg:"This is not the project the user is clocked into."});
			}

			// at our clockout date
			clockInOutItem.clock_out_time = new Date();

			// get both in and out time
			const clockInTime = clockInOutItem.clock_in_time;
			const clockOutTime = clockInOutItem.clock_out_time;

			// calculate our duration and add it to database item
			const durationInMilliseconds = clockOutTime.getTime() - clockInTime.getTime();
			const hours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));
			const minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);
			clockInOutItem.duration = {
				hours: hours,
				minutes: minutes,
				seconds: seconds
			};
			clockInOutItem.save();

			// our user no longer needs to keep track of clock in/out
			user.clock_in_out_id=null;
			user.save();
			console.log(username,"IS NOW CLOCKED OUT");

			res.status(200).json({ clockInOutItem });
		} catch(err) {
			console.error('Error clocking in:', err);
			res.status(500).json({msg: 'Failed to clock in' });
		}
	});
};