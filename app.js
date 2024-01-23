const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const jsonFilePath = './data.json';

app.post('/postdata', async (req, res) => {
    try {
        // Get JSON data from the request
        const data = req.body;

        // Your processing logic here
        // For example, let's just log the received JSON data
        console.log(data);

        // Check if the JSON file already exists
        if (await fs.access(jsonFilePath).then(() => true).catch(() => false)) {
            // Read existing JSON data from the file
            const existingData = JSON.parse(await fs.readFile(jsonFilePath));

            // Append the new data to the existing data
            existingData.push(data);

            // Write the updated data back to the JSON file
            await fs.writeFile(jsonFilePath, JSON.stringify(existingData, null, 2));
        } else {
            // If the file doesn't exist, create a new array with the current data
            await fs.writeFile(jsonFilePath, JSON.stringify([data], null, 2));
        }

        const responseData = { receivedData: data };

        // Respond with JSON
        res.status(200).json(responseData);
    } catch (error) {
        // Handle exceptions if any
        res.status(400).json({ error: error.toString() });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
