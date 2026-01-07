const recipeContainer = document.getElementById("recipeContainer");
const searchInput = document.getElementById("searchInput");

const API_KEY = "a1727a55ca294656a055d1ea61d68425";

async function fetchRecipes(keywords) {
    const query = keywords.join(",");
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&addRecipeInformation=true&apiKey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    displayRecipes(data.results);
}

function displayRecipes(recipes) {
    recipeContainer.innerHTML = "";

    if (!recipes || recipes.length === 0) {
        recipeContainer.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    recipes.forEach(recipe => {
        const div = document.createElement("div");
        div.className = "recipe";

        div.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
            <img src="${recipe.image}" width="100%" alt="${recipe.title}">
            <a href="${recipe.sourceUrl}" target="_blank">View full recipe</a>
        `;

        recipeContainer.appendChild(div);
    });
}

searchInput.addEventListener("change", () => {
    const keywords = searchInput.value
        .split(",")
        .map(k => k.trim())
        .filter(k => k.length > 0);

    if (keywords.length > 0) {
        fetchRecipes(keywords);
    }
});
