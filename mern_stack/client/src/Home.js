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
	const handleProjects = () => {
		navigate('/projects')
	}

	return (
		<div>
			<div className="navigation">
				<h1 id="home" onClick={handleHome}>Team 67</h1>
				<h1 id="login" onClick={user ? handleProjects : handleLogin}>{user ? user : "Login"}</h1>
			</div>
			<Outlet/>
		</div>
	);
};

export default Home;