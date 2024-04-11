// src/NewProjectForm.js

// form for creating new project

import React, {useState} from 'react';

export default function NewProjectForm({handleNewUser, setShowForm}) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const [username, setUsername] = useState([]);
	const [password, setPassword] = useState([]);
	const [email, setEmail] = useState([]);

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log("submitted");

		handleNewUser(username, email, password);
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

	const options = [
		{ value: 'Employee', label: 'Employee' },
		{ value: 'Manager', label: 'Manager' },
		{ value: 'Administrator', label: 'Administrator' },
	];


	return (
		<div className='form-background' onClick={handleBackgroundClick}>
			<form onSubmit={handleSubmit} >
				<input
					className="username"
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<input
					className="email"
					type="text"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					className="password"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<select className="select-user" required>
					{options.map((option, index) => (
						<option key={index} value={option.value}>{option.label}</option>
					))}
				</select>
				<button type="submit" className="submit">Submit</button>
			</form>
		</div>
	)
};
