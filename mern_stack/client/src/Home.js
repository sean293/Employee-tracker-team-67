import {useNavigate, Outlet} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {useAuth} from './AuthContext';


import './styles/Login.css'; // Import the custom styles
import './index.css'

const Home = () => {
	const navigate = useNavigate();
	const {user} = useAuth();

	const handleHome = () => {
		navigate('/')
	}
	const handleLogin = () => {
		navigate('/login')
	}
	const handleProjects = () => {
		navigate('/projects')
	}

	return (
		<div>
			<div className="navigation">
				<h1 id="home" onClick={handleHome}>Team 67</h1>
				<h1 id="login" onClick={user ? handleProjects : handleLogin}>{user ? user : "Login"}</h1>
				{/* <h1 id="projects" onClick={handleProjects}>{user}</h1> */}
			</div>
			<Outlet/>
		</div>
	);
};

export default Home;