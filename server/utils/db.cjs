require('dotenv').config({ path: `${__dirname}/../.env` });
const { MongoClient } = require('mongodb');

// MongoDB database settings
const mongoURI = process.env.MongoDB_URI;
const dbName = 'mqtt_data';

// Function to save data to MongoDB database
async function saveDataToMongoDB(data) {
    try {
        const client = await MongoClient.connect(mongoURI);
        const db = client.db(dbName);
        const collection = db.collection('sensor_data'); // Collection name: sensor_data
 // Create a document containing the desired values
 const document = {};

 // Add temperature if available
 if (data.temp) {
     document.temp = data.temp;
 }

 // Add humidity if available
 if (data.humd) {
     document.humd = data.humd;
 }

 // Add carbon dioxide level if available
 if (data.carbonDioxide) {
     document.carbonDioxide = data.carbonDioxide;
 }

 // Add air pressure if available
 if (data.airp) {
     document.airp = data.airp;
 }

 // Add light level if available
 if (data.lght) {
     document.lght = data.lght;
 }

 // Add light intensity if available
 if (data.lghtint) {
     document.lghtint = data.lghtint;
 }

 if (Object.keys(document).length > 0) {
    const options = {
        timeZone: 'Europe/Helsinki',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    document.timestamp = new Date().toLocaleString('fi-FI', options);
}
 // Insert the document into the collection if it has at least one value
 if (Object.keys(document).length > 0) {
     await collection.insertOne(document);
     console.log('Data saved to MongoDB');
 } else {
     console.log('No valid data to save');
 }
        // Close the database connection
        client.close();
    } catch (err) {
        console.error('Error saving data to MongoDB:', err);
    }
}
async function saveDataToMongoDB_log(data) {
    try {
        const client = await MongoClient.connect(mongoURI);
        const db = client.db(dbName);
        const collection = db.collection('backlog'); // Collection name: backlog
        
        // Get the limit values from MongoDB
        const limits = await getLimitsFromMongoDB();

        // Create a document containing the desired values
        const document = {};

        // Add temperature if available and within limits
        if (data.temp && (data.temp < limits.tempMin || data.temp > limits.tempMax)) {
            document.temp = data.temp;
        }

        // Add humidity if available and within limits
        if (data.humd && (data.humd < limits.humdMin || data.humd > limits.humdMax)) {
            document.humd = data.humd;
        }

        // Add carbon dioxide level if available and within limits
        if (data.carbonDioxide && (data.carbonDioxide < limits.carbonDioxideMin || data.carbonDioxide > limits.carbonDioxideMax)) {
            document.carbonDioxide = data.carbonDioxide;
        }

        // Add air pressure if available and within limits
        if (data.airp && (data.airp < limits.airPressureMin || data.airp > limits.airPressureMax)) {
            document.airp = data.airp;
        }

        // Add light level if available and within limits
        if (data.lght && (data.lght < limits.lightMin || data.lght > limits.lightMax)) {
            document.lght = data.lght;
        }

        // Add light intensity if available and within limits
        if (data.lghtint && (data.lghtint < limits.lightIntensityMin || data.lghtint > limits.lightIntensityMax)) {
            document.lghtint = data.lghtint;
        }

        if (Object.keys(document).length > 0) {
            const options = {
                timeZone: 'Europe/Helsinki',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            };
            document.timestamp = new Date().toLocaleString('fi-FI', options);
        }

        // Insert the document into the collection if it has at least one value
        if (Object.keys(document).length > 0) {
            await collection.insertOne(document);
            console.log('Data saved to MongoDB - exceeded');
        } else {
            console.log('No valid data to save - exceeded');
        }

        // Close the database connection
        client.close();
    } catch (err) {
        console.error('Error saving data to MongoDB:', err);
    }
}


async function saveLimitsToMongoDB(limits) {
    try {
        const client = await MongoClient.connect(mongoURI);
        const db = client.db(dbName);
        const collection = db.collection('limits');
        
        // Insert new limit document
        const document = {};
        // Add temperature min and max if available
        if (limits.tempMin) {
            document.tempMin = limits.tempMin;
        }
        if (limits.tempMax) {
            document.tempMax = limits.tempMax;
        }
        // Add humidity min and max if available
        if (limits.humdMin) {
            document.humdMin = limits.humdMin;
        }
        if (limits.humdMax) {
            document.humdMax = limits.humdMax;
        }
        // Add carbon dioxide min and max if available
        if (limits.carbonDioxideMin) {
            document.carbonDioxideMin = limits.carbonDioxideMin;
        }
        if (limits.carbonDioxideMax) {
            document.carbonDioxideMax = limits.carbonDioxideMax;
        }
        // Add air pressure min and max if available
        if (limits.airPressureMin) {
            document.airPressureMin = limits.airPressureMin;
        }
        if (limits.airPressureMax) {
            document.airPressureMax = limits.airPressureMax;
        }
        // Add light min and max if available
        if (limits.lightMin) {
            document.lightMin = limits.lightMin;
        }
        if (limits.lightMax) {
            document.lightMax = limits.lightMax;
        }
        // Add light intensity min and max if available
        if (limits.lightIntensityMin) {
            document.lightIntensityMin = limits.lightIntensityMin;
        }
        if (limits.lightIntensityMax) {
            document.lightIntensityMax = limits.lightIntensityMax;
        }
        
        await collection.insertOne(document);
        
        console.log('Limits saved to MongoDB');
        
        client.close();
    } catch (err) {
        console.error('Error saving limits to MongoDB:', err);
    }
}



//function to get data from MongoDB
async function getDataFromMongoDB() {
    try {
        const client = await MongoClient.connect(mongoURI);
        const db = client.db(dbName);
        const collection = db.collection('sensor_data');

        // Query to find the 10 latest documents with the desired fields
        const query = {
            $or: [
                { temp: { $exists: true } },
                { carbonDioxide: { $exists: true } },
                { humd: { $exists: true } },
                { airp: { $exists: true } },
                { lghtint: { $exists: true } },
                { lght: { $exists: true } }
            ]
        };

        // Sort by descending order of insertion (_id) to get the latest documents first
        const options = { sort: { _id: -1 } };

        // Find the 20 latest documents
        const latestDocuments = await collection.find(query, options).toArray();
        let latestData = {};

        // Loop through each field and find the latest value
        const fields = ['temp', 'carbonDioxide', 'humd', 'airp', 'lghtint', 'lght', 'timestamp'];
        fields.forEach(field => {
            // Find the latest value for the field
            const latestValue = findLatestValue(latestDocuments, field);
            latestData[field] = latestValue;
        });
       

        // Close the database connection
        client.close();

        console.log('Data obtained');

        return latestData;
    } catch (err) {
        console.error('Error getting data from MongoDB:', err);
        return null;
    }
}

// Helper function to find the latest value for a field
function findLatestValue(documents, field) {
    let latestValue = null;
    for (const doc of documents) {
        if (doc[field] !== undefined) {
            latestValue = doc[field];
            break;
        }
    }
    return latestValue;
}

//function to get data from MongoDB
async function getDataFromMongoDB2() {
    try {
        const client = await MongoClient.connect(mongoURI);
        const db = client.db(dbName);
        const collection = db.collection('sensor_data');

     
        const query = {
            $or: [
                { temp: { $exists: true } },
                { carbonDioxide: { $exists: true } },
                { humd: { $exists: true } },
                { airp: { $exists: true } },
                { lghtint: { $exists: true } },
                { lght: { $exists: true } }
            ]
        };

        // Sort by descending order of insertion (timestamp) to get the latest documents first
        const options = { sort: { _id: -1 } };

        // Find the 20 latest documents
        const latestDocuments = await collection.find(query, options).toArray();
        let latest20Data = {};

        
        // Loop through each field and find the 20 latest values with timestamps
        const fields = ['temp', 'carbonDioxide', 'humd', 'airp', 'lghtint', 'lght'];
        fields.forEach(field => {
            // Find the 20 latest values for the field with timestamps
            const latestValue2 = find20Value(latestDocuments, field);
            latest20Data[field] = latestValue2;
        });

        // Close the database connection
        client.close();

        console.log('Data obtained');

        return latest20Data;
    } catch (err) {
        console.error('Error getting data from MongoDB:', err);
        return null;
    }
}

// Function to find the 20 latest values with timestamps for a field
function find20Value(documents, field) {
    const values = [];
    for (const doc of documents) {
        if (doc[field] !== undefined) {
            values.push({ timestamp: doc.timestamp, value: doc[field] });
            if (values.length === 20) {
                break;
            }
        }
    }
    return values;
}
async function getDataFromMongoDB_Log() {
    try {
        const client = await MongoClient.connect(mongoURI);
        const db = client.db(dbName);
        const collection = db.collection('backlog');

     
        const query = {
            $or: [
                { temp: { $exists: true } },
                { carbonDioxide: { $exists: true } },
                { humd: { $exists: true } },
                { airp: { $exists: true } },
                { lghtint: { $exists: true } },
                { lght: { $exists: true } }
            ]
        };

        // Sort by descending order of insertion (timestamp) to get the latest documents first
        const options = { sort: { _id: -1 } };

        // Find the 20 latest documents
        const latestDocuments = await collection.find(query, options).toArray();
        let latestLogData = {};

        
        // Loop through each field and find the 20 latest values with timestamps
        const fields = ['temp', 'carbonDioxide', 'humd', 'airp', 'lghtint', 'lght'];
        fields.forEach(field => {
            // Find the 20 latest values for the field with timestamps
            const latestValue3 = findLogValue(latestDocuments, field);
            latestLogData[field] = latestValue3;
        });

        // Close the database connection
        client.close();

        console.log('Log Data obtained');

        return latestLogData;
    } catch (err) {
        console.error('Error getting log data from MongoDB:', err);
        return null;
    }
}

// Function to find the 20 latest values with timestamps for a field
function findLogValue(documents, field) {
    const values = [];
    for (const doc of documents) {
        if (doc[field] !== undefined) {
            values.push({ timestamp: doc.timestamp, value: doc[field] });
            if (values.length === 20) {
                break;
            }
        }
    }
    return values;
}
async function getLimitsFromMongoDB() {
    try {
        const client = await MongoClient.connect(mongoURI);
        const db = client.db(dbName);
        const collection = db.collection('limits');
        
        // Find the latest limit document
        const cursor = collection.find().sort({ _id: -1 }).limit(1);
        const limitDocument = await cursor.next();
        
        // Form the limits object from the document fields
        const limits = {
            tempMin: limitDocument.tempMin,
            tempMax: limitDocument.tempMax,
            humdMin: limitDocument.humdMin,
            humdMax: limitDocument.humdMax,
            carbonDioxideMin: limitDocument.carbonDioxideMin,
            carbonDioxideMax: limitDocument.carbonDioxideMax,
            airPressureMin: limitDocument.airPressureMin,
            airPressureMax: limitDocument.airPressureMax,
            lightMin: limitDocument.lightMin,
            lightMax: limitDocument.lightMax,
            lightIntensityMin: limitDocument.lightIntensityMin,
            lightIntensityMax: limitDocument.lightIntensityMax
        };
        
        console.log('Limits obtained from MongoDB');
        
        client.close();
        
        return limits;
    } catch (err) {
        console.error('Error getting limits from MongoDB:', err);
        return null;
    }
}



module.exports = { saveDataToMongoDB, saveDataToMongoDB_log, saveLimitsToMongoDB, getDataFromMongoDB , getDataFromMongoDB2, getDataFromMongoDB_Log, getLimitsFromMongoDB};

