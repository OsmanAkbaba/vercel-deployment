import React, { useState, useEffect } from 'react';
import '../App.css'; 
import { Line } from 'react-chartjs-2';
import { Chart } from "chart.js/auto";
import { useNavigate } from 'react-router-dom';



const Forecast = () => {

  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };
  const [forecastData, setForecastData] = useState(null);
  
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const response = await fetch(`${serverUrl}/forecast`);
        const data = await response.json();
        setForecastData(data);
      } catch (error) {
        console.error('Error fetching weather forecast:', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}. ${hours}:${minutes}`;
  };

  const chartData = {
    labels: forecastData?.list?.map(item => formatDate(item.dt_txt)) || [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: forecastData?.list?.map(item => item.main.temp) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Humidity (%)',
        data: forecastData?.list?.map(item => item.main.humidity) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Pressure (hPa)',
        data: forecastData?.list?.map(item => item.main.pressure) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        // Voit määrittää min ja max tarpeen mukaan
      }
    }
  };

  return (
    <div className="forecast-container">
      <button className="info-button" onClick={toggleInfo}>
        Info
      </button>
      {/* Info Modal */}
      {isInfoVisible && (
        <div className="info-modal">
          <div className="info-content">
            <span className="close" onClick={toggleInfo}>&times;</span>
            <div className="info-text">  
              <p>In this page you are able to seek real-time forecast</p>
            </div>
          </div>
        </div>
      )}
      <button1 onClick={() => navigate('/')}>Back To Home</button1>
      <h2 className="forecast-heading">Weather Forecast</h2>
      {forecastData ? (
        <div>
          {forecastData.city ? (
            <div>
              <p className="forecast-city">City: {forecastData.city.name}</p>
              <p className="forecast-country">Country: {forecastData.city.country}</p>
            </div>
          ) : (
            <p>City information not available</p>
          )}
          <h3 className="forecast-subheading">Forecast:</h3>
          <div className="forecast-table-wrapper">
            <table className="forecast-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Temperature (°C)</th>
                  <th>Humidity (%)</th>
                  <th>Pressure (hPa)</th>
                  <th>Weather</th>
                </tr>
              </thead>
              <tbody className="forecast-table-body">
                {forecastData.list && forecastData.list.map((item, index) => (
                  <tr key={index} className="forecast-item">
                    <td>{formatDate(item.dt_txt)}</td>
                    <td>{item.main.temp} °C</td>
                    <td>{item.main.humidity}%</td>
                    <td>{item.main.pressure} hPa</td>
                    <td>{item.weather[0].description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="forecast-subheading">Weather forecast chart:</h3>
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
  
};

export default Forecast;

