// --- DOM Elements ---
const recipeContainer = document.getElementById("recipeContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const randomBtn = document.getElementById("randomBtn");

// --- Modal ---
const modal = document.getElementById("recipeModal");
const modalTitle = document.getElementById("modalTitle");
const modalInfo = document.getElementById("modalInfo");
const modalIngredients = document.getElementById("modalIngredients");
const modalInstructions = document.getElementById("modalInstructions");
const closeBtn = document.querySelector(".closeBtn");

closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if(e.target === modal) modal.style.display = "none"; });

// --- API Key ---
const API_KEY = "4cacf89277db4859b90060e2d67f7fa4";

// --- Helper: Display recipes ---
function displayRecipes(recipes) {
    recipeContainer.innerHTML = "";

    recipes.forEach((recipe, i) => {
        const card = document.createElement("div");
        card.className = "recipeCard";
        setTimeout(() => card.classList.add("show"), i * 100); // stagger fade-in animation

        const prepTime = recipe.readyInMinutes ? `${recipe.readyInMinutes} mins` : "N/A";

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipeInfo">
                <h3>${recipe.title}</h3>
                <p>Ready in ${prepTime} | Servings: ${recipe.servings || "N/A"}</p>
            </div>
        `;

        // --- Modal Click Event ---
        card.addEventListener("click", async () => {
            try {
                // If extendedIngredients or instructions are missing, fetch full info
                let details = recipe;
                if (!recipe.extendedIngredients || !recipe.analyzedInstructions) {
                    const res = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`);
                    details = await res.json();
                }

                // Populate modal
                modalTitle.textContent = details.title;
                modalInfo.textContent = `Ready in ${details.readyInMinutes || "N/A"} mins | Servings: ${details.servings || "N/A"}`;

                // Ingredients
                modalIngredients.innerHTML = "";
                if (details.extendedIngredients) {
                    details.extendedIngredients.forEach(ing => {
                        const li = document.createElement("li");
                        li.textContent = ing.original;
                        modalIngredients.appendChild(li);
                    });
                }

                // Instructions
                modalInstructions.innerHTML = "";
                if (details.analyzedInstructions && details.analyzedInstructions.length > 0) {
                    details.analyzedInstructions[0].steps.forEach(step => {
                        const li = document.createElement("li");
                        li.textContent = step.step;
                        modalInstructions.appendChild(li);
                    });
                } else {
                    modalInstructions.innerHTML = "<li>Instructions not available.</li>";
                }

                modal.style.display = "block";
            } catch (error) {
                console.error(error);
                alert("Error loading recipe details.");
            }
        });

        recipeContainer.appendChild(card);
    });
}

// --- Fetch recipes from API ---
async function fetchRecipes(query="") {
    try {
        const formattedQuery = query ? query.split(",").map(k => k.trim()).join("+") : "";
        const url = query 
            ? `https://api.spoonacular.com/recipes/complexSearch?query=${formattedQuery}&addRecipeInformation=true&number=12&apiKey=${API_KEY}`
            : `https://api.spoonacular.com/recipes/random?number=12&apiKey=${API_KEY}`; // popular/random if no query

        const res = await fetch(url);
        const data = await res.json();
        const recipes = data.results || data.recipes || [];
        displayRecipes(recipes);
    } catch(err) {
        console.error(err);
        recipeContainer.innerHTML = "<p>Error loading recipes.</p>";
    }
}

// --- Event Listeners ---
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    fetchRecipes(query);
});

randomBtn.addEventListener("click", () => fetchRecipes());

// --- Initial Load ---
fetchRecipes(); // loads popular/random recipes automatically
