// src/projects.js

// once user is logged in, shows 

import {useNavigate} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {useAuth} from './AuthContext';
import axios from 'axios';

import './styles/Project.css'

export default function Projects(){
	const navigate = useNavigate();
	const {user, logout} = useAuth();
	const [projects, setProjects] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');

	const handleLogOut = () => {
		// verify login info
		logout();
		navigate('/');
	};

	const handleProjectClick = (project) => {
		// verify login info
		navigate(`/projects/${project.title}`);
	};

	const handleNewProject = async (e) => {

		// verify login info
		e.preventDefault();

		const title = user;
		const description = "description";

		try {
			const res = await axios.post('http://localhost:5000/newProject', {
				username: user,
				title: title,
				description: description
			});
			setErrorMessage("NEW PROJECT CREATED: "+title);
			setProjects(res.data.projects);
		} catch (err) {
			setErrorMessage("ERROR: "+err.data.msg);
		}
	};

	useEffect(() => {
		const fetchProjects = async () => {

			// if user not logged in, show error
			if (!user) {
				navigate('/error');
				return;
			}

			try {
				const response = await axios.get('http://localhost:5000/getProject', {
					params: {
						username: user
					}
				});

				if (!response.data.success) {
					setErrorMessage('Failed to fetch projects');
				}
				else
				{
					setErrorMessage("user "+user);
				}

				// populate projects
				setProjects(response.data.projects);
				console.log("projects found:",response.data.projects);
			} catch (err) {
				setErrorMessage('Error fetching projects:', err);
			}
		};

		fetchProjects();
	}, []); // empty array ensures this effect runs only once

	return (
		<div className='content'>
			<div className="project-grid">
			{/* maps our list of projects to buttons in the grid */}
			{projects && projects.map(project => (
				<div key={project._id} onClick={() => handleProjectClick(project)} className="project-grid-item">
					<p className="project-grid-text">{project.title}</p>
				</div>
			))}
			</div>
			<div className="button-bar">
				<button className="logout" onClick={handleLogOut}>Log Out</button>
				<button className="newProject" onClick={handleNewProject}>New Project</button>
				{errorMessage && <p className="error-message">{errorMessage}</p>}
			</div>
		</div>
	);
};