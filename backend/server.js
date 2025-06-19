const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const animalRoutes = require('./routes/animals');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (updated to remove deprecated options)
mongoose.connect('mongodb://localhost:27017/zooDB')
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/animals', animalRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));