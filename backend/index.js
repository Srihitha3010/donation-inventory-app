// backend/index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, 'data.json');

// Read donations from data.json
function readDonations() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Write donations to data.json
function writeDonations(donations) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(donations, null, 2));
}

// Get all donations
app.get('/donations', (req, res) => {
  const donations = readDonations();
  res.json(donations);
});

// Create a new donation
app.post('/donations', (req, res) => {
  const { donorName, donationType, quantity, date } = req.body;
  console.log('POST received:', req.body);

  if (!donorName || !donationType || !quantity || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newDonation = {
    id: Date.now().toString(),
    donorName,
    donationType,
    quantity,
    date,
  };

  const donations = readDonations();
  donations.push(newDonation);
  writeDonations(donations);

  res.status(201).json(newDonation);
});

// Update a donation
app.put('/donations/:id', (req, res) => {
  const { donorName, donationType, quantity, date } = req.body;
  console.log('PUT received:', req.body);

  if (!donorName || !donationType || !quantity || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const donations = readDonations();
  const index = donations.findIndex(d => d.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'Donation not found' });

  donations[index] = { id: req.params.id, donorName, donationType, quantity, date };
  writeDonations(donations);

  res.json(donations[index]);
});

// Delete a donation
app.delete('/donations/:id', (req, res) => {
  let donations = readDonations();
  const id = req.params.id;
  const exists = donations.find(d => d.id === id);

  if (!exists) return res.status(404).json({ error: 'Donation not found' });

  donations = donations.filter(d => d.id !== id);
  writeDonations(donations);

  res.json({ message: 'Donation deleted' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
