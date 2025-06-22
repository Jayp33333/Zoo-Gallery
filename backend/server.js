const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const animalRoutes = require('./routes/animals');

const app = express();

const MONGO_URI = 'mongodb://localhost:27017/zooDB';
// const MONGO_URI = 'mongodb+srv://zoo-gallery:zoo-gallery@zoo-gallery.v0apg0p.mongodb.net/';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (updated to remove deprecated options)
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/animals', animalRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));