import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [token, setToken] = useState(null);

const login = (userData,  token) => {
	setUser(userData);
	setToken(token);
	localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
	localStorage.setItem('token', JSON.stringify(token)); // Store user data in localStorage
};

const logout = () => {
	setUser(null);
	localStorage.removeItem('user'); // Remove user data from localStorage
	localStorage.removeItem('token'); // Remove user data from localStorage
};

return (
	<AuthContext.Provider value={{ user, token, login, logout }}>
	{children}
	</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);