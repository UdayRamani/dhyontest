const fs = require('fs');
const express = require('express');
const path = require('path');
const { createSignedCookies } = require('./cookies');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Serve login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve video page
app.get('/video/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index1.html'));
});

// Example route for testing CloudFront EC2 behavior
app.get('/ec2', (req, res) => {
  res.send('Hello from EC2 via CloudFront!');
});

// API endpoint to generate signed cookies
app.post('/api/generate-cookies', async (req, res) => {
  try {
    const config = req.body;

    if (!config.urlPrefix || !config.keyPairId || !config.privateKeyPath || !config.expiryHours) {
      return res.status(400).json({ error: 'Missing required configuration parameters' });
    }

    const cookies = await createSignedCookies(config);
    res.json(cookies);
  } catch (error) {
    console.error('Error generating cookies:', error);
    res.status(500).json({ error: 'Failed to generate signed cookies' });
  }
});

// Start HTTP server on port 3000 for local development
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

