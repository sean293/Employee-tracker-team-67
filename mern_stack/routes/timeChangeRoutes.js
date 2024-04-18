// routes/projectRoutes.js

// controls project requests such as creating new projects and getting all projects under a user

const User = require('../client/models/User');
const Project = require('../client/models/Project');
const Association = require('../client/models/Association');
const ClockInOut = require('../client/models/ClockInOut');
const TimeChangeRequest = require('../client/models/TimeChangeRequest');

module.exports = function(app) {

	
	app.post('/createTimeChangeRequest', async (req, res) => {
		const { clockinoutid, newclockintime, newduration } = req.body;

		try {
			let newTimeChangeRequest = new TimeChangeRequest({
				clock_in_out: clockinoutid,
				new_clock_in_time: newclockintime,
				new_duration: newduration
			});
		} catch (err) {
			console.error('Error fetching clockinouts:', err);
		}
	});

	app.get('/getTimeChangeRequests', async (req, res) => {
		const project_title = req.query.project;
		try {
			const project = await Project.find({title: project_title});
			const projectid = project._id;
			const timeChangeRequests = await TimeChangeRequest.find({project_id: projectid});
			res.status(200).json({timeChangeRequests});
		} catch (err) {
			console.error('Error fetching projects:', err);
		}
	});

	app.post('/acceptTimeChangeRequest', async (req, res) => {
		const { timeChangeRequest_id, newclockintime, newduration } = req.body;

		try {
			const timechangerequest = await TimeChangeRequest.findById(timeChangeRequest_id);
			const duration = timechangerequest.duration;
			const durationms = ((duration.hours * 3600) + (duration.minutes * 60) + duration.seconds) * 1000;
			const clockouttimems = timechangerequest.clock_in_time + durationms;
			const newclockouttime = new Date(clockouttimems);

			const update = {
				duration: newduration,
				clock_in_time: newclockintime,
				clock_out_time: newclockouttime
			}
			await ClockInOut.findByIdAndUpdate(timechangerequest.clock_in_out, update);
			await TimeChangeRequest.findByIdAndDelete(timeChangeRequest_id);
		} catch (err) {
			console.error('Error fetching clockinouts:', err);
		}
	});

	app.post('/denyTimeChangeRequest', async (req, res) => {
		const { timeChangeRequest_id } = req.body;

		try {
			TimeChangeRequest.findByIdAndDelete(timeChangeRequest_id);
		} catch (err) {
			console.error('Error fetching clockinouts:', err);
		}
	});


};