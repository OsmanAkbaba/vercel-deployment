import React, { useState, useEffect } from 'react';
import '../App.css'; 
import { Line } from 'react-chartjs-2';
import { Chart } from "chart.js/auto";
import { useNavigate } from 'react-router-dom';

const Price = () => {
    const [priceData, setPriceData] = useState(null);
    const navigate = useNavigate();

    const [isInfoVisible, setIsInfoVisible] = useState(false);

    const toggleInfo = () => {
        setIsInfoVisible(!isInfoVisible);
  };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_SERVER_URL}/price`
                );
                const data = await response.json();
                setPriceData(data);
            } catch (error) {
                console.error('Error fetching electricity price:', error);
            }
        };

        fetchData();
    }, []);

    const formatDate2 = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedDate = date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        return `${formattedDate} ${hours}:${minutes}`;
    };

    const formatPrice = (value) => {
        // Convert the price to cents per kWh with two decimal places
        const centsPerKWh = (value / 10).toFixed(2); // 1 MWh = 1000 kWh, so divide the value by 10
        return centsPerKWh;
    }

    const formatPriceWithVAT = (value) => {
        // Convert the price to cents per kWh with two decimal places
        const centsPerKWh = (value / 10).toFixed(2); // 1 MWh = 1000 kWh, so divide the value by 10
        // Add VAT 
        const priceWithVAT = (centsPerKWh * 1.24).toFixed(2); // Assuming VAT is 24%
        return priceWithVAT;
    }

   // Sort time labels and corresponding data
   const sortedData = priceData ? [...priceData.data].reverse() : [];
   const chartData = {
       labels: sortedData.map(item => formatDate2(item.startTime)),
       datasets: [
           {
               label: 'Price (cents/KWh)',
               data: sortedData.map(item => formatPrice(item.value)),
               fill: false,
               borderColor: 'rgba(75,192,192,1)',
               tension: 0.1
           },
           {
               label: 'Price with VAT (cents/KWh)',
               data: sortedData.map(item => formatPriceWithVAT(item.value)),
               fill: false,
               borderColor: 'rgba(192,75,192,1)',
               tension: 0.1
           }
       ]
   };
    const options = {
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      };
      return (
        <div className="PriceContainer">
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
                            <p>In this page you are able to seek SPOT-price.</p>
                        </div>
                    </div>
                </div>
            )}
            <h2>Electricity price</h2>
            {priceData ? (
                <div>
                    <div className="PriceTableWrapper">
                        <table className="PriceTable">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Price (cents/KWh)</th>
                                    <th>Price with VAT 24 % (cents/KWh)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{formatDate2(item.startTime)}</td>
                                        <td>{formatPrice(item.value)}</td>
                                        <td>{formatPriceWithVAT(item.value)}</td>
                                    </tr>
                                )).reverse()}
                            </tbody>
                        </table>
                    </div>
                    <h2>Electricity price chart:</h2>
                    <Line data={chartData} options={options} />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Price;