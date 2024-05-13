import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { FaThermometer, FaTint, FaWind, FaSmog, FaLightbulb, FaRegLightbulb, 
  FaCloudSunRain, FaBolt, FaChartLine, FaSun, FaExclamation, 
  FaPlug, FaSyncAlt} from 'react-icons/fa'; // Importing icons from FontAwesome library


const Home = () => {
  // State for sensor data and its limits
  const [sensorData, setSensorData] = useState(null);
  const [isTempLimits, setIsTempLimits] = useState(true);
  const [isHumdLimits, setIsHumdLimits] = useState(true);
  const [isCarbonDioxideLimits, setIsCarbonDioxideLimits] = useState(true);
  const [isAirPressureLimits, setIsAirPressureLimits] = useState(true);
  const [isLightLimits, setIsLightLimits] = useState(true);
  const [isLightIntensityLimits, setIsLightIntensityLimits] = useState(true);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };
  
  const refreshPage = () => {
    window.location.reload();
  };


  // State for sensor data limits
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

  // Function to check if sensor data is within limits
  const checkDataLimits = useCallback((data) => {
    setIsTempLimits(data.temp >= limits.tempMin && data.temp <= limits.tempMax);
    setIsHumdLimits(data.humd >= limits.humdMin && data.humd <= limits.humdMax);
    setIsCarbonDioxideLimits(data.carbonDioxide >= limits.carbonDioxideMin && data.carbonDioxide <= limits.carbonDioxideMax);
    setIsAirPressureLimits(data.airp >= limits.airPressureMin && data.airp <= limits.airPressureMax);
    setIsLightLimits(data.lght >= limits.lightMin && data.lght <= limits.lightMax);
    setIsLightIntensityLimits(data.lghtint >= limits.lightIntensityMin && data.lghtint <= limits.lightIntensityMax);
  }, [limits]);
  
      //Fetch price data
  const [priceData, setPriceData] = useState({});
  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/price`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        
        const data = responseData.data;
       
  
        if (Array.isArray(data) && data.length > 0) {
          const sortedData = data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
          const latestPrice = sortedData[0];
          
            console.log('priceData.data:', priceData.data);

          // MWH to KWH
          const pricePerKwh = (latestPrice.value / 1000 * 100).toFixed(2);
          const pricePerKwhWithVAT = (pricePerKwh * 1.24).toFixed(2);
          
          setPriceData({ ...latestPrice, value: parseFloat(pricePerKwh), pricePerKwhWithVAT: parseFloat(pricePerKwhWithVAT) });
        } else {
          console.error('Invalid price data format:', responseData);
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    };
  
    fetchPriceData();
  }, []);
  
  // Fetch consumption data
  const [latestConsumption, setLatestConsumption] = useState({});

  useEffect(() => {
      console.log("UseEffect hook called");
      const fetchConsumptionData = async () => {
          try {
              const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/consumption`);
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              const responseData = await response.json();
              const data = responseData.data;
              console.log('Received consumption data:', data); // Test if data is sent to console
  
              if (Array.isArray(data) && data.length > 0) {
                  const consumptionData = [...data].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                  const latestConsumption = consumptionData[0];
                  // Conversion from MWh to kWh
                  const consumptionPerKwh = latestConsumption.value;
                  setLatestConsumption({ ...latestConsumption, value: consumptionPerKwh });
              } else {
                  console.error('Invalid consumption data format:', responseData);
              }
          } catch (error) {
              console.error('Error fetching consumption data:', error);
          }
      };
  
      fetchConsumptionData();
  }, []);
  



  // Fetch sensor data limits from backend API
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

  // Fetch sensor data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/getdata`);
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchData();
  }, []);



  
  
  
  
    

  // Fetch weather data
  const [weatherData, setWeatherData] = useState(null);
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/weather`);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);
    
  // Check sensor data limits when sensorData or limits change
  useEffect(() => {
    if (sensorData) {
      checkDataLimits(sensorData);
    }
  }, [sensorData, limits, checkDataLimits]);
  

  return (
    <div>
      <h1>Home</h1>
      <button className="info-button" onClick={toggleInfo}>
        Info
      </button>
       
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
      <button>
        <Link to="/charts"><FaChartLine/> Go to Charts</Link>
      </button>
      <button>
        <Link to="/forecast"><FaCloudSunRain/> See weather forecast</Link>
      </button>
      <button>
        <Link to="/price"><FaBolt/> Electricity price</Link>
      </button>
      <button>
        <Link to="/consumption"><FaPlug/> Electricity consumption</Link>
      </button>

      <h1>Latest data:</h1> 

      



      <h2>Inside:</h2>

      {sensorData && (
        <div className="Home-data-container">
          <div className={`Home-data-item ${isTempLimits ? '' : 'data-out-of-limits'}`}>
            {isTempLimits ? (
              <button className={`Home-data-button ${isTempLimits ? '' : 'data-out-of-limits'}`}>
                <Link to="/charts">
                  <FaThermometer size={30} />
                  <p>Inside Temperature: {sensorData.temp} °C</p>
                </Link>
              </button>
            ) : (
              <Link to="/log">
                <button className={`Home-data-button ${isTempLimits ? '' : 'data-out-of-limits'}`}>
                  <FaExclamation size={30} />
                  <p>Inside Temperature out of limits: {sensorData.temp} °C</p>
                </button>
              </Link>
            )}
          </div>
          <div className={`Home-data-item ${isHumdLimits ? '' : 'data-out-of-limits'}`}>
            {isHumdLimits ? (
              <button className={`Home-data-button ${isHumdLimits ? '' : 'data-out-of-limits'}`}>
                <Link to="/charts">
                  <FaTint size={30} />
                  <p>Inside Humidity: {sensorData.humd} %</p>
                </Link>
              </button>
            ) : (
              <Link to="/log">
                <button className={`Home-data-button ${isHumdLimits ? '' : 'data-out-of-limits'}`}>
                  <FaExclamation size={30} />
                  <p>Inside Humidity out of limits: {sensorData.humd} %</p>
                </button>
              </Link>
            )}
          </div>
          <div className={`Home-data-item ${isCarbonDioxideLimits ? '' : 'data-out-of-limits'}`}>
            {isCarbonDioxideLimits ? (
              <button className={`Home-data-button ${isCarbonDioxideLimits ? '' : 'data-out-of-limits'}`}>
                <Link to="/charts">
                  <FaSmog size={30} />
                  <p>CO2: {sensorData.carbonDioxide} ppm</p>
                </Link>
              </button>
            ) : (
              <Link to="/log">
                <button className={`Home-data-button ${isCarbonDioxideLimits ? '' : 'data-out-of-limits'}`}>
                  <FaExclamation size={30} />
                  <p>CO2 out of limits: {sensorData.carbonDioxide} ppm</p>
                </button>
              </Link>
            )}
          </div>
          <div className={`Home-data-item ${isAirPressureLimits ? '' : 'data-out-of-limits'}`}>
            {isAirPressureLimits ? (
              <button className={`Home-data-button ${isAirPressureLimits ? '' : 'data-out-of-limits'}`}>
                <Link to="/charts">
                  <FaWind size={30} />
                  <p>Inside Airpressure: {sensorData.airp} pa</p>
                </Link>
              </button>
            ) : (
              <Link to="/log">
                <button className={`Home-data-button ${isAirPressureLimits ? '' : 'data-out-of-limits'}`}>
                  <FaExclamation size={30} />
                  <p>Inside Airpressure out of limits: {sensorData.airp} pa</p>
                </button>
              </Link>
            )}
          </div>
          <div className={`Home-data-item ${isLightLimits ? '' : 'data-out-of-limits'}`}>
            {isLightLimits ? (
              <button className={`Home-data-button ${isLightLimits ? '' : 'data-out-of-limits'}`}>
                <Link to="/charts">
                  <FaLightbulb size={30} />
                  <p>Light: {sensorData.lght} lux</p>
                </Link>
              </button>
            ) : (
              <Link to="/log">
                <button className={`Home-data-button ${isLightLimits ? '' : 'data-out-of-limits'}`}>
                  <FaExclamation size={30} />
                  <p>Light out of limits: {sensorData.lght} lux</p>
                </button>
              </Link>
            )}
          </div>
          <div className={`Home-data-item ${isLightIntensityLimits ? '' : 'data-out-of-limits'}`}>
            {isLightIntensityLimits ? (
              <button className={`Home-data-button ${isLightIntensityLimits ? '' : 'data-out-of-limits'}`}>
                <Link to="/charts">
                  <FaRegLightbulb size={30} />
                  <p>Light intensity: {sensorData.lghtint} nW/cm2</p>
                </Link>
              </button>
            ) : (
              <Link to="/log">
                <button className={`Home-data-button ${isLightIntensityLimits ? '' : 'data-out-of-limits'}`}>
                  <FaExclamation size={30} />
                  <p>Light intensity out of limits: {sensorData.lghtint} nW/cm2</p>
                </button>
              </Link>
            )}
          </div>
        </div>
      )}


      <h2>Outside:</h2>
      <div className="Home-data-container">
        <div className="Home-data-item">
          <button>
            <Link to="/forecast">
              <FaThermometer size={30} />
              <p>Outside Temperature: {weatherData ? weatherData.current.temp_c : 'Loading...'} °C</p>
            </Link>
          </button>
        </div>
        <div className="Home-data-item">
          <button>
            <Link to="/forecast">
              <FaTint size={30} />
              <p>Outside Humidity: {weatherData ? weatherData.current.humidity : 'Loading...'} %</p>
            </Link>
          </button>
        </div>
        <div className="Home-data-item">
          <button>
            <Link to="/forecast">
              <FaWind size={30} />
              <p>Outside Airpressure: {weatherData ? weatherData.current.pressure_mb : 'Loading...'} hpa</p>
            </Link>
          </button>
        </div>
        <div className="Home-data-item">
          <button>
            <Link to="/charts">
              <FaSun size={30} />
              <p>Uv index: {weatherData ? weatherData.current.uv : 'Loading...'} </p>
            </Link>
          </button>
        </div>
        <div className="Home-data-item">
        <button>
            <Link to="/charts">
              <FaSun size={30} />
              <p>Sunrise: {weatherData ? weatherData.forecast.forecastday[0].astro.sunrise : 'Loading...'} </p>
              </Link>
          </button>
        </div>
        <div className="Home-data-item">
        <button>
            <Link to="/charts">
              <FaSun size={30} />
              <p>Sunset: {weatherData ? weatherData.forecast.forecastday[0].astro.sunset : 'Loading...'} </p>
              </Link>
          </button>
        </div>
      </div>

      <h3>Electricity price & consumption at the moment</h3>
         <div className="Home-data-container-1">
        <div className="Home-data-item-1">
          
        <button2>
      <Link to="/price">
        <FaBolt size={30} />
        <div>Electricity price at the moment including VAT: 
        {priceData && priceData.pricePerKwhWithVAT ? `${priceData.pricePerKwhWithVAT} cent / kWh`
         : 'Loading...'}</div>
           
        
      </Link>
    </button2>        
  </div>
        <div className="Home-data-item-1">
        <button2>
      <Link to="/consumption">
        <FaPlug size={30}/>
        <div>Electricity consumption at the moment: {latestConsumption ? `${latestConsumption.value} kWh` 
          : 'Loading...'} </div>
      </Link>
    </button2>          
  </div>
</div>
<button onClick={() => window.location.reload()} className="nav-link refresh-button">
          <FaSyncAlt/> Refresh
        </button>    

    </div>
  );
};

export default Home;
