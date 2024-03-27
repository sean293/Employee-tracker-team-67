// src/Login.js

// login page that queries database

import {useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {useAuth} from './AuthContext'

import './styles/Login.css';
import './styles/index.css'

export default function Login(){
	const navigate = useNavigate();

	const [username, setUsername] = useState([]);
	const [password, setPassword] = useState([]);

	const {user, login} = useAuth();
	
	const handleLogin = async (username, password) => {
		try {
			const res=await login(username, password);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (user) {
			navigate('/projects');
		}
	}, [user]);

	const handleRegister = async () => {
		navigate('/register');
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleLogin(username, password);
	};

	return (
		<div>
			<form onSubmit={handleSubmit} >
				<input
					className="username"
					type="text"
					placeholder="Username or Email"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
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
				<button type="submit" className="submit">Submit</button>
			</form>
		</div>
	);
};
