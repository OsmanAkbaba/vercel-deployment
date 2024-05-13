# Greenhouse Monitoring System


The project aimed to create an application that monitors the air conditions inside a greenhouse using the Thingsee Air and Environment Sensor. The app would display temperature, humidity, carbon dioxide, air pressure, light level, and alert the user if any readings were concerning. The app included a chart feature for users to view past data. The app also has a weather forecast as well as the ability to view electricity prices and electricity consumption to help users better manage their crops in the greenhouse.

## Client Link

https://greenhouse1.vercel.app/

## Backend Link

https://greenhouse-app-server.onrender.com

## Technologies

Server-side: Node.Js

Client-side: React.js

Protocol: mqtt

Equipments: Thingsee Air, Enviroment sensors and Gateway

Database: MongoDB

Coding: Visual studio code

Deployment: Vercel, Render

## Main Features
1. Displays air conditions in the greenhouse. Includes temperature, humidity, carbon dioxide, air pressure and light level.
2. An alert is sent when a condition in the environment exceeds a threshold. User can set the threshold by themselves.
3. The Charts feature enables users to view historical data in a line graph format.
4. Outside air condition display.
5. Weather forecasting and presented as a line graph.
6. Real-time electricity prices are displayed and presented as a line graph.
7. Energy consumption currently displays electricity usage data from Finland. If available, this could be replaced with data specific to the greenhouse's electricity usage.
8. Backlog for values ​​from which you can view changes in the greenhouse

# Project Structure

The project is divided into two main parts:

# `frontend/`: 
-**This directory contains the React application that provides the user interface for the monitoring system. Here's a breakdown of its contents:**
- **components/**: Here you'll find React components that are part of the user interface. For example, navbar.js contains the component for the navigation bar.
- **screens/**: This directory contains various screens that form different views of the application. For example, home.js, charts.js, etc.
- **app.js**: This file is the main component of the application, defining its structure and routing.
- **app.css**: Here you'll find the general stylesheet for the application.
- **env.js**: This file may contain environment variables used by the application, such as API keys and other configuration data.

# `server/`: 
-**This directory contains the Node.js server responsible for managing the backend logic of the application. Here's a breakdown of its contents:**
- **certificates/**: Stores certificates required for secure communication with the MQTT broker or other services.
- **controllers/**: Contains various controller modules, each responsible for handling specific API routes and business logic.
- **routers/**: Houses router modules that define API endpoints and their corresponding controller functions. Each router typically represents a different area of functionality within the application.
- **services/**: Contains service modules that encapsulate functionality related to external services, such as MQTT communication (mqtt.cjs).
- **utils/**: Includes utility modules used across the server codebase, such as database handling utilities (db.jcs).
- **.env**: Configuration file where sensitive information like API keys and database URIs are stored securely.
- **index.js**: Entry point for the server application, where the server is instantiated and configured to listen for incoming requests.
## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Haltian-project/Greenhouse.git

2. Install the dependencies for the server
   ```sh
   cd greenhouse/server
   npm install  

3. Install the dependencies for the frontend
   ```sh
    cd greenhouse/frontend
    npm install

### Configuration
Create a .env file in the server directory to store your API keys and other sensitive information:
   ```sh
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   MongoDB_URI=your_mongodb_uri_here
   FINGRID_API_KEY=your_fingrid_api_key_here
   WEATHER_API_KEY=your_weather_api_key_here
   MQTT_BROKER_URL=your_mqtt_broker_url_here
   MQTT_TOPIC=your_mqtt_topic_here
   ```
Create a .env file in the frontend directory to define the server URL:
```sh
REACT_APP_SERVER_URL=http://localhost:your_port_number
 ```
      
### Running the Application

1. Start the server:
   ```sh
   cd greenhouse/server
   npm run start

2. In a new terminal window, start the frontend: 
   ```sh
   cd greenhouse/frontend
   npm run start:frontend

## Data Schema

![Screenshot 2024-04-24 at 23 56 57](https://github.com/Haltian-project/Greenhouse/assets/28098368/17643cb6-1dcf-48b8-8287-51b1a6b4ff0a)


### Captures of Application

![Screenshot 2024-04-24 at 23 42 43](https://github.com/Haltian-project/Greenhouse/assets/143429680/a29773cd-f779-40cc-b189-a89f23d3e9e9)

![Screenshot 2024-04-24 at 23 43 15](https://github.com/Haltian-project/Greenhouse/assets/28098368/530e29b1-52e1-4ea9-ab2d-56e37121c652)

![Screenshot 2024-04-24 at 23 43 29](https://github.com/Haltian-project/Greenhouse/assets/143429680/7faa9d11-b984-4e71-a52c-0795d85d0bff)

## Team

- **[Bao Tran](https://github.com/tranxbao)**

- **[Tuukka Huru](https://github.com/TuukkaHuru)**

- **[Osman Akbaba](https://github.com/OsmanAkbaba)**

- **[Ziqi Li](https://github.com/ZiqiLi28)**
