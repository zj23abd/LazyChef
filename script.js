// --- DOM Elements ---
const recipeContainer = document.getElementById("recipeContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const randomBtn = document.getElementById("randomBtn");

// --- Modal Elements ---
const modal = document.getElementById("recipeModal");
const modalTitle = document.getElementById("modalTitle");
const modalInfo = document.getElementById("modalInfo");
const modalIngredients = document.getElementById("modalIngredients");
const modalInstructions = document.getElementById("modalInstructions");
const closeBtn = document.querySelector(".closeBtn");

closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if(e.target === modal) modal.style.display = "none"; });

// --- Spoonacular API Key ---
const API_KEY = "a1727a55ca294656a055d1ea61d68425";

// --- Fetch Recipes by Keywords ---
async function fetchRecipes(query) {
    try {
        // Replace commas with '+' for multiple keywords
        const formattedQuery = query.split(",").map(k => k.trim()).join("+");
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${formattedQuery}&addRecipeInformation=true&number=12&apiKey=${API_KEY}`);
        const data = await response.json();
        if (data.results) displayRecipes(data.results);
        else recipeContainer.innerHTML = "<p>No recipes found.</p>";
    } catch (err) {
        console.error(err);
        recipeContainer.innerHTML = "<p>Error loading recipes.</p>";
    }
}

// --- Fetch Random Recipes ---
async function fetchRandomRecipes() {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/random?number=12&apiKey=${API_KEY}`);
        const data = await response.json();
        if (data.recipes) displayRecipes(data.recipes);
        else recipeContainer.innerHTML = "<p>No recipes found.</p>";
    } catch(err) {
        console.error(err);
        recipeContainer.innerHTML = "<p>Error loading recipes.</p>";
    }
}

// --- Display Recipes on Page ---
function displayRecipes(recipes) {
    recipeContainer.innerHTML = "";
    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "recipeCard";

        const prepTime = recipe.readyInMinutes ? `${recipe.readyInMinutes} mins` : "N/A";

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipeInfo">
                <h3>${recipe.title}</h3>
                <p>Ready in ${prepTime} | Servings: ${recipe.servings || "N/A"}</p>
            </div>
        `;

        // --- Modal Event ---
        card.addEventListener("click", () => {
            modalTitle.textContent = recipe.title;
            modalInfo.textContent = `Ready in ${prepTime} | Servings: ${recipe.servings || "N/A"}`;

            // Ingredients
            modalIngredients.innerHTML = "";
            if (recipe.extendedIngredients) {
                recipe.extendedIngredients.forEach(ing => {
                    const li = document.createElement("li");
                    li.textContent = ing.original;
                    modalIngredients.appendChild(li);
                });
            }

            // Instructions
            modalInstructions.innerHTML = "";
            if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
                recipe.analyzedInstructions[0].steps.forEach(step => {
                    const li = document.createElement("li");
                    li.textContent = step.step;
                    modalInstructions.appendChild(li);
                });
            } else {
                modalInstructions.innerHTML = "<li>Instructions not available.</li>";
            }

            modal.style.display = "block";
        });

        recipeContainer.appendChild(card);
    });
}

// --- Event Listeners ---
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if(query) fetchRecipes(query);
});

randomBtn.addEventListener("click", fetchRandomRecipes);

// --- Initial Load ---
fetchRandomRecipes();
