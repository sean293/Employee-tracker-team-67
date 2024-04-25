// src/NewProjectForm.js

// form for creating new project

import React, {useState} from 'react';

export default function NewProjectForm({handleNewUser, setShowForm}) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const [username, setUsername] = useState([]);
	const [password, setPassword] = useState([]);
	const [email, setEmail] = useState([]);
	const [level, setLevel] = useState('Employee');

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log("submitted");

		handleNewUser(username, email, password, level);
		setTitle('');
		setDescription('');
	};

	const handleBackgroundClick = (e) => {
		// close the form if background is clicked
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
					className="username text_input"
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<input
					className="email text_input"
					type="text"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					className="password text_input"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				<select
					className="select-user text_input" 
					onChange={(e) => setLevel(e.target.value)}
					value={level}
					required>

					{options.map((option, index) => (
						<option key={index} value={option.value}>{option.label}</option>
					))}
				</select>
				<button type="submit" className="submit-project hov">Submit</button>
			</form>
		</div>
	)
};
