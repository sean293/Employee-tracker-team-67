// routes/projectRoutes.js

// controls project requests such as creating new projects and getting all projects under a user

const User = require('../client/models/User');
const Project = require('../client/models/Project')
const Association = require('../client/models/Association')

module.exports = function(app) {

	// handles new projects
	app.post('/newProject', async (req, res) => {
		const { username, title, description } = req.body;
		console.log("creating new project under"+username, title, description);
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
}