// routes/timeChangeRoutes.js

// time change requests for managers to accept or deny

const Project = require('../client/models/Project');
const ClockInOut = require('../client/models/ClockInOut');
const TimeChangeRequest = require('../client/models/TimeChangeRequest');

module.exports = function(app) {

	// time change post functions

	// accept a time change request
	app.post('/acceptTimeChangeRequest', async (req, res) => {
		const { timeChangeRequest_id} = req.body;

		console.log("Accepting time change request");

		try {
			const timechangerequest = await TimeChangeRequest.findById(timeChangeRequest_id);
			if (timechangerequest)
			{
				const duration = timechangerequest.new_duration;
				const durationms = ((duration.hours * 3600) + (duration.minutes * 60) + duration.seconds) * 1000;
	
				const clockouttimems = timechangerequest.new_clock_in_time.getTime() + durationms;
	
				const newclockouttime = new Date(clockouttimems);
	
				const update = {
					duration: timechangerequest.new_duration,
					clock_in_time: timechangerequest.new_clock_in_time,
					clock_out_time: newclockouttime
				}
				await ClockInOut.findByIdAndUpdate(timechangerequest.clock_in_out, update);
				await TimeChangeRequest.findByIdAndDelete(timeChangeRequest_id);
			}
		} catch (err) {
			console.error('Error accepting time change request', err);
		}
	});

	// deny a time change request
	app.post('/denyTimeChangeRequest', async (req, res) => {

		console.log("Denying time change request");
		const { timeChangeRequest_id } = req.body;

		try {
			await TimeChangeRequest.findByIdAndDelete(timeChangeRequest_id);
		} catch (err) {
			console.error('Error denying time change request', err);
		}
	});

	// create a new time change request
	app.post('/createTimeChangeRequest', async (req, res) => {
		const { clockinoutid, newclockintime, newduration, projectid, userid } = req.body;
		console.log("creating a new time change request");
		try {
			let existingTimeChangeRequest = await TimeChangeRequest.findOne({clock_in_out: clockinoutid});
			if (existingTimeChangeRequest) {
				console.log("previously existing time change request found, updating");
				existingTimeChangeRequest.clock_in_out = clockinoutid;
				existingTimeChangeRequest.new_clock_in_time = newclockintime;
				existingTimeChangeRequest.new_duration = newduration;
				await existingTimeChangeRequest.save();
			}
			else
			{
				console.log("created new time change request");
				let newTimeChangeRequest = new TimeChangeRequest({
					clock_in_out: clockinoutid,
					new_clock_in_time: newclockintime,
					new_duration: newduration,
					user_id: userid,
					project_id: projectid
				});
				await newTimeChangeRequest.save();
			}
		} catch (err) {
			console.error('Error creating time change request:', err);
		}
	});

	// retrieve time change requests
	app.get('/getAllTimeChangeRequests', async (req, res) => {
		console.log("getting all of the time change requests");
		try {
			const timeChangeRequests = await TimeChangeRequest.find();
			res.json({timeChangeRequests});
		} catch (err) {
			console.error('Error fetching time change requests:', err);
		}
	});

	// get all time change requests under a project
	app.get('/getProjectTimeChangeRequests', async (req, res) => {
		const project_title = req.query.project;
		try {
			const project = await Project.find({title: project_title});
			const projectid = project._id;
			const timeChangeRequests = await TimeChangeRequest.find({project_id: projectid});
			res.json({timeChangeRequests});
		} catch (err) {
			console.error('Error fetching time change requests under project:', err);
		}
	});


};