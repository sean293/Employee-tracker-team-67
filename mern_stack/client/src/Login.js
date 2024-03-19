// src/Login.js

// login page that queries database

import {useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import {useAuth} from './AuthContext'

import './styles/Login.css';
import './styles/index.css'

export default function Login(){
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: '',
		password: ''
	});

	const {username, password} = formData;
	const [errorMessage, setErrorMessage] = useState('');

	const handleChange = (e) => {
		setFormData({...formData, [e.target.name]: e.target.value});
	};

	const {login} = useAuth();
	const handleLogin = async (e) => {
		
		e.preventDefault();

		if (!username || !password){
			setErrorMessage('Please fill in all fields.');
			return;
		}

		try {
			const res = await axios.post('http://localhost:5000/login', {
				username,
				password
			});
			login(username);
			navigate('/projects');
		} catch (err) {
			setErrorMessage("ERROR: ");
		}
	};

	const handleRegister = async () => {
		navigate('/register');
	};

	return (
		<div>
			<div className="login-form">
				<input type="text" placeholder="Username" name="username" value={username} onChange={handleChange} required/>
				<input type="password" placeholder="Password" name="password" value={password} onChange={handleChange} required/>
				<button id="login-button" onClick={handleLogin} type="submit">Login</button>
				<button id="register-button" onClick={handleRegister} type="submit">Register</button>
			</div>
			{errorMessage && <p type="message">{errorMessage}</p>}
		</div>
	);
};
