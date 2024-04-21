// src/projects.js

// once user is logged in, shows 

import {useNavigate, useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {useAuth} from './AuthContext';
import axios from 'axios';
import TimeChangeRequestForm from './TimeChangeRequestForm'

const Report = () => {
	const navigate = useNavigate();
	const { selection } = useParams();
	const {user, logout} = useAuth();
	const [clockInOuts, setClockInOuts] = useState([]);
	const [usernames, setUsernames] = useState([]);
	const [titles, setTitles] = useState([]);

	const [clockInOut, setClockInOut] = useState();

	const [showFormTimeChangeRequest, setShowFormTimeChangeRequest] = useState(false);

	
	const fetchClockInOuts = async () => { 
		// Function obtains all accessible data for the reports for the user tier
		var response = null;
		try {
			if (!selection) {
				if (user.role === 'Administrator') {
					response = await axios.get('http://localhost:5000/getAllClockInOuts');
					// console.log(response.data.clockinouts);
					setClockInOuts(response.data.clockinouts);
				}
			} else {
				response = await axios.get('http://localhost:5000/getSelectionClockInOuts', {
					params: {
						selection: selection
					}
				});
				setClockInOuts(response.data.clockinouts);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const fetchUsernames = async (userIds) => {
		try {
			const response = await axios.get('http://localhost:5000/getUsernames', {
				params: {
					userIds: userIds
				}
			});
			setUsernames(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchTitles = async (projectIds) => {
		try {
			const response = await axios.get('http://localhost:5000/getProjectTitles', {
				params: {
					projectIds: projectIds
				}
			});
			setTitles(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchData = async () => {
		fetchUsernames([...new Set(clockInOuts.map(entry => entry.user_id))]);
		fetchTitles([...new Set(clockInOuts.map(entry => entry.project_id))]);
	};

	useEffect(() => {
		fetchClockInOuts();
	}, [selection]);

	useEffect(() => {
		fetchData();
	}, [clockInOuts]);

	const handleSelectionClick = (item) => {
		//Navigates URL to selected item, (User or Project)
		navigate(`/reports/${item}`);
	};

	const handleEditClick = (clockinout) => {
		setClockInOut(clockinout);
		console.log("CLOCKINOUT:",clockinout);
		setShowFormTimeChangeRequest(true);
	};

	const handleTimeChangeRequest = async (clockinoutid, clockInTime, duration, projectid, userid) => {

		try {
			console.log("time chagne requesting???");
			const res = await axios.post('http://localhost:5000/createTimeChangeRequest', {
				clockinoutid: clockinoutid,
				newclockintime: clockInTime,
				newduration: duration,
				projectid: projectid,
				userid: userid
			});
			setShowFormTimeChangeRequest(false);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className='content'>
			{<table>
				<thead>
					<tr>
						<th>User ID</th>
						<th>Project ID</th>
						<th>Clock In Time</th>
						<th>Duration</th>
					</tr>
				</thead>
				<tbody>
					{clockInOuts && clockInOuts.map(entry => (
						<tr key={entry._id} className='table-row-data'>
							<td className='table-data-clickable' onClick={() => handleSelectionClick(usernames[entry.user_id])}>{usernames[entry.user_id]}</td>
							<td className='table-data-clickable' onClick={() => handleSelectionClick(titles[entry.project_id])}>{titles[entry.project_id]}</td>
							<td>{new Date(entry.clock_in_time).toLocaleString()}</td>
							<td>{entry.duration.hours}h {entry.duration.minutes}m {entry.duration.seconds}s</td>
							<td>
								<button onClick={() => handleEditClick(entry)}>🖊️</button>
							</td>
						</tr>
					))}
					
				</tbody>
			</table>}
			{showFormTimeChangeRequest && <TimeChangeRequestForm handleTimeChangeRequest={handleTimeChangeRequest} setShowForm={setShowFormTimeChangeRequest} clockinout={clockInOut} />}
		</div>
	);
};

export default Report;
