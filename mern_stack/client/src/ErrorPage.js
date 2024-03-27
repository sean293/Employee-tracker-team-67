// src/ErrorPage.js

// changes our page to /error if unknown page is reached

import { useNavigate } from "react-router-dom";
import React, { useEffect} from 'react';

import './styles/index.css';

export function Error() {
	console.log("error page loaded");

	return (
		<div>
			<p className="error-page">Page not found.</p>
		</div>
	);
};


const ErrorPage = () => {
	const navigate = useNavigate();

	// redirects us to the actual /error page
	useEffect(() => {
		navigate('/error');
	}, []);
	
};

export default ErrorPage;