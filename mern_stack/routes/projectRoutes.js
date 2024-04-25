// routes/projectRoutes.js

// controls project requests such as creating new projects and getting all projects under a user

const User = require('../client/models/User');
const Project = require('../client/models/Project')
const Association = require('../client/models/Association')
const ClockInOut = require('../client/models/ClockInOut')

module.exports = function(app) {

	// project post functions

	// handles new projects
	app.post('/newProject', async (req, res) => {
		const { username, title, description, client } = req.body;
		console.log("creating new project under "+username, title, description);
		const user = await User.findOne({username: username});
		try {
			let project = new Project({
				title: title,
				manager: user,
				description: description,
				client: client
			});
			
			await project.save();

			let association = new Association({
				user: user,
				project, project
			});

			await association.save();
			
			console.log('Project registered successfully');
		} catch (err) {
			console.error('Error registering project:', err);
		}
	});

	// handles editing projects
	app.post('/editProject', async (req, res) => {
		const { usernames, title, description, project } = req.body;
		console.log("editing project",title);
		const updatedFields = { title: title, description: description };
		const projectId = project._id;
		try {
			// change title and description
			const project = await Project.findByIdAndUpdate(projectId, updatedFields, { new: true });
			
			// to change users we must delete all associations and reassociate
			await Association.deleteMany({ project: projectId });
			
			const users = await User.find({ username: { $in: usernames } });
			const userIds = users.map(user => user._id);

			const associations=[];
			for (const userId of userIds) {
				const association = await Association.create({ user: userId, project: projectId });
				associations.push(association);
			}

			console.log('project edited successfully');
			return;
		} catch (err) {
			console.error('failed to update project',err);
		}
	});

	// handles user clocking into project
	app.post('/clockUserIn', async (req, res) => {
		const {title, username} = req.body;

		console.log("clocking",username,"into",title);
		try {
			// find our project and user
			const project = await Project.findOne({title: title});
			const user = await User.findOne({username: username});

			if (user.clock_in_out_id != null)
			{
				console.log("user already clocked in");
				return;
			}

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
			console.log(username,"is now clocked in");

			res.json({ clockInOut });
		} catch(err) {
			console.error('Error clocking in:', err);
		}
	});

	// handles user clocking out of project
	app.post('/clockUserOut', async (req, res) => {
		const {username, title} = req.body;

		console.log("attempting to clock",username,"out");
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
				return;
			}

			const clockInOutItem = await ClockInOut.findById(clockInOutId);
			

			if (clockInOutItem.project_id.toString() != projectId.toString())
			{
				console.log("this is not the correct project",projectId,' ',clockInOutItem.project_id);
				return;
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
			console.log(username,"is now clocked out");

			res.json({ clockInOutItem });
		} catch(err) {
			console.error('Error clocking in:', err);
		}
	});

	// project get functions

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
			res.json({ projects });
		} catch (err) {
			console.error('Error fetching projects:', err);
		}
	});

	// handles getting all users on a project
	app.get('/getProjectUsers', async (req, res) => {
		const project = req.query.project;
		console.log("getting users from",project.title);

		try {
			// find all associations with project
			const associations = await Association.find({ project: project });
			const userIds = associations.map(association => association.user);
			const users = await User.find({ _id: { $in: userIds } });
			const usernames = users.map(users => users.username);
			return res.json({ usernames });
		} catch (err) {
			console.error("failed to get the users from a project",err);
		}
	});
	
	// handles getting all projects
	app.get('/getAllProject', async (req, res) => {
		try {
			console.log("getting all projects");
			const projects = await Project.find();
			res.json({ projects });
		} catch (err) {
			console.error('Error fetching projects:', err);
		}
	});

	// handles getting a project's data
	app.get('/checkAccess', async (req, res) => {
		const username = req.query.username;
		const title = req.query.title;
		console.log('checking if',username,'has access to',title);

		try {
			const user = await User.findOne({username: username});
			const project = await Project.findOne({title: title});
			if (!user || !project)
			{
				return;
			}
			const userId = user._id;
			const projectId = project._id;
			
			const association = await Association.findOne({user: userId, project: projectId});
			console.log('association found');

			res.json({association});
		} catch (err) {
			console.error('error checking if user has access to project:', err);
		}
	});

	// handles getting a project's data
	app.get('/getProjectData', async (req, res) => {
		const title = req.query.title;
		console.log("getting project data from",title);

		try {
			// find our project
			const project = await Project.findOne({title: title});
			res.json({ project });
		} catch (err) {
			console.error("error getting project data",err);
		}
	});

	// handles getting a project from a manager
	app.get('/getProjectFromManager', async (req, res) => {
		const id = req.query.id;
		
		try {
			console.log("getting project from manager");
	
			// find our user
			const project = await Project.findOne({manager: id});
			console.log("getting manager project", project.title);
			res.json({project});
		} catch (err) {
			console.error("error getting project from manager",err);
		}
	});
};