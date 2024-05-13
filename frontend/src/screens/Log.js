import React, { useState, useEffect } from 'react';
import '../App.css'; 
import { useNavigate } from 'react-router-dom';

const Log = () => {
    const [logData, setLogData] = useState(null);
    const navigate = useNavigate();

    const [isInfoVisible, setIsInfoVisible] = useState(false);

    const toggleInfo = () => {
      setIsInfoVisible(!isInfoVisible);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch sensor data from backend API
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/logdata`);
                const data = await response.json();
                setLogData(data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
             <button1 onClick={() => navigate('/')}>Back To Home</button1>

             <button className="info-button" onClick={toggleInfo}>
        Info
      </button>
       {/* Info Modal */}
       {isInfoVisible && (
        <div className="info-modal">
          <div className="info-content">
          <span className="close" onClick={toggleInfo}>&times;</span>
          <div className="info-text">  

          <p> 
          The log page stores values as a result of exceeding the threshold 
            values set on the settings page. <br></br>This helps users understand why and how 
            deviations in certain environmental parameters are recorded in the log. <br></br>
            The log provides users with important information about potential issues or 
            alarming situations in the greenhouse.
           </p>


                </div>
              </div>
            </div>
          )}
            
            {logData && (
                <table className='log-table'>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Temperature</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logData.temp.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.timestamp}</td>
                                <td>{entry.value}</td>
                            </tr>
                        ))}
                    </tbody>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Carbon Dioxide</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logData.carbonDioxide.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.timestamp}</td>
                                <td>{entry.value}</td>
                            </tr>
                        ))}
                    </tbody>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Humidity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logData.humd.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.timestamp}</td>
                                <td>{entry.value}</td>
                            </tr>
                        ))}
                    </tbody>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Air Pressure</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logData.airp.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.timestamp}</td>
                                <td>{entry.value}</td>
                            </tr>
                        ))}
                    </tbody>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Light Intensity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logData.lghtint.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.timestamp}</td>
                                <td>{entry.value}</td>
                            </tr>
                        ))}
                    </tbody>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Light</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logData.lght.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.timestamp}</td>
                                <td>{entry.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Log;


