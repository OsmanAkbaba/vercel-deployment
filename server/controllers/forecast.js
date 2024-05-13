import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const getForecast = (req,res) =>{
    const fetchData = async () => {
        try {
          const apiKey = process.env.OPENWEATHER_API_KEY; // Store your API key in environment variables
           
          const response = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?id=643492&appid=${apiKey}&units=metric`
          );
          const data = await response.json();
          res.json(data);
        } catch (error) {
          console.error('Error fetching weather forecast:', error);
          res.status(500).json({ error: 'Failed to fetch weather forecast' }); // Handle errors and send an appropriate response
        }
      };
  
      fetchData();
}