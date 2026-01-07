// LazyChef JavaScript

// Grab DOM elements
const searchInput = document.getElementById('searchInput');
const recipeContainer = document.getElementById('recipeContainer');
const randomBtn = document.getElementById('randomBtn');
const darkModeBtn = document.getElementById('darkModeBtn');

// ---- SEARCH FUNCTIONALITY ----
// Trigger search when Enter is pressed
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        fetchRecipes(query);
    }
});

// Fetch recipes from Spoonacular API using multiple keywords
async function fetchRecipes(query) {
    // Show loader while fetching
    recipeContainer.innerHTML = '<div class="loader"></div>';

    // Allow multiple comma-separated keywords
    const keywords = query.split(',').map(k => k.trim()).join(',');

    try {
        // Replace 'YOUR_API_KEY' with your Spoonacular API key
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${keywords}&number=10&apiKey=a1727a55ca294656a055d1ea61d68425`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            recipeContainer.innerHTML = '<p>No recipes found 😢</p>';
            return;
        }

        displayRecipes(data.results);
    } catch (err) {
        recipeContainer.innerHTML = '<p>Error fetching recipes 😢</p>';
        console.error(err);
    }
}

// ---- DISPLAY RECIPES ----
function displayRecipes(recipes) {
    recipeContainer.innerHTML = ''; // Clear previous recipes
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe';
        card.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p>Ready in ${recipe.readyInMinutes || 'N/A'} mins</p>
            <a href="https://spoonacular.com/recipes/${recipe.title.replaceAll(' ', '-')}-${recipe.id}" target="_blank">View Recipe</a>
        `;
        recipeContainer.appendChild(card);
    });
}

// ---- RANDOM RECIPE BUTTON ----
randomBtn.addEventListener('click', async () => {
    recipeContainer.innerHTML = '<div class="loader"></div>';

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/random?number=5&apiKey=YOUR_API_KEY`);
        const data = await response.json();
        displayRecipes(data.recipes);
    } catch (err) {
        recipeContainer.innerHTML = '<p>Error fetching random recipes 😢</p>';
        console.error(err);
    }
});

// ---- DARK MODE TOGGLE ----
darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
