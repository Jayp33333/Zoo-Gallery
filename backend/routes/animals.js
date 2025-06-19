const express = require('express');
const Animal = require('../models/Animal');
const router = express.Router();

// GET all animals
router.get('/', async (req, res) => {
    try {
        const animals = await Animal.find();
        res.json(animals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single animal by ID
router.get('/:id', async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) {
            return res.status(404).json({ message: 'Animal not found' });
        }
        res.json(animal);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new animal
router.post('/', async (req, res) => {
    const animal = new Animal({
        image: req.body.image,
        name: req.body.name,
        type: req.body.type,
        description: req.body.description
    });

    try {
        const newAnimal = await animal.save();
        res.status(201).json(newAnimal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update animal by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedAnimal = await Animal.findByIdAndUpdate(
            req.params.id,
            {
                image: req.body.image,
                name: req.body.name,
                type: req.body.type,
                description: req.body.description
            },
            { new: true }
        );

        if (!updatedAnimal) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        res.json(updatedAnimal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE animal
router.delete('/:id', async (req, res) => {
    try {
        const deletedAnimal = await Animal.findByIdAndDelete(req.params.id);
        if (!deletedAnimal) {
            return res.status(404).json({ message: 'Animal not found' });
        }
        res.json({ message: 'Animal deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
