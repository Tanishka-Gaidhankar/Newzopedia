const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Debug log
console.log('API Key loaded:', NEWS_API_KEY ? 'Yes' : 'No');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Main routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'Username is required' });
    }
});

// News API endpoint
app.get('/api/news/:category', async (req, res) => {
    try {
        const { category } = req.params;
        console.log('Fetching news for:', category); // Debug log

        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: category,
                apiKey: NEWS_API_KEY,
                language: 'en',
                pageSize: 6,
                sortBy: 'publishedAt'
            }
        });

        console.log('NewsAPI response status:', response.status); // Debug log
        res.json(response.data.articles);
    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to fetch news',
            details: error.response?.data || error.message
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Test the API at: http://localhost:${PORT}/api/news/technology`);
});