import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const getPrice = (req,res) =>{



    const datasetId = 106; 
    //106 Down-regulation price in the Balancing energy market
    //244 Up-regulating price in the Balancing energy market
    //319 Imbalance price
   
    const fetchData = async () => {
        try {
          const apiKey = process.env.FINGRID_API_KEY; // Store your API key in environment variables
           
          const response = await fetch(
            `https://data.fingrid.fi/api/datasets/${datasetId}/data?pageSize=30`,

            {
                headers: {
                    'x-api-key': apiKey
                }
            }
          );
          const data = await response.json();
          res.json(data);
        } catch (error) {
          console.error('Error fetching data from Fingrid API:', error);
          res.status(500).json({ error: 'Failed to fetch data from Fingrid API' }); // Handle errors and send an appropriate response
        }
      };

  
      fetchData();
}
