import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import forecast from './routers/forecast.js';
import weather from './routers/weather.js';
import price from './routers/price.js';
import consumption from './routers/consumption.js';
import mongoose from 'mongoose';
import getDataRouter from './routers/getdata.js';
import logdataRouter from './routers/logdata.js';
import get20DataRouter from './routers/get20data.js';
import limitsRouter from './routers/limits.js';

import { client } from './services/mqtt.cjs';
import { getDataFromMongoDB } from './utils/db.cjs'

const app = express();
const PORT = process.env.PORT || 8000;

const URI = process.env.MongoDB_URI;

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/forecast', forecast);
app.use('/weather', weather);
app.use('/price', price);
app.use('/consumption', consumption);
app.use('/getdata', getDataRouter);
app.use('/get20data', get20DataRouter);
app.use('/limits', limitsRouter);
app.use('/logdata', logdataRouter);

// MQTT client
client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

mongoose
  .connect(URI)
  .then(() => {
    console.log('Connected to MongoDB');

    const executeAndSetInterval = async () => {
      const latestData = await getDataFromMongoDB();
      // Broadcasting latest data to connected clients (front end)
      app.locals.latestData = latestData;
    };
    executeAndSetInterval(); // Execute immediately on startup
    // Schedule a task to run every minute after the initial execution
    setInterval(executeAndSetInterval, 60000);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
