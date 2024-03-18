import {useNavigate} from 'react-router-dom';
import React from 'react';
import {useAuth} from './AuthContext';

import './styles/Project.css'

export default function Projects(){
	const navigate = useNavigate();
	const {logout} = useAuth();

	const handleLogOut = () => {
		// verify login info
		logout();
		navigate('/');
	}

	return (
		<div>
			<div class="project-grid">
				<button class="project-grid-item">Project 1</button>
				<button class="project-grid-item">Project 2</button>
				<button class="project-grid-item">Project 3</button>
				<button class="project-grid-item">Project 4</button>
				<button class="project-grid-item">Project 5</button>
				<button class="project-grid-item">Project 6</button>
				<button class="project-grid-item">Project 7</button>
				<button class="project-grid-item">Project 8</button>
				<button class="project-grid-item">Project 9</button>
			</div>
			<button class="logout" onClick={handleLogOut}>Log Out</button>
		</div>
	);
}