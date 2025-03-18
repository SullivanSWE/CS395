//ROhan
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/swe-cards')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Define Card Schema
const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  about: { type: String, required: true },
  linkedInLink: { type: String },
  handshakeLink: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Create model
const Card = mongoose.model('Card', cardSchema);

// API Routes
// Get all cards
app.get('/api/cards', async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new card
app.post('/api/cards', async (req, res) => {
  try {
    const newCard = new Card({
      name: req.body.name,
      about: req.body.about,
      linkedInLink: req.body.linkedInLink,
      handshakeLink: req.body.handshakeLink
    });
    
    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));