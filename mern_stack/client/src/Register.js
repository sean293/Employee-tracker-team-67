// src/Register.js

// register page which adds new user to database

import {useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

import './styles/Login.css'; // Import the custom styles
import './styles/index.css'

export default function Register(){
	const navigate = useNavigate();

	const [username, setUsername] = useState([]);
	const [password, setPassword] = useState([]);
	const [email, setEmail] = useState([]);

	const handleRegister = async (username, email, password) => {

		try {
			// backend call that makes the new user
			const res = await axios.post('http://localhost:5000/register', {
				username,
				email,
				password
			});

			navigate('/login');
		} catch (err) {
			console.log(err);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleRegister(username, email, password);
	};

	return (
		<div>
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
				<button type="submit" className="submit-project hov">Submit</button>
			</form>
		</div>
	);
}