// src/EditProjectForm.js

// form for creating new project

import React, {useState, useEffect} from 'react';
import CheckboxDropdown from './CheckboxDropdown';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

export default function EditProjectForm({project, setShowForm}) {
	const [title, setTitle] = useState('');
	const [users, setUsers] = useState([]);
	const [projectUsers, setProjectUsers] = useState([]);
	const [description, setDescription] = useState('');
	const navigate = useNavigate();


	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("SUBMITTING??????????");
		try {
			const res = await axios.post('http://localhost:5000/editProject', {
					usernames: projectUsers,
					title: title,
					description: description,
					project: project
				});
				console.log(res);

		} catch(err) {
			console.log(err);
		}
		setShowForm(false);
		navigate(`/projects/${title}`);
		window.location.reload();
	};

	const handleBackgroundClick = (e) => {
		// Close the form if background is clicked
		if (e.target === e.currentTarget)
		{
			setShowForm(false);
		}
	};

	const handleSelectionChange = (selectedOptions) => {
		setProjectUsers(selectedOptions);
	};

	const fetchUsers = async () => {
		try {
			let response = await axios.get('http://localhost:5000/getAllUser');

			// populate users
			setUsers(response.data.users);

			response = await axios.get('http://localhost:5000/getProjectUsers', {
				params: {
					project: project
				}
			});
			setProjectUsers(response.data.usernames);
			console.log("project users: ",response.data.usernames);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		setTitle(project.title);
		setDescription(project.description);
		fetchUsers();
	}, []);


	return (
		<div className='form-background' onClick={handleBackgroundClick}>
			<form onSubmit={handleSubmit}>
				<input
					className="title"
					type="text"
					placeholder={title}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
				<CheckboxDropdown users={users} selected={projectUsers} onSelectionChange={handleSelectionChange} />
				<textarea rows='5' cols='50'
					className="description"
					type="text"
					placeholder={description}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					required
				/>
				<button type="submit" className="submit-project">Submit</button>
			</form>
		</div>
	)
};
