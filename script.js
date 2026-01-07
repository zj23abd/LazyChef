// --------- SET YOUR API KEY HERE ----------
const API_KEY = "YOUR_API_KEY"; // Replace with your Spoonacular API key

const searchInput = document.getElementById("searchInput");
const recipeContainer = document.getElementById("recipeContainer");
const randomBtn = document.getElementById("randomBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

// Function to fetch recipes based on keywords (comma-separated)
async function fetchRecipes() {
    let query = searchInput.value.trim();
    if (!query) {
        alert("Please enter some keywords!");
        return;
    }

    query = query.split(",").map(k => k.trim()).join(",");

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=12&addRecipeInformation=true&apiKey=${API_KEY}`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            recipeContainer.innerHTML = "<p>No recipes found. Try different keywords.</p>";
            return;
        }

        displayRecipes(data.results);
    } catch (error) {
        recipeContainer.innerHTML = "<p>Error loading recipes. Try again later.</p>";
        console.error(error);
    }
}

// Function to fetch random recipes
async function fetchRandomRecipes() {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/random?number=12&apiKey=${API_KEY}`);
        const data = await response.json();
        displayRecipes(data.recipes);
    } catch (error) {
        recipeContainer.innerHTML = "<p>Error loading random recipes. Try again later.</p>";
        console.error(error);
    }
}

// Function to display recipes
function displayRecipes(recipes) {
    recipeContainer.innerHTML = "";
    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("recipeCard");

        // Use readyInMinutes fallback
        const prepTime = recipe.readyInMinutes ? `${recipe.readyInMinutes} mins` : "N/A";

        // Create card HTML
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipeInfo">
                <h3>${recipe.title}</h3>
                <p>Ready in ${prepTime} | Servings: ${recipe.servings || "N/A"}</p>
            </div>
        `;

        // Make card clickable, open full recipe in new tab
        card.addEventListener("click", () => {
            // Some recipes have sourceUrl, some use Spoonacular page
            const recipeUrl = recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}`;
            window.open(recipeUrl, "_blank");
        });

        recipeContainer.appendChild(card);
    });
}

// Dark mode toggle
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Event listeners
searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") fetchRecipes();
});

randomBtn.addEventListener("click", fetchRandomRecipes);
