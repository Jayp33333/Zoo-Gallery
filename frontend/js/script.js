const API_URL = 'http://localhost:3001/api/animals';

// DOM Elements
const animalCards = document.getElementById('animal-cards');
const filterButtons = document.querySelectorAll('.filter-btn');
const animalModal = document.getElementById('animal-modal');
const updateModal = document.getElementById('update-modal');
const modalImage = document.getElementById('modal-image');
const modalName = document.getElementById('modal-name');
const modalType = document.getElementById('modal-type');
const modalDescriptionTitle = document.getElementById('modal-description-title');
const modalDescription = document.getElementById('modal-description');
const closeButtons = document.querySelectorAll('.close-btn');
const updateClose = document.querySelector('.update-close');
const deleteBtn = document.getElementById('delete-btn');
const updateBtn = document.getElementById('update-btn');
const updateForm = document.getElementById('update-form');
let currentAnimalId = null;

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
            window.location.href = 'gallery.html'; // Redirect to gallery page
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

// Display Animals in Gallery
function displayAnimals(animals, filter = 'all') {
    if (!animalCards) return;
    
    const filteredAnimals = filter === 'all' 
        ? animals 
        : animals.filter(animal => animal.type === filter);

    animalCards.innerHTML = filteredAnimals.map(animal => `
        <div class="animal-card" data-id="${animal._id}">
            <img src="${animal.image}" 
                 alt="${animal.name}"
                 onerror="this.src='https://via.placeholder.com/200?text=Image+Not+Found'">
            <h3>${animal.name}</h3>
            <p>${animal.type}</p>
        </div>
    `).join('');

    // Add click event to each card
    filteredAnimals.forEach(animal => {
        const card = document.querySelector(`.animal-card[data-id="${animal._id}"]`);
        if (card) {
            card.addEventListener('click', () => showAnimalDetails(animal));
        }
    });
}

// Show animal details in modal
function showAnimalDetails(animal) {
    modalImage.src = animal.image;
    modalImage.alt = animal.name;
    modalName.textContent = animal.name;
    modalType.textContent = animal.type;
    modalDescriptionTitle.textContent = `About the ${animal.name}`;
    modalDescription.textContent = animal.description;
    currentAnimalId = animal._id;
    animalModal.classList.remove('hidden');
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

        alert('Animal deleted successfully!');
        await loadAnimals();
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

// Initialize the application
function initApp() {
    // Filter button event listeners
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Load animals with filter
                loadAnimals(this.dataset.filter);
            });
        });
    }
    
    // Close modal buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            animalModal.classList.add('hidden');
        });
    });
    
    updateClose.addEventListener('click', () => {
        updateModal.classList.add('hidden');
    });
    
    // Delete button in modal
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this animal?')) {
                await deleteAnimal(currentAnimalId);
                animalModal.classList.add('hidden');
            }
        });
    }
    
    // Update button in modal
    if (updateBtn) {
        updateBtn.addEventListener('click', () => {
            if (!currentAnimalId) return;
    
            // Get the current animal data from the modal
            const image = modalImage.src;
            const name = modalName.textContent;
            const type = modalType.textContent;
            const description = modalDescription.textContent;
    
            // Populate the update form
            document.getElementById('update-id').value = currentAnimalId;
            document.getElementById('update-image').value = image;
            document.getElementById('update-name').value = name;
            document.getElementById('update-type').value = type;
            document.getElementById('update-description').value = description;
    
            // Switch modals
            animalModal.classList.add('hidden');
            updateModal.classList.remove('hidden');
        });
    }
    
    // Update form submission
    if (updateForm) {
        updateForm.addEventListener('submit', async function(e) {
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
                updateModal.classList.add('hidden');
                await loadAnimals();
            } catch (error) {
                console.error('Error updating animal:', error);
                alert(`Error: ${error.message}`);
            }
        });
    }
    
    // Load animals if on gallery page
    if (animalCards) {
        loadAnimals();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);