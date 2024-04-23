// src/ProjectPage.js

// creates a page per project

import {useNavigate, useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {useAuth} from './AuthContext';
import axios from 'axios';
import EditProjectForm from './EditProjectForm'

const ProjectPage = () => {
	const navigate = useNavigate();
	const { projectName } = useParams(); // Access the project name from URL params
	const [project, setProject] = useState([]);
	const {user} = useAuth();
	const [isAuth, setIsAuth] = useState(false);
	const [showFormSettings, setShowFormSettings] = useState(false);

	const handleClockIn = async () => {
		try {
			const response = await axios.post('http://localhost:5000/clockUserIn', {
				title: projectName,
				username: user.username,
			});
			console.log("user clocked in",response);

		} catch (err) {
			console.log("WHOOPS!");
		}
	};

	const handleClockOut = async () => {
		try {
			const response = await axios.post('http://localhost:5000/clockUserOut', {
				username: user.username,
				title: projectName,
			});
			console.log("user clocked out",response);
		} catch (err) {
			console.log("WHOOPS!");
		}
	};

	useEffect(() => {
		const checkAccess = async () => {
			const title = projectName;
			try {
				if (!user)
				{
					navigate('/error');
					return;
				}
				if (user.role !== 'Administrator') {
					const res = await axios.get('http://localhost:5000/checkAccess', {
						params: {
							username: user.username,
							title: title
						}
					});
					if (!res.data.association)
					{
						console.log("user didn't have access to project");
						navigate('/error');
						return;
					}
				}

				setIsAuth(true);
				console.log("user was allowed through");

			} catch (err) {
				console.log("WHOOPS!", err);
			}
		};
		checkAccess();

		console.log(projectName);
	}, []); // empty array ensures this effect runs only once

	const fetchProjectData = async () => {

		console.log("fetching data!");
		if (!isAuth)
		{
			console.log("NOT AUTHORIZED");
			return;
		}
		// check if user has association to project
		try {
			console.log("trying to get project data");
			const response = await axios.get('http://localhost:5000/getProjectData', {
				params: {
					title: projectName
				}
			});
			// populate project
			setProject(response.data.project);
			console.log("response data:",response.data.project);

		} catch (err) {
			console.log("WHOOPS!");
		}
	};

	useEffect(() => {
		
		fetchProjectData();
	}, [isAuth]);

	return (
		<div className='content'>
			<button className="clock-in" onClick={handleClockIn}>Clock In</button>
			<button className="clock-out" onClick={handleClockOut}>Clock Out</button>
			{project && <div className="project-background">
				<h1 className="project-title text">{project.title}</h1>
				<h1 className="project-client text">Client: 	{project.client}</h1>
				<button className="settings hov" onClick={() => setShowFormSettings(true)}>⚙️</button>

				<div className='scroll-container'>
					<p className="project-description text">{project.description}</p>
				</div>
			</div>}
			{(user.role==="Administrator" || project.manager===user._id) && showFormSettings && <EditProjectForm project={project} setShowForm={setShowFormSettings}/>}
		</div>
	);
};

export default ProjectPage;
