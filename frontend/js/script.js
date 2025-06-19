const API_URL = 'http://localhost:3001/api/animals';

// Add Animal Form Submission
if (document.getElementById('animal-form')) {
    document.getElementById('animal-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const imageUrl = document.getElementById('image').value;
        const name = document.getElementById('name').value;
        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value;

        if (!imageUrl || !name || !type || !description) {
            alert('Please fill in all fields');
            return;
        }

        try {
            new URL(imageUrl);
        } catch (e) {
            alert('Please enter a valid image URL');
            return;
        }

        const animalData = {
            image: imageUrl,
            name,
            type,
            description
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(animalData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add animal');
            }

            alert('Animal added successfully!');
            this.reset();
            
            if (document.getElementById('animal-cards')) {
                await loadAnimals();
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    });
}


// Load and Display Animals
async function loadAnimals(filter = 'all') {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to load animals');
        }
        const animals = await response.json();
        displayAnimals(animals, filter);
    } catch (error) {
        console.error('Error loading animals:', error);
        const gallery = document.getElementById('animal-cards');
        if (gallery) {
            gallery.innerHTML = `<p class="error">Error loading animals: ${error.message}</p>`;
        }
    }
}

let selectedAnimalId = null;

// Display Modal with Animal Info
function showModal(animal) {
    selectedAnimalId = animal._id;
    document.getElementById('modal-image').src = animal.image;
    document.getElementById('modal-name').textContent = animal.name;
    document.getElementById('modal-type').textContent = animal.type;
    document.getElementById('modal-description').textContent = animal.description;

    document.getElementById('animal-modal').classList.remove('hidden');
}

// Close Modal
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('animal-modal').classList.add('hidden');
});

// Delete Button inside Modal
document.getElementById('delete-btn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete this animal?')) {
        await deleteAnimal(selectedAnimalId);
        document.getElementById('animal-modal').classList.add('hidden');
    }
});

// Update the modal display and form handling
document.getElementById('update-btn').addEventListener('click', () => {
    if (!selectedAnimalId) return;

    // Get the current animal data from the modal
    const image = document.getElementById('modal-image').src;
    const name = document.getElementById('modal-name').textContent;
    const type = document.getElementById('modal-type').textContent;
    const description = document.getElementById('modal-description').textContent;

    // Populate the update form
    document.getElementById('update-id').value = selectedAnimalId;
    document.getElementById('update-image').value = image;
    document.getElementById('update-name').value = name;
    document.getElementById('update-type').value = type;
    document.getElementById('update-description').value = description;

    // Switch modals
    document.getElementById('animal-modal').classList.add('hidden');
    document.getElementById('update-modal').classList.remove('hidden');
});

// Update form submission
document.getElementById('update-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('update-id').value;
    const image = document.getElementById('update-image').value;
    const name = document.getElementById('update-name').value;
    const type = document.getElementById('update-type').value;
    const description = document.getElementById('update-description').value;

    // Basic validation
    if (!image || !name || !type || !description) {
        alert('Please fill in all fields');
        return;
    }

    try {
        new URL(image);
    } catch (e) {
        alert('Please enter a valid image URL');
        return;
    }

    const updatedData = { 
        image, 
        name, 
        type, 
        description 
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update animal');
        }

        alert('Animal updated successfully!');
        document.getElementById('update-modal').classList.add('hidden');
        await loadAnimals();
    } catch (error) {
        console.error('Error updating animal:', error);
        alert(`Error: ${error.message}`);
    }
});

// Close update modal
document.querySelector('.update-close').addEventListener('click', () => {
    document.getElementById('update-modal').classList.add('hidden');
});





// Update the displayAnimals function to include click event on cards
function displayAnimals(animals, filter = 'all') {
    const gallery = document.getElementById('animal-cards');
    if (!gallery) return;
    
    const filteredAnimals = filter === 'all' 
        ? animals 
        : animals.filter(animal => animal.type === filter);

    gallery.innerHTML = filteredAnimals.map(animal => `
        <div class="animal-card" data-id="${animal._id}">
            <img src="${animal.image}" 
                 alt="${animal.name}" 
                 onerror="this.src='https://via.placeholder.com/200?text=Image+Not+Found'">
            <h3>${animal.name}</h3>
            <p><strong>Type:</strong> ${animal.type}</p>
        </div>
    `).join('');

    // Add click event to open modal
    filteredAnimals.forEach(animal => {
        const card = document.querySelector(`.animal-card[data-id="${animal._id}"]`);
        if (card) {
            card.addEventListener('click', () => showModal(animal));
        }
    });
}

// Delete Animal
async function deleteAnimal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete animal');
        }

        await loadAnimals();
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

// Initialize Gallery
if (document.getElementById('animal-cards')) {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            loadAnimals(this.dataset.filter);
        });
    });

    loadAnimals();
}