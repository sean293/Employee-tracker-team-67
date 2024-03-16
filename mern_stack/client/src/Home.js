import {useNavigate, Outlet} from 'react-router-dom';

import './styles/Login.css'; // Import the custom styles
import './index.css'

export default function Home(){
	const navigate = useNavigate();

	const handleHome = () => {
		navigate('/')
	}
	const handleLogin = () => {
		navigate('/login')
	}

	return (
		<div>
			<div className="navigation">
				<h1 id="home" onClick={handleHome}>Team 67</h1>
				<h1 id="login" onClick={handleLogin}>Login</h1>
			</div>
			<Outlet/>
		</div>
	);
}