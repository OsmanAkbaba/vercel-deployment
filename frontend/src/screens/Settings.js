import React, { useState, useEffect } from 'react';
import '../App.css'; 
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [limits, setLimits] = useState({
    tempMin: 0,
    tempMax: 0,
    humdMin: 0,
    humdMax: 0,
    carbonDioxideMin: 0,
    carbonDioxideMax: 0,
    airPressureMin: 0,
    airPressureMax: 0,
    lightMin: 0,
    lightMax: 0,
    lightIntensityMin: 0,
    lightIntensityMax: 0,
    
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/limits`);
        const data = await response.json();
        setLimits(data);
      } catch (error) {
        console.error('Error fetching limits:', error);
      }
    };

    fetchLimits();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLimits({ ...limits, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveLimitsToMongoDB(limits);
      alert('Limits saved successfully!');
    } catch (error) {
      console.error('Error saving limits:', error);
      alert('Failed to save limits. Please try again later.');
    }
  };

  const saveLimitsToMongoDB = async (limits) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/limits`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(limits),
      });
      if (!response.ok) {
        throw new Error('Failed to save limits');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="settings-container">
      <button1 onClick={() => navigate('/')}>Back To Home</button1>
      <h1>Settings</h1>
      <p>Set your limits here. These limits determine the minimum and maximum values for alerts shown 
        on the front page and log. They represent the acceptable range for various environmental 
        parameters within the greenhouse. If any of these values fall outside the specified range, 
        it may indicate conditions that require attention or intervention.</p>
      <form onSubmit={handleSubmit} className="settings-form">
        {Object.entries(limits).map(([key, value]) => (
          <div key={key} className="input-container">
            <label className="input-label">
              {key}:
              <input type="number" name={key} value={value} onChange={handleChange} className="input-field" />
            </label>
          </div>
        ))}
        <button type="submit" className="submit-button">Save</button>
      </form>
    </div>
  );
};

export default Settings;
