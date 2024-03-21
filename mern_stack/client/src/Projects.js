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
	const [showForm, setShowForm] = useState(false);

	function ProjectForm({handleNewProject}) {
		const [title, setTitle] = useState('');
		const [description, setDescription] = useState('');
	
		const handleSubmit = (e) => {
			e.preventDefault();
			handleNewProject(title, description);
			setTitle('');
			setDescription('');
		};
	
		const handleBackgroundClick = (e) => {
			// Close the form if background is clicked
			if (e.target === e.currentTarget)
			{
				setShowForm(false);
			}
		};
	
	
		return (
			<div className='form-background' onClick={handleBackgroundClick}>
				<form onSubmit={handleSubmit} >
					<input
						className="title"
						type="text"
						placeholder="Enter Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
					<textarea rows='5' cols='50'
						className="description"
						type="text"
						placeholder="Enter Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
					{/* <input
						className="description"
						type="text"
						placeholder="Enter Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/> */}
					<button type="submit" className="submit-project">Submit</button>
				</form>
			</div>
		)
	};

	const handleNewProject = async (title, description) => {

		// verify login info
		// e.preventDefault();

		try {
			const res = await axios.post('http://localhost:5000/newProject', {
				username: user,
				title: title,
				description: description
			});
			setErrorMessage("NEW PROJECT CREATED: "+title);
			setProjects(res.data.projects);
		} catch (err) {
			setErrorMessage("ERROR: "+err);
		}

		fetchProjects();
	};

	const handleLogOut = () => {
		// verify login info
		logout();
		navigate('/');
	};

	const handleProjectClick = (project) => {
		// verify login info
		navigate(`/projects/${project.title}`);
	};

	

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

	useEffect(() => {
		fetchProjects();
	}, []); // empty array ensures this effect runs only once

	return (
		<div className='content'>
			<div className="project-grid">
			{/* maps our list of projects to buttons in the grid */}
			{projects && projects.map(project => (
				project !== null && (
					<div key={project._id} onClick={() => handleProjectClick(project)} className="project-grid-item">
						<p className="project-grid-text">{project.title}</p>
					</div>
				)
			))}
			</div>
			<div className="button-bar">
				<button className="logout" onClick={handleLogOut}>Log Out</button>
				{errorMessage && <p className="error-message">{errorMessage}</p>}
				<button className="newProject" onClick={() => setShowForm(true)}>New Project</button>
				{showForm && <ProjectForm handleNewProject={handleNewProject} />}
			</div>
		</div>
	);
};
