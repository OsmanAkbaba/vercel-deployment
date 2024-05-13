import React, { useState, useEffect } from 'react';
import '../App.css';
import { Line } from 'react-chartjs-2';
import { Chart } from "chart.js/auto";
import { useNavigate } from 'react-router-dom';

const Charts = () => {
  const [showInsideTemp, setShowInsideTemp] = useState(false);
  const [showInsideHumidity, setShowInsideHumidity] = useState(false);
  const [showInsideAirPressure, setShowInsideAirPressure] = useState(false);
  const [showLight, setShowLight] = useState(false);
  const [showCO2, setShowCO2] = useState(false);
  const [showLightIntensity, setShowLightIntensity] = useState(false);
  const [showOutsideTemp, setShowOutsideTemp] = useState(false);
  const [showOutsideHumidity, setShowOutsideHumidity] = useState(false);
  const [showOutsideAirPressure, setShowOutsideAirPressure] = useState(false);
  const [showUVI, setShowUVI] = useState(false);

  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };


  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sensor data from backend API
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        //const serverPort = process.env.REACT_APP_SERVER_PORT;
        const response = await fetch(
          `${serverUrl}/get20data`);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  const [weatherChartData, setWeatherChartData] = useState(null);
  useEffect(() => {
    const fetchWeatherChartData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/weather`);
        const data = await response.json();
        setWeatherChartData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherChartData();
  }, []);



  const options = {
    scales: {
      x: {
        reverse: true,
      }
    }
  };

  return (
    <div>
      <button1 onClick={() => navigate('/')}>Back To Home</button1>
      <h1>Greenhouse</h1>  

      <button className="info-button" onClick={toggleInfo}>
        Info
      </button>
       {/* Info Modal */}
       {isInfoVisible && (
        <div className="info-modal">
          <div className="info-content">
          <span className="close" onClick={toggleInfo}>&times;</span>
          <div className="info-text">  

          <p> Webapp is made by students of Oulu University of Applied Sciences.<br></br>This is company-oriented project made with company called Haltian. <br></br> 
           We made a web application that measures different values from sensors that Haltian provided. <br></br> 
           You can browse collected data from pages, that are found in the navigation bar. <br></br>

           </p>


                </div>
              </div>
            </div>
          )}

      <button onClick={() => setShowInsideTemp(!showInsideTemp)}>
        {showInsideTemp ? 'Hide Inside Temp Chart' : 'Show Inside Temp Chart'}
      </button>
      {showInsideTemp && chartData?.temp && (
        <div className="chart-container">
          <Line
            data={{
              labels: chartData.temp.map(entry => entry.timestamp),
              datasets: [{ label: 'Inside Temp', data: chartData.temp.map(entry => entry.value) }],
            }}
            options={options}
          /> 
        </div>
      )}
      
      <button onClick={() => setShowInsideHumidity(!showInsideHumidity)}>
        {showInsideHumidity ? 'Hide Inside Humidity Chart' : 'Show Inside Humidity Chart'}
      </button>
      {showInsideHumidity && chartData?.humd && (
        <div className="chart-container">
          <Line
            data={{
              labels: chartData.humd.map(entry => entry.timestamp),
              datasets: [{ label: 'Inside Humidity', data: chartData.humd.map(entry => entry.value) }],
            }}
            options={options}
          /> 
        </div>
      )}

      <button onClick={() => setShowInsideAirPressure(!showInsideAirPressure)}>
        {showInsideAirPressure ? 'Hide Inside Air Pressure Chart' : 'Show Inside Air Pressure Chart'}
      </button>
      {showInsideAirPressure && chartData?.airp && (
        <div className="chart-container">
          <Line
            data={{
              labels: chartData.airp.map(entry => entry.timestamp),
              datasets: [{ label: 'Inside Air Pressure', data: chartData.airp.map(entry => entry.value) }],
            }}
            options={options}
          /> 
        </div>
      )}

      <button onClick={() => setShowLight(!showLight)}>
        {showLight ? 'Hide Light Chart' : 'Show Light Chart'}
      </button>
      {showLight && chartData?.lght && (
        <div className="chart-container">
          <Line
            data={{
              labels: chartData.lght.map(entry => entry.timestamp),
              datasets: [{ label: 'Light', data: chartData.lght.map(entry => entry.value) }],
            }}
            options={options}
          /> 
        </div>
      )}

      <button onClick={() => setShowLightIntensity(!showLightIntensity)}>
        {showLightIntensity ? 'Hide Light Intensity Chart' : 'Show Light Intensity Chart'}
      </button>
      {showLightIntensity && chartData?.lghtint && (
        <div className="chart-container">
          <Line
            data={{
              labels: chartData.lghtint.map(entry => entry.timestamp),
              datasets: [{ label: 'Light Intensity', data: chartData.lghtint.map(entry => entry.value) }],
            }}
            options={options}
          /> 
        </div>
      )}

      <button onClick={() => setShowCO2(!showCO2)}>
        {showCO2 ? 'Hide CO2 Chart' : 'Show CO2 Chart'}
      </button>
      {showCO2 && chartData?.carbonDioxide && (
        <div className="chart-container">
          <Line
            data={{
              labels: chartData.carbonDioxide.map(entry => entry.timestamp),
              datasets: [{ label: 'CO2', data: chartData.carbonDioxide.map(entry => entry.value) }],
            }}
            options={options}
          />  
        </div>
      )}
    
      <h2>Outside data:</h2>

      <button onClick={() => setShowOutsideTemp(!showOutsideTemp)}>
        {showOutsideTemp ? 'Hide Outside Temp Chart' : 'Show Outside Temp Chart'}
      </button>
      {showOutsideTemp && (
        <div className="chart-container">
          <Line
            data={{
              labels: weatherChartData?.forecast.forecastday.slice(0, 2).flatMap(day => day.hour.map(entry => entry.time)),
              datasets: [
                { label: 'Outside Temp', 
                  data: weatherChartData?.forecast.forecastday.slice(0, 2).flatMap(day => day.hour.map(entry => entry.temp_c)) }
              ],
            }}
          /> 
        </div>
      )}
      <button onClick={() => setShowOutsideHumidity(!showOutsideHumidity)}>
        {showOutsideHumidity ? 'Hide Outside Humidity Chart' : 'Show Outside Humidity Chart'}
      </button>
      {showOutsideHumidity && (
        <div className="chart-container">
          <Line
            data={{
              labels: weatherChartData?.forecast.forecastday.slice(0, 2).flatMap(day => day.hour.map(entry => entry.time)),
              datasets: [
                { label: 'Outside Humidity', 
                  data: weatherChartData?.forecast.forecastday.slice(0, 2).flatMap(day => day.hour.map(entry => entry.humidity)) }
              ],
            }}
          /> 
        </div>
      )}

      <button onClick={() => setShowOutsideAirPressure(!showOutsideAirPressure)}>
        {showOutsideAirPressure ? 'Hide Outside Air Pressure Chart' : 'Show Outside Air Pressure Chart'}
      </button>
      {showOutsideAirPressure && (
        <div className="chart-container">
          <Line
            data={{
              labels: weatherChartData?.forecast.forecastday.slice(0, 2).flatMap(day => day.hour.map(entry => entry.time)),
              datasets: [
                { label: 'Outside Air Pressure', 
                  data: weatherChartData?.forecast.forecastday.slice(0, 2).flatMap(day => day.hour.map(entry => entry.pressure_mb)) }
              ],
            }}
          /> 
        </div>
      )}

      <button onClick={() => setShowUVI(!showUVI)}>
        {showUVI ? 'Hide UVI Chart' : 'Show UVI Chart'}
      </button>
      {showUVI && (
        <div className="chart-container">
          <Line
            data={{
              labels: weatherChartData?.forecast.forecastday.slice(0, 2).flatMap(day => day.hour.map(entry => entry.time)),
              datasets: [
                { label: 'UVI', 
                  data: weatherChartData?.forecast.forecastday.slice(0, 2).flatMap(day => day.hour.map(entry => entry.uv)) }
              ],
            }}
          /> 
        </div>
      )}


    </div>
  );
};

export default Charts;
