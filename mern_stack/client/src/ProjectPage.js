// src/ProjectPage.js

// creates a page per project

import {useNavigate, useParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {useAuth} from './AuthContext';
import axios from 'axios';

const ProjectPage = () => {
	const navigate = useNavigate();
	const { projectName } = useParams(); // Access the project name from URL params
	const [project, setProject] = useState([]);
	const {user} = useAuth();
	const [isAuth, setIsAuth] = useState(false);

	useEffect(() => {
		const checkAccess = async () => {
			try {
				const title = projectName;
				const res = await axios.get('http://localhost:5000/checkAccess', {
					params: {
						username: user,
						title: title
					}
				});
				if (!res.data.association)
				{
					console.log("user didn't have access to project");
					navigate('/error');
					return;
				}

				setIsAuth(true);
				console.log("user was allowed through");

			} catch (err) {
				console.log("WHOOPS!", err);
			}
		};
		checkAccess();
	}, []); // empty array ensures this effect runs only once

	useEffect(() => {
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
		fetchProjectData();
	}, [isAuth]);

	return (
		<div className="project-background">
			<h1 className="project-title">{project.title}</h1>
			<h2 className="project-description">{project.description}</h2>
		</div>
	);
};

export default ProjectPage;