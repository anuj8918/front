import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

const App = () => {
  const [jsonInput, setJsonInput] = useState(""); // Input JSON state
  const [error, setError] = useState(""); // Error message
  const [response, setResponse] = useState(null); // Backend response state
  const [filter, setFilter] = useState([]); // Filter selection state

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
  ];

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedInput = JSON.parse(jsonInput); // Validate JSON
      const { data, file_b64 } = parsedInput;
      if (!Array.isArray(data)) {
        throw new Error("Invalid JSON format: 'data' must be an array.");
      }

      // Make POST request to backend
      const response = await axios.post("/bfhl", parsedInput);
      setResponse(response.data);
      setError("");
    } catch (err) {
      setError("Invalid JSON or server error. Please check your input.");
      setResponse(null);
    }
  };

  // Filter the response data based on selected options
  const filteredResponse = filter.reduce((acc, key) => {
    if (response && response[key]) acc[key] = response[key];
    return acc;
  }, {});

  // Handle dropdown change
  const handleDropdownChange = (selectedOptions) => {
    setFilter(selectedOptions.map((option) => option.value));
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Bajaj Finserv Health Challenge</h1>
      
      {/* Input Form */}
      <div style={{ marginBottom: "20px" }}>
        <textarea
          placeholder='Enter JSON (e.g., {"data": ["M", "1", "334"]})'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          style={{
            width: "100%",
            height: "100px",
            marginBottom: "10px",
            padding: "10px",
            fontSize: "14px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>

      {/* Dropdown and Filter */}
      {response && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <Select
              options={options}
              isMulti
              onChange={handleDropdownChange}
              placeholder="Select what to display..."
            />
          </div>

          {/* Display Filtered Response */}
          <div
            style={{
              backgroundColor: "#f4f4f4",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <h2>Filtered Response</h2>
            <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
