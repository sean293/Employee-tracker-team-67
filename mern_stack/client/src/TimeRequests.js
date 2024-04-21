// src/projects.js

// once user is logged in, shows 

import {useNavigate, useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {useAuth} from './AuthContext';
import axios from 'axios';

const TimeRequests = () => {
	const navigate = useNavigate();
	const {user, logout} = useAuth();
	const [timeChangeRequests, setTimeChangeRequests] = useState([]);
    const [usernames, setUsernames] = useState([]);
	const [titles, setTitles] = useState([]);

	const fetchData = async () => {
		const response = await axios.get('http://localhost:5000/getAllTimeChangeRequests');
        setTimeChangeRequests(response.data.timeChangeRequests);
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

    const fetchUsernamesTitles = async () => {
		fetchUsernames([...new Set(timeChangeRequests.map(entry => entry.user_id))]);
		fetchTitles([...new Set(timeChangeRequests.map(entry => entry.project_id))]);
	};


	useEffect(() => {
		fetchData();
	}, []);

    useEffect(() => {
		fetchUsernamesTitles();
	}, [timeChangeRequests]);

    const handleAcceptClick = (timerequestchange) => {
		
	};

    const handleDeclineClick = (timerequestchange) => {
		
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
					{timeChangeRequests && timeChangeRequests.map(entry => (
						<tr key={entry._id} className='table-row-data'>
							<td className='table-data-clickable'>{usernames[entry.user_id]}</td>
							<td className='table-data-clickable'>{titles[entry.project_id]}</td>
							<td>{new Date(entry.clock_in_time).toLocaleString()}</td>
							<td>{entry.duration.hours}h {entry.duration.minutes}m {entry.duration.seconds}s</td>
							<td>
								<button onClick={() => handleAcceptClick(entry)}>✔️</button>
								<button onClick={() => handleDeclineClick(entry)}>❌</button>
							</td>
						</tr>
					))}
					
				</tbody>
			</table>}
		</div>
	);
};

export default TimeRequests;
