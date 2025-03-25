const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

// MongoDB Cloud Connection
const DB_PASSWORD = process.env.DB_PASSWORD || 'CS395Project'; 
const MONGODB_URI = `mongodb+srv://yassersdeghdegh:${DB_PASSWORD}@cs395.bh49e.mongodb.net/swe-cards?retryWrites=true&w=majority&appName=CS395`;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connection established'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define Card Schema
const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  about: { type: String, required: true },
  linkedInLink: { type: String },
  handshakeLink: { type: String },
  profileImageUrl: { type: String, default: 'profile.png' },
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
      handshakeLink: req.body.handshakeLink,
      profileImageUrl: req.body.profileImageUrl || 'profile.png'
    });
    
    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a card by ID
app.delete('/api/cards/:id', async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    if (!deletedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
