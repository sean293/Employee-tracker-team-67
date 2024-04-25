// src/NewProjectForm.js

// form for creating new project

import React, {useState} from 'react';

export default function NewProjectForm({handleNewProject, setShowForm, users}) {
	const [title, setTitle] = useState('');
	const [client, setClient] = useState('');
	const [description, setDescription] = useState('');


	const handleSubmit = (e) => {
		e.preventDefault();

		handleNewProject(title, document.getElementById("select-user").value, description, client);
		setTitle('');
		setDescription('');
		setClient('');
		setShowForm(false);
	};

	const handleBackgroundClick = (e) => {
		// Close the form if background is clicked
		if (e.target === e.currentTarget)
		{
			setShowForm(false);
		}
	};

	const options = users.map(user => ({
		value: user.username,
		label: user.username
	}));


	return (
		<div className='form-background' onClick={handleBackgroundClick}>
			<form onSubmit={handleSubmit} >
				<input
					className="title text_input"
					type="text"
					placeholder="Enter Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>

				<input
					className="client text_input"
					type="text"
					placeholder="Enter Client"
					value={client}
					onChange={(e) => setClient(e.target.value)}
					required
				/>
				<select id="select-user" className="select-user" required>
					{options.map((option, index) => (
						<option key={index} value={option.value}>{option.label}</option>
					))}
				</select>
				<textarea rows='5' cols='50'
					className="description text_input"
					type="text"
					placeholder="Enter Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					required
				/>
				<button type="submit" className="submit-project hov">Submit</button>
			</form>
		</div>
	)
};
