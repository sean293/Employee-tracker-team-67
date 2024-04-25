// src/projects.js

// once user is logged in, shows all projects they have access to

import {useNavigate} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {useAuth} from './AuthContext';
import axios from 'axios';
import NewProjectForm from './NewProjectForm'
import NewUserForm from './NewUserForm'

import './styles/Project.css'

export default function Projects(){
	const navigate = useNavigate();
	const {user, logout} = useAuth();
	const [projects, setProjects] = useState([]);
	const [users, setUsers] = useState([]);
	const [showFormProject, setShowFormProject] = useState(false);
	const [showFormUser, setShowFormUser] = useState(false);

	const handleNewProject = async (title, username, description, client) => {
		console.log("CLIENT:",client);
		try {
			const res = await axios.post('http://localhost:5000/newProject', {
				username: username,
				title: title,
				description: description,
				client: client
			});
			setProjects(res.data.projects);
			setShowFormProject(false);
		} catch (err) {
		}

		fetchProjects();
	};

	const handleNewUser = async (username, email, password, level) => {

		try {
			console.log("creating new user");
			const res = await axios.post('http://localhost:5000/register', {
				username,
				email,
				password,
				role: level
			});
			setShowFormUser(false);
		} catch (err) {
			console.log(err);
		}
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

	const fetchUsers = async () => {
		try {
			if (user.role!='Administrator')	{
				return;
			}
			const response = await axios.get('http://localhost:5000/getAllUser');

			// populate users
			setUsers(response.data.users);
			console.log("users found:",response.data.users);
		} catch (err) {
			console.log(err);
		}
	};

	

	const fetchProjects = async () => {

		// if user not logged in, show error
		if (!user) {
			navigate('/error');
			return;
		}

		var response = null;
		try {
			if (user.role==='Administrator')	{
				response = await axios.get('http://localhost:5000/getAllProject');
				console.log(response);
			} else {
				response = await axios.get('http://localhost:5000/getProject', {
					params: {
						username: user.username
					}
				});
			}

			// populate projects
			setProjects(response.data.projects);
			console.log("projects found:",response.data.projects);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (!user)
		{
			navigate('/error');
			return;
		}
		fetchProjects();
		fetchUsers();
	}, []); // empty array ensures this effect runs only once

	return (
		<div className='content'>
			<div className="project-grid">
			{/* maps our list of projects to buttons in the grid */}
			{projects && projects.map(project => (
				project !== null && (
					<div key={project._id} onClick={() => handleProjectClick(project)} className="project-grid-item hov">
						<p className="project-grid-text">{project.title}</p>
					</div>
				)
			))}
			</div>
			<div className="button-bar">
				<button className="logout hov" onClick={handleLogOut}>Log Out</button>
				{user && (user.role=='Manager'||user.role=='Administrator') && <button className="new-project hov" onClick={() => setShowFormProject(true)}>New Project</button>}
				{user && user.role=='Administrator' && <button className="new-user hov" onClick={() => setShowFormUser(true)}>New User</button>}
			</div>
			{showFormProject && users && <NewProjectForm handleNewProject={handleNewProject} setShowForm={setShowFormProject} users={users} />}
			{showFormUser && <NewUserForm handleNewUser={handleNewUser} setShowForm={setShowFormUser}/>}
		</div>
	);
};
