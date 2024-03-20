// src/Home.js

// our main navigation bar at the top

import {useNavigate, Outlet} from 'react-router-dom';
import {useAuth} from './AuthContext';


import './styles/Login.css'; // Import the custom styles
import './styles/index.css'

const Home = () => {
	const navigate = useNavigate();
	const {user} = useAuth();

	const handleHome = () => {
		navigate('/')
	}
	const handleLogin = () => {
		navigate('/login')
	}
	const handleBack = () => {
		window.history.back();
	}
	const handleProjects = () => {
		navigate('/projects')
	}

	return (
		<div>
			<div className="navigation">
				<h1 className="navbar-text" id="back" onClick={handleBack}>&larr;</h1>
				<h1 className="navbar-text" id="home" onClick={handleHome}>Team 67</h1>
				<h1 className="navbar-text" id="login" onClick={user ? handleProjects : handleLogin}>{user ? user : "Login"}</h1>
			</div>
			<div className="content">
				<Outlet/>
			</div>
		</div>
	);
};

export default Home;