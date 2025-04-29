const express = require('express');
const { scrapeWineData } = require('./wineScraper');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Debug logging middleware (move this before static file middleware)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (req.url.includes('WineBackground.png')) {
        console.log('Background image requested from:', req.url);
        console.log('Full path:', path.join(__dirname, req.url));
    }
    next();
});

// Serve static files with explicit paths for images
app.use(express.json());
app.use('/', express.static(path.join(__dirname)));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/WineBackground.png', express.static(path.join(__dirname, 'images/WineBackground.png')));

// Endpoint to handle wine scraping
app.post('/scrape-wine', async (req, res) => {
    try {
        let { url } = req.body;
        console.log('Received request to scrape URL:', url);
        
        // Clean up URL
        url = url.trim().replace(/^@/, '');
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        
        console.log('Cleaned URL:', url);
        
        const wineData = await scrapeWineData(url);
        console.log('Scraping successful:', wineData);
        res.json(wineData);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});
