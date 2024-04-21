// src/projects.js

// once user is logged in, shows 

import {useNavigate, useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {useAuth} from './AuthContext';
import axios from 'axios';
import Chart from 'chart.js/auto';
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

	// Function to render the bar chart
    const renderBarChart = (data) => {
		const real_labels = Object.keys(data)
        const labels = Object.keys(data)//.map(userId => usernames[userId]);
		//const labels = ["Jodeman"];
        const values = Object.values(data);
		//console.log("Bruh: ", labels, values);
		//fetchUsernames("66168d7efd41a13787851dde")

        const ctx = document.getElementById('barChart').getContext('2d');

		

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Time Clocked In',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
					x: {
						title: {
							display: true,
							text: 'User'
						}
					},
                    y: {
                        beginAtZero: true,
						title: {
							display: true, 
							text: 'Total time (seconds)'
						}
                    }
                }
            }
        });
    };

	{/*const fetchClockInOuts = async () => {
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
	};*/}

	

	// Function to fetch clock in/out data
    const fetchClockInOuts = async () => {
        try {
            let response = null;
            if (!selection) {
                if (user.role === 'Administrator') {
                    response = await axios.get('http://localhost:5000/getAllClockInOuts');
                }
            } else {
                response = await axios.get('http://localhost:5000/getSelectionClockInOuts', {
                    params: {
                        selection: selection
                    }
                });
            }

            const clockInOuts = response.data.clockinouts;
            const totalTimeByUser = {};

            clockInOuts.forEach(entry => {
				//console.log("Time for ", entry.user_id, " is ", entry.duration.hours * 3600 + entry.duration.minutes * 60 + entry.duration.seconds);
                totalTimeByUser[entry.user_id] = (totalTimeByUser[entry.user_id] || 0) + entry.duration.hours * 3600 + entry.duration.minutes * 60 + entry.duration.seconds;
            });

			console.log("Total times", totalTimeByUser)

            renderBarChart(totalTimeByUser);
        } catch (err) {
            console.error(err);
        }
    };

    fetchClockInOuts();

	

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
			<canvas id="barChart"></canvas>
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
			</table>
			{showFormTimeChangeRequest && <TimeChangeRequestForm handleTimeChangeRequest={handleTimeChangeRequest} setShowForm={setShowFormTimeChangeRequest} clockinout={clockInOut} />}
		</div>
	);
};

export default Report;
