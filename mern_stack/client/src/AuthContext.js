import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => {
	const authData = localStorage.getItem('user');
  	return authData ? JSON.parse(authData) : null;
});

useEffect(() => {
	setUser(user);
	localStorage.setItem('user', JSON.stringify(user));
}, [user]);

const login = (user) => {
    setUser(user);
    //localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
  };

const logout = () => {
	setUser(null);
	localStorage.clear(); // Remove user data from localStorage
	// localStorage.removeItem('token'); // Remove user data from localStorage
};

return (
	<AuthContext.Provider value={{ user, login, logout }}>
		{children}
	</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);