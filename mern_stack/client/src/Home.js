// src/Home.js

// our main navigation bar at the top

import {useNavigate, Outlet} from 'react-router-dom';
import {useAuth} from './AuthContext';


import './styles/Login.css'; // Import the custom styles
import './styles/index.css'

function refreshPage(){ 
    window.location.reload(); 
}

const Home = () => {
	const navigate = useNavigate();
	const {user} = useAuth();

	const handleHome = () => {
		navigate('/');
	}
	const handleProfile = () => {
		navigate(`/reports/${user.username}`);
		refreshPage();
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
				<h1 className="navbar-text" id="back" onClick={handleBack}>&larr;</h1>
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