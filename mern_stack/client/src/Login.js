import {useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

import './styles/Login.css'; // Import the custom styles
import './index.css'

export default function Login(){
	const navigate = useNavigate();


	const handleLogin = () => {
		// verify login info
		navigate('/app')
	}
	const handleRegister = () => {
		// verify login info
		navigate('/app')
	}

	return (
		<div>
			<div className="login-form">
				<input type="text" placeholder="Username or Email"/>
				<input type="password" placeholder="Password"/>
				<button id="login-button" onClick={handleLogin} type="submit">Login</button>
				<button id="register-button" onClick={handleRegister} type="submit">Register</button>
			</div>
		</div>
	);
}