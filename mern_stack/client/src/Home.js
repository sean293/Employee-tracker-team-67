// src/Home.js

// our main navigation bar at the top

import {useNavigate, Outlet} from 'react-router-dom';
import {useAuth} from './AuthContext';
import axios from 'axios';


import './styles/Login.css'; // Import the custom styles
import './styles/index.css'

function refreshPage(){ 
	//Refreshes page (intended to mask desynch issues and data not popping up)
    window.location.reload(); 
}

const Home = () => {
	const navigate = useNavigate();
	const {user} = useAuth();

	const handleHome = () => {
		navigate('/');
	}
	const handleProfile = async () => {
		console.log("ROLE:",user.role);
		if (user.role === "Administrator")
		{
			navigate(`/reports`);
		}
		if (user.role === "Manager")
		{
			const response = await axios.get('http://localhost:5000/getProjectFromManager', {
				params: {
					id: user._id
				}
			});
			navigate(`/reports/${response.data.project.title}`);
		}
		if (user.role === "Employee")
		{
			navigate(`/reports/${user.username}`);
		}
		// refreshPage();
	}
	const handleLogin = () => {
		navigate('/login');
		refreshPage();
	}
	const handleBack = () => {
		window.history.back();

	}
	const handleProjects = () => {
		navigate('/projects');
		refreshPage();
	}

	return (
		<div>
			<div className="navigation">
				<h1 className="navbar-text " id="back" onClick={handleBack}>&larr;</h1>
				<h1 className="navbar-text" id="home" onClick={handleProjects}>ClockIn Hub</h1>
				<h1 className="navbar-text" id="login" onClick={user ? handleProfile : handleLogin}>{user ? user.username : "Login"}</h1>
			</div>
			<div className="content">
				<Outlet/>
			</div>
		</div>
	);
};

export default Home;