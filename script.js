const recipes = [
    {
        name: "Chicken Pasta",
        ingredients: ["Chicken", "Pasta", "Garlic", "Oil"],
        steps: [
            "Boil pasta",
            "Cook chicken",
            "Mix everything"
        ]
    },
    {
        name: "Egg Fried Rice",
        ingredients: ["Rice", "Eggs", "Oil", "Salt"],
        steps: [
            "Cook rice",
            "Scramble eggs",
            "Mix together"
        ]
    },
    {
        name: "Cheese Omelette",
        ingredients: ["Eggs", "Cheese", "Butter"],
        steps: [
            "Beat eggs",
            "Cook eggs",
            "Add cheese"
        ]
    }
];

const recipeContainer = document.getElementById("recipeContainer");
const searchInput = document.getElementById("searchInput");

function displayRecipes(recipeList) {
    recipeContainer.innerHTML = "";

    recipeList.forEach(recipe => {
        const div = document.createElement("div");
        div.className = "recipe";

        div.innerHTML = `
            <h3>${recipe.name}</h3>
            <strong>Ingredients:</strong>
            <ul>
                ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
            </ul>
            <strong>Steps:</strong>
            <ol>
                ${recipe.steps.map(s => `<li>${s}</li>`).join("")}
            </ol>
        `;

        recipeContainer.appendChild(div);
    });
}

searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const filtered = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(value)
    );
    displayRecipes(filtered);
});

displayRecipes(recipes);
