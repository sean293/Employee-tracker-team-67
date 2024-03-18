import {useNavigate } from 'react-router-dom';
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
			//setProjects(res.data.projects);
		} catch (err) {
			setErrorMessage("ERROR: "+err.data.msg);
		}
	};

	useEffect(() => {
		const fetchProjects = async () => {
		try {
			const response = await axios.get('http://localhost:5000/getProjects', {
				params: {
					username: user
				}
			}); // Assuming endpoint to fetch projects
			if (!response.data.success) {
				setErrorMessage('Failed to fetch projects');
			}
			else
			{
				setErrorMessage("user "+user);
			}
			setProjects(response.data.projects);
		} catch (err) {
			setErrorMessage('Error fetching projects:', err);
		}
		};

		fetchProjects();
	}, []); // Empty dependency array ensures this effect runs only once

	return (
		<div>
			<div className="project-grid">
			{projects.map(project => (
				<button className="project-grid-item" key={project._id}>
					{project.title}
				</button>
        	))}
			</div>
			<button className="logout" onClick={handleLogOut}>Log Out</button>
			<button className="newProject" onClick={handleNewProject}>New Project</button>
			{errorMessage && <p type="message">{errorMessage}</p>}
		</div>
	);
};