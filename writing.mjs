import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), 'public'))); // Serve static files from the public folder

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'writing.html')); // Serve the HTML file
});

// Grammar check route
app.post('/check-grammar', async (req, res) => {
    const userInput = req.body.text;
    console.log("Received text for grammar check:", userInput); // Log the input

    try {
        const response = await fetch('https://grammarbot-neural.p.rapidapi.com/v1/check', {
            method: 'POST',
            headers: {
                'x-rapidapi-key': 'a2ec4e5269msh620102a1c0ac584p1b3c67jsn39660a81413b', // Use your actual API key
                'x-rapidapi-host': 'grammarbot-neural.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: userInput, lang: 'en' })
        });

        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text(); // Get error response text
            console.error("Error response from grammar check:", errorText); // Log error response
            return res.status(response.status).json({ error: errorText });
        }

        const result = await response.json();
        console.log("Received result from grammar check:", result); // Log the result

        // Check if there are matches (errors)
        if (!result || !result.matches || result.matches.length === 0) {
            console.log("No corrections found."); // Log if no corrections
            return res.json({ corrections: [] }); // No corrections
        }

        // Send the corrections back to the client
        res.json({ corrections: result.matches });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Error processing request' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
