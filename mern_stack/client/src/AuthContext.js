// src/AuthContext.js

// creates a global user we can check permissions of

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const authData = localStorage.getItem('user');
		return authData ? JSON.parse(authData) : null;
	  });

useEffect(() => {
	if (user) {
	localStorage.setItem('user', JSON.stringify(user));
	} else {
	localStorage.removeItem('user');
	}
}, [user]);

const login = async (username, password) => {
	let response=null;
	try {
	response = await axios.post('http://localhost:5000/login', { username, password });
	const userData = response.data.user;
	setUser(userData);
	return response;
} catch (error) {
	console.error('Error logging in:', error);
	return response;
}
};

const logout = () => {
	setUser(null);
	localStorage.removeItem('user');
};

return (
	<AuthContext.Provider value={{ user, login, logout }}>
	{children}
	</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);