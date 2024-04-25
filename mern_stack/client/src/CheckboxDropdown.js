// src/CheckboxDropdown.js

// a custom selection with checkboxs added

import React, { useState, useEffect } from 'react';
import './styles/CheckboxDropdown.css'

function CheckboxDropdown({ users, selected, onSelectionChange }) {
const [selectedOptions, setSelectedOptions] = useState([]);

const handleCheckboxChange = (event) => {
	const value = event.target.value;
	if (event.target.checked) {
		onSelectionChange([...selectedOptions, value]);
		// setSelectedOptions([...selectedOptions, value]);
	} else {
		onSelectionChange(selectedOptions.filter(option => option !== value));
		// setSelectedOptions(selectedOptions.filter(option => option !== value));
	}
};

function toggleDropdown() {
	var dropdownContent = document.querySelector('.dropdown-content');
	dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
  }

const handleButtonClick = (e) => {
	e.preventDefault();
	toggleDropdown();
};

  useEffect(() => {
	setSelectedOptions(selected);
}, [selected]);

return (
	<div className="dropdown">
	<button className="dropdown-toggle text_input" onClick={handleButtonClick}>{selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select Employees'}</button>
	<div className="dropdown-content">
		{users.map((user, index) => (
		<label key={index}>
			<input
			className="dropdown-checkbox"
			type="checkbox"
			value={user.username}
			onChange={handleCheckboxChange}
			checked={selectedOptions.includes(user.username)}
			/>
			{user.username}
		</label>
		))}
	</div>
	</div>
);
}

export default CheckboxDropdown;