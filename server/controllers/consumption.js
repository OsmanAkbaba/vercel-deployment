import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const getConsumption = (req,res) =>{



    const datasetId = 124; 
   
    const fetchData = async () => {
        try {
          const apiKey = process.env.FINGRID_API_KEY; // Store your API key in environment variables
           
          const response = await fetch(
            `https://data.fingrid.fi/api/datasets/${datasetId}/data?pageSize=60`,

            {
                headers: {
                    'x-api-key': apiKey
                }
            }
          );
          const data = await response.json();
          res.json(data);
        } catch (error) {
          console.error('Error fetching consumption from Fingrid API:', error);
          res.status(500).json({ error: 'Failed to fetch consumption from Fingrid API' }); // Handle errors and send an appropriate response
        }
      };

  
      fetchData();
}
