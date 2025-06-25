const API_URL = "http://localhost:3001/api/animals";

// DOM Elements
const animalCards = document.getElementById("animal-cards");
const filterButtons = document.querySelectorAll(".filter-btn");
const animalModal = document.getElementById("animal-modal");
const updateModal = document.getElementById("update-modal");
const modalImage = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalType = document.getElementById("modal-type");
const modalDescriptionTitle = document.getElementById("modal-description-title");
const modalDescription = document.getElementById("modal-description");
const closeButtons = document.querySelectorAll(".close-btn");
const updateClose = document.querySelector(".update-close");
const deleteBtn = document.getElementById("delete-btn");
const updateBtn = document.getElementById("update-btn");
const updateForm = document.getElementById("update-form");
const animalSearch = document.getElementById("animal-search");
const searchBtn = document.getElementById("search-btn");
const clearSearch = document.getElementById("clear-search");  
let currentAnimalId = null;
let allAnimals = []; // Store all animals for search functionality

// Toggle search input visibility
searchBtn.addEventListener('click', function() {
  animalSearch.classList.toggle('expanded');
  if (animalSearch.classList.contains('expanded')) {
    animalSearch.focus();
  } else {
    animalSearch.value = ''; // Clear search input when collapsed
    clearSearch.classList.add('hidden'); // Hide clear button
  }
});

// Show clear button when there's text
animalSearch.addEventListener('input', function() {
  if (animalSearch.value.length > 0) {
    clearSearch.classList.remove('hidden');
  } else {
    clearSearch.classList.add('hidden');
  }
});

// Clear search input
clearSearch.addEventListener('click', function() {
  animalSearch.value = '';
  clearSearch.classList.add('hidden');
  animalSearch.focus();
});

// Close search when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.search-container') && 
      animalSearch.classList.contains('expanded')) {
    animalSearch.classList.remove('expanded');
    animalSearch.value = '';
    clearSearch.classList.add('hidden');
    animalSearch.focus();
  }
});

// Search Functionality
function searchAnimals() {
  const searchTerm = animalSearch.value.trim().toLowerCase();
  
  if (searchTerm === "") {
    displayAnimals(allAnimals);
    clearSearch.classList.add("hidden");
    return;
  }

  const filteredAnimals = allAnimals.filter(animal => 
    animal.name.toLowerCase().includes(searchTerm)
  );
  
  displayAnimals(filteredAnimals);
  clearSearch.classList.remove("hidden");
}

// Load and Display Animals
async function loadAnimals(filter = "all") {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to load animals");
    }
    allAnimals = await response.json(); // Store all animals
    displayAnimals(allAnimals, filter);
  } catch (error) {
    console.error("Error loading animals:", error);
    const gallery = document.getElementById("animal-cards");
    if (gallery) {
      gallery.innerHTML = `<p class="error">Error loading animals: ${error.message}</p>`;
    }
  }
}

// Display Animals in Gallery
function displayAnimals(animals, filter = "all") {
  if (!animalCards) return;

  const filteredAnimals =
    filter === "all"
      ? animals
      : animals.filter((animal) => animal.type === filter);

  if (filteredAnimals.length === 0) {
    animalCards.innerHTML = `<div class="no-results-container">
        <i class="fas fa-search fa-3x no-results-icon"></i>
        <h3 class="no-results-title">No Animals Found</h3>
        <p class="no-results-message">We couldn't find any animals matching your criteria.</p>
      </div>`;
    return;
  }

  animalCards.innerHTML = filteredAnimals
    .map(
      (animal) => `
        <div class="animal-card" data-id="${animal._id}">
            <img src="${animal.image}" 
                 alt="${animal.name}"
                 onerror="this.src='https://via.placeholder.com/200?text=Image+Not+Found'">
            <h3>${animal.name}</h3>
            <p>${animal.type}</p>
        </div>
    `
    )
    .join("");

  // Add click event to each card
  filteredAnimals.forEach((animal) => {
    const card = document.querySelector(
      `.animal-card[data-id="${animal._id}"]`
    );
    if (card) {
      card.addEventListener("click", () => showAnimalDetails(animal));
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
  animalModal.classList.remove("hidden");
}

// Delete Animal
async function deleteAnimal(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete animal");
    }

    alert("Animal deleted successfully!");
    await loadAnimals();
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
  }
}

// Initialize the gallery application
function initGallery() {
  // Search functionality
  searchBtn.addEventListener("click", searchAnimals);
  
  animalSearch.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      searchAnimals();
    }
  });
  
  clearSearch.addEventListener("click", () => {
    animalSearch.value = "";
    displayAnimals(allAnimals);
    clearSearch.classList.add("hidden");
  });

  // Filter button event listeners
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      loadAnimals(this.dataset.filter);
    });
  });

  // Close modal buttons
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      animalModal.classList.add("hidden");
    });
  });

  updateClose.addEventListener("click", () => {
    updateModal.classList.add("hidden");
  });

  // Delete button in modal
  deleteBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this animal?")) {
      await deleteAnimal(currentAnimalId);
      animalModal.classList.add("hidden");
    }
  });

  // Update button in modal
  updateBtn.addEventListener("click", () => {
    if (!currentAnimalId) return;

    // Populate the update form
    document.getElementById("update-id").value = currentAnimalId;
    document.getElementById("update-image").value = modalImage.src;
    document.getElementById("update-name").value = modalName.textContent;
    document.getElementById("update-type").value = modalType.textContent;
    document.getElementById("update-description").value = modalDescription.textContent;

    // Switch modals
    animalModal.classList.add("hidden");
    updateModal.classList.remove("hidden");
  });

  // Update form submission
  updateForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("update-id").value;
    const image = document.getElementById("update-image").value;
    const name = document.getElementById("update-name").value;
    const type = document.getElementById("update-type").value;
    const description = document.getElementById("update-description").value;

    // Validate form values
    if (!image || !name || !type || !description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      new URL(image);
    } catch (e) {
      alert("Please enter a valid image URL");
      return;
    }

    const updatedData = {
      image,
      name,
      type,
      description,
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update animal");
      }

      alert("Animal updated successfully!");
      updateModal.classList.add("hidden");
      await loadAnimals();
    } catch (error) {
      console.error("Error updating animal:", error);
      alert(`Error: ${error.message}`);
    }
  });

  // Load animals
  loadAnimals();
}

// Initialize the gallery when DOM is loaded
document.addEventListener("DOMContentLoaded", initGallery);