// src/projects.js

// once user is logged in, shows 

import {useNavigate, useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {useAuth} from './AuthContext';
import axios from 'axios';

const Report = () => {
	const navigate = useNavigate();
	const { selection } = useParams();
	const {user, logout} = useAuth();
	const [reportProject, setReportProject] = useState();
	const [reportUser, setReportUser] = useState();
	const [clockInOuts, setClockInOuts] = useState([]);
	const [usernames, setUsernames] = useState([]);
	const [titles, setTitles] = useState([]);

	const fetchClockInOuts = async () => {
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
				// console.log(response.data.clockinouts);
				setClockInOuts(response.data.clockinouts);
			}
		} catch (err) {
			// console.log(err);
		}
	};

	const fetchUsernames = async (userIds) => {
		try {
			const response = await axios.get('http://localhost:5000/getUsernames', {
				params: {
					userIds: userIds
				}
			});
			console.log("usernames",response.data);
			setUsernames(response.data);
		} catch (err) {
			// console.log(err);
		}
	};

	const fetchTitles = async (projectIds) => {
		try {
			const response = await axios.get('http://localhost:5000/getProjectTitles', {
				params: {
					projectIds: projectIds
				}
			});
			console.log("titles",response.data);
			setTitles(response.data);
		} catch (err) {
			// console.log(err);
		}
	};


	useEffect(() => {
		fetchClockInOuts();
		console.log("report selection",selection);
	}, []);

	useEffect(() => {
		setUsernames(fetchUsernames([...new Set(clockInOuts.map(entry => entry.user_id))]));
		setTitles(fetchTitles([...new Set(clockInOuts.map(entry => entry.project_id))]));
	}, [clockInOuts]); // empty array ensures this effect runs only once

	useEffect(() => {
		// console.log(usernames);
	}, [usernames]);

	return (
		<div className='content'>
			<table>
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
							<td className='table-data-clickable'>{usernames[entry.user_id]}</td>
							<td className='table-data-clickable'>{titles[entry.project_id]}</td>
							<td>{new Date(entry.clock_in_time).toLocaleString()}</td>
							<td>{entry.duration.hours}h {entry.duration.minutes}m {entry.duration.seconds}s</td>
						</tr>
					))}
					
				</tbody>
			</table>
		</div>
	);
};

export default Report;
