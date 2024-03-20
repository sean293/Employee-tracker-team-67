// routes/projectRoutes.js

// controls project requests such as creating new projects and getting all projects under a user

const User = require('../client/models/User');
const Project = require('../client/models/Project')
const Association = require('../client/models/Association')

module.exports = function(app) {

	// handles new projects
	app.post('/newProject', async (req, res) => {
		const { username, title, description } = req.body;
		const projectCount = await Project.countDocuments();
		const titleCount = title+projectCount;
		console.log("creating new project under "+username, titleCount, description);
		const user = await User.findOne({username: username});
		try {
			let project = new Project({
				title: titleCount,
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
}