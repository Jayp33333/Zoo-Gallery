const API_URL = "http://localhost:3001/api/animals";

// Initialize the add animal form
function initAddAnimalForm() {
  const animalForm = document.getElementById("animal-form");
  
  if (animalForm) {
    animalForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const imageUrl = document.getElementById("image").value;
      const name = document.getElementById("name").value;
      const type = document.getElementById("type").value;
      const description = document.getElementById("description").value;

      if (!imageUrl || !name || !type || !description) {
        alert("Please fill in all fields");
        return;
      }

      try {
        new URL(imageUrl);
      } catch (e) {
        alert("Please enter a valid image URL");
        return;
      }

      const animalData = {
        image: imageUrl,
        name,
        type,
        description,
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(animalData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add animal");
        }

        alert("Animal added successfully!");
        this.reset();
        window.location.href = "gallery.html"; // Redirect to gallery page
      } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
      }
    });
  }
}

// Initialize the add animal page when DOM is loaded
document.addEventListener("DOMContentLoaded", initAddAnimalForm);