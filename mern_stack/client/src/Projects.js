import {useNavigate} from 'react-router-dom';

import './styles/Project.css'

export default function Projects(){
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
		</div>
	);
}