import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const getWeather = (req,res) =>{
    const fetchData = async () => {
        try {
          const apiKey = process.env.WEATHER_API_KEY; // Store your API key in environment variables
           
          const response = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Oulu&days=7`
          );
          const data = await response.json();
          res.json(data);
        } catch (error) {
          console.error('Error fetching weather :', error);
          res.status(500).json({ error: 'Failed to fetch weather ' }); // Handle errors and send an appropriate response
        }
      };
  
      fetchData();
}