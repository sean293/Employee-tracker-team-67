import React, { useState } from 'react';
import Select from 'react-select';

const options = [
  { value: 'Manager', label: 'Manager' },
  { value: 'Administrator', label: 'Administrator' },
  { value: 'Employee', label: 'Employee' },
];

const MultiSelectDropdown = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selectedValues) => {
    setSelectedOptions(selectedValues);
  };

  return (
    <Select
      options={options}
      isMulti
      value={selectedOptions}
      onChange={handleChange}
    />
  );
};

export default MultiSelectDropdown;