import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './fonts.css'

import Home from './Home';
import Login from './Login';
import Projects from './Projects';
import ErrorPage from './error-page';
import Register from './Register'

import {AuthProvider} from './AuthContext'

import reportWebVitals from './reportWebVitals';

import {createBrowserRouter, RouterProvider} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/login',
				element: <Login />,
			},
			{
				path: '/projects',
				element: <Projects />
			},
			{
				path: '/register',
				element: <Register />,
			},
		]
	}
]);

root.render(
	<React.StrictMode>
	  <AuthProvider>
		<RouterProvider router={router} />
	</AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
