// index.js

// the main layout of the website

import React, {useHistory} from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './fonts.css'

import Report from './Report';
import Home from './Home';
import Login from './Login';
import Projects from './Projects';
import ErrorPage, {Error} from './ErrorPage';
import Register from './Register'
import {AuthProvider} from './AuthContext'
import ProjectPage from './ProjectPage'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import TimeRequests from './TimeRequests' 

const root = ReactDOM.createRoot(document.getElementById('root'));

// creates our page hierarchy
const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
		errorElement: <ErrorPage />, // this is where we are sent if a page that doesn't exist is reached
		children: [
			{
				path: '/login',
				element: <Login />,
				errorElement: <ErrorPage />, // this is where we are sent if a page that doesn't exist is reached
			},
			{
				path: '/projects',
				element: <Projects/>,
				errorElement: <ErrorPage />, // this is where we are sent if a page that doesn't exist is reached
			},
			{
				path: '/projects/:projectName',
				element: <ProjectPage/>,
				errorElement: <ErrorPage />, // this is where we are sent if a page that doesn't exist is reached
			},
			{
				path: '/register',
				element: <Register />,
				errorElement: <ErrorPage />, // this is where we are sent if a page that doesn't exist is reached
			},
			{
				path: '/reports',
				element: <Report />,
			},
			{
				path: '/reports/:selection',
				element: <Report />,
			},
			{
				path: '/time-requests',
				element: <TimeRequests />,
			},
			{
				path: '/error',
				element: <Error />
			},
		]
	},
]);

root.render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
			
		</AuthProvider>
	</React.StrictMode>
);