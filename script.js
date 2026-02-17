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
const API_KEY = "d0482b3e7cf3461f897080557de409ec";

// --- Local fallback recipes ---
const localRecipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    image: "images/carbonara.jpg",
    readyInMinutes: 20,
    servings: 2,
    calories: 520,
    extendedIngredients: [
      "Spaghetti - 200g",
      "Eggs - 2",
      "Parmesan cheese - 50g",
      "Bacon - 100g",
      "Black pepper - to taste"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Cook spaghetti in boiling water until al dente." },
        { step: "Fry bacon until crisp." },
        { step: "Mix eggs and cheese in a bowl." },
        { step: "Combine spaghetti, bacon, and egg mixture off heat." },
        { step: "Season with black pepper and serve." }
      ]}
    ]
  },
  {
    id: 2,
    title: "Chicken Stir Fry",
    image: "images/stirfry.jpg",
    readyInMinutes: 15,
    servings: 2,
    calories: 400,
    extendedIngredients: [
      "Chicken breast - 200g",
      "Mixed vegetables - 150g",
      "Soy sauce - 2 tbsp",
      "Garlic - 1 clove",
      "Olive oil - 1 tbsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Cut chicken into small strips and vegetables into pieces." },
        { step: "Heat oil in a pan and sauté garlic for 1 min." },
        { step: "Add chicken and cook until lightly browned." },
        { step: "Add vegetables and soy sauce, stir fry 5-7 min." },
        { step: "Serve hot." }
      ]}
    ]
  },
  {
    id: 3,
    title: "Omelette",
    image: "images/omelette.jpg",
    readyInMinutes: 10,
    servings: 1,
    calories: 250,
    extendedIngredients: [
      "Eggs - 2",
      "Milk - 2 tbsp",
      "Cheese - 30g",
      "Salt & Pepper - to taste"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Beat eggs with milk, salt, and pepper." },
        { step: "Heat a non-stick pan and pour in egg mixture." },
        { step: "Cook for 2-3 min, sprinkle cheese, fold omelette." },
        { step: "Serve immediately." }
      ]}
    ]
  },
  {
    id: 4,
    title: "Grilled Cheese Sandwich",
    image: "images/grilledcheese.jpg",
    readyInMinutes: 8,
    servings: 1,
    calories: 320,
    extendedIngredients: [
      "Bread slices - 2",
      "Cheddar cheese - 2 slices",
      "Butter - 1 tbsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Butter the bread slices." },
        { step: "Place cheese between slices." },
        { step: "Grill on pan until golden brown on both sides." },
        { step: "Serve hot." }
      ]}
    ]
  },
  {
    id: 5,
    title: "Banana Smoothie",
    image: "images/bananasmoothie.jpg",
    readyInMinutes: 5,
    servings: 1,
    calories: 180,
    extendedIngredients: [
      "Banana - 1",
      "Milk - 200ml",
      "Honey - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Peel banana and cut into pieces." },
        { step: "Add banana, milk, and honey to blender." },
        { step: "Blend until smooth and creamy." },
        { step: "Serve chilled." }
      ]}
    ]
  },
  {
    id: 6,
    title: "Chicken Wrap",
    image: "images/chickenwrap.jpg",
    readyInMinutes: 15,
    servings: 1,
    calories: 350,
    extendedIngredients: [
      "Tortilla wrap - 1",
      "Cooked chicken - 100g",
      "Lettuce - 30g",
      "Tomato - 1",
      "Mayonnaise - 1 tbsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Lay tortilla flat and spread mayonnaise." },
        { step: "Add chicken, lettuce, and tomato." },
        { step: "Roll wrap tightly and cut in half." },
        { step: "Serve immediately." }
      ]}
    ]
  },
  {
    id: 7,
    title: "Fruit Salad",
    image: "images/fruitsalad.jpg",
    readyInMinutes: 10,
    servings: 2,
    calories: 150,
    extendedIngredients: [
      "Apple - 1",
      "Orange - 1",
      "Banana - 1",
      "Grapes - 50g",
      "Honey - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Chop all fruits into bite-sized pieces." },
        { step: "Mix fruits in a bowl, drizzle with honey." },
        { step: "Serve fresh." }
      ]}
    ]
  },
  {
    id: 8,
    title: "Pancakes",
    image: "images/pancakes.jpg",
    readyInMinutes: 15,
    servings: 2,
    calories: 300,
    extendedIngredients: [
      "Flour - 100g",
      "Milk - 100ml",
      "Egg - 1",
      "Baking powder - 1 tsp",
      "Sugar - 1 tbsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Mix flour, milk, egg, baking powder, and sugar." },
        { step: "Heat a pan and pour batter to form pancakes." },
        { step: "Cook until bubbles form, flip and cook other side." },
        { step: "Serve with syrup or fruit." }
      ]}
    ]
  },
  {
    id: 9,
    title: "Tomato Soup",
    image: "images/tomatosoup.jpg",
    readyInMinutes: 20,
    servings: 2,
    calories: 180,
    extendedIngredients: [
      "Tomatoes - 400g",
      "Onion - 1",
      "Garlic - 1 clove",
      "Vegetable broth - 300ml",
      "Salt & Pepper - to taste"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Chop tomatoes, onion, and garlic." },
        { step: "Sauté onion and garlic in a pot for 2 min." },
        { step: "Add tomatoes and broth, simmer 10 min." },
        { step: "Blend until smooth, season and serve." }
      ]}
    ]
  },
  {
    id: 10,
    title: "Chocolate Mug Cake",
    image: "images/mugcake.jpg",
    readyInMinutes: 5,
    servings: 1,
    calories: 350,
    extendedIngredients: [
      "Flour - 4 tbsp",
      "Sugar - 3 tbsp",
      "Cocoa powder - 2 tbsp",
      "Milk - 3 tbsp",
      "Butter - 1 tbsp",
      "Egg - 1"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Mix all ingredients in a mug." },
        { step: "Microwave for 90 seconds." },
        { step: "Let cool slightly and serve." }
      ]}
    ]
  },
  {
    id: 11,
    title: "Avocado Toast",
    image: "images/avocadotoast.jpg",
    readyInMinutes: 5,
    servings: 1,
    calories: 220,
    extendedIngredients: [
      "Bread slice - 1",
      "Avocado - 1/2",
      "Salt & Pepper - to taste",
      "Lemon juice - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Toast the bread slice." },
        { step: "Mash avocado and mix with salt, pepper, and lemon juice." },
        { step: "Spread on toast and serve." }
      ]}
    ]
  },
  {
    id: 12,
    title: "Yogurt Parfait",
    image: "images/yogurtparfait.jpg",
    readyInMinutes: 5,
    servings: 1,
    calories: 200,
    extendedIngredients: [
      "Yogurt - 150g",
      "Granola - 30g",
      "Berries - 50g",
      "Honey - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Layer yogurt, granola, and berries in a cup." },
        { step: "Drizzle honey on top and serve." }
      ]}
    ]
  },
  /* --- DESSERTS (6) --- */
  {
    id: 13,
    title: "Berry Chia Pudding",
    image: "images/berrychiapudding.jpg",
    readyInMinutes: 5,
    servings: 1,
    calories: 180,
    extendedIngredients: [
      "Chia seeds - 3 tbsp",
      "Almond milk - 200ml",
      "Mixed berries - 50g",
      "Honey - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Mix chia seeds with almond milk in a bowl." },
        { step: "Let it sit for 5 min to thicken." },
        { step: "Top with mixed berries and drizzle honey." },
        { step: "Serve chilled." }
      ]}
    ]
  },
  {
    id: 14,
    title: "Frozen Yogurt Bites",
    image: "images/frozenyogurtbites.jpg",
    readyInMinutes: 10,
    servings: 2,
    calories: 120,
    extendedIngredients: [
      "Yogurt - 100g",
      "Strawberries - 5",
      "Honey - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Slice strawberries in halves." },
        { step: "Dip each half in yogurt and place on tray." },
        { step: "Drizzle honey over the top." },
        { step: "Freeze for 5-10 minutes and serve." }
      ]}
    ]
  },
  {
    id: 15,
    title: "Apple Cinnamon Cups",
    image: "images/applecinnamon.jpg",
    readyInMinutes: 15,
    servings: 2,
    calories: 150,
    extendedIngredients: [
      "Apple - 1",
      "Cinnamon - 1 tsp",
      "Oats - 20g",
      "Honey - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Core apple and cut into thick rings." },
        { step: "Sprinkle cinnamon and oats over rings." },
        { step: "Drizzle honey and bake at 180°C for 10 min." },
        { step: "Serve warm." }
      ]}
    ]
  },
  {
    id: 16,
    title: "Banana Ice Cream",
    image: "images/bananaicecream.jpg",
    readyInMinutes: 5,
    servings: 1,
    calories: 120,
    extendedIngredients: [
      "Banana - 1",
      "Vanilla extract - 1/4 tsp",
      "Almond milk - 1 tbsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Slice banana and freeze for 1 hour." },
        { step: "Blend frozen banana with almond milk and vanilla until creamy." },
        { step: "Serve immediately." }
      ]}
    ]
  },
  {
    id: 17,
    title: "Cocoa Energy Balls",
    image: "images/cocoaenergyballs.jpg",
    readyInMinutes: 10,
    servings: 4,
    calories: 90,
    extendedIngredients: [
      "Oats - 30g",
      "Cocoa powder - 1 tbsp",
      "Peanut butter - 1 tbsp",
      "Honey - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Mix all ingredients in a bowl." },
        { step: "Roll mixture into small balls." },
        { step: "Chill in fridge for 5 min before serving." }
      ]}
    ]
  },
  {
    id: 18,
    title: "Mango Yogurt Parfait",
    image: "images/mangoyogurtparfait.jpg",
    readyInMinutes: 5,
    servings: 1,
    calories: 180,
    extendedIngredients: [
      "Yogurt - 100g",
      "Mango - 50g",
      "Granola - 20g",
      "Honey - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Layer yogurt and diced mango in a cup." },
        { step: "Sprinkle granola and drizzle honey on top." },
        { step: "Serve immediately." }
      ]}
    ]
  },

  /* --- QUICK SNACKS (4) --- */
  {
    id: 19,
    title: "Veggie Sticks with Hummus",
    image: "images/veggiesticks.jpg",
    readyInMinutes: 5,
    servings: 1,
    calories: 120,
    extendedIngredients: [
      "Carrot sticks - 50g",
      "Cucumber sticks - 50g",
      "Hummus - 2 tbsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Wash and cut vegetables into sticks." },
        { step: "Serve with hummus for dipping." }
      ]}
    ]
  },
  {
    id: 20,
    title: "Avocado Rice Cakes",
    image: "images/avocadoricecake.jpg",
    readyInMinutes: 5,
    servings: 1,
    calories: 150,
    extendedIngredients: [
      "Rice cakes - 2",
      "Avocado - 1/2",
      "Salt & Pepper - to taste",
      "Lemon juice - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Mash avocado with salt, pepper, and lemon juice." },
        { step: "Spread over rice cakes and serve." }
      ]}
    ]
  },
  {
    id: 21,
    title: "Mini Caprese Skewers",
    image: "images/capreseskewers.jpg",
    readyInMinutes: 10,
    servings: 2,
    calories: 130,
    extendedIngredients: [
      "Cherry tomatoes - 6",
      "Mozzarella balls - 6",
      "Basil leaves - 6",
      "Balsamic glaze - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Skewer tomato, basil, and mozzarella alternately." },
        { step: "Drizzle balsamic glaze and serve." }
      ]}
    ]
  },
  {
    id: 22,
    title: "Peanut Butter Banana Toast",
    image: "images/peanutbutterbanana.jpg",
    readyInMinutes: 5,
    servings: 1,
    calories: 200,
    extendedIngredients: [
      "Bread slice - 1",
      "Peanut butter - 1 tbsp",
      "Banana - 1/2"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Toast bread slice lightly." },
        { step: "Spread peanut butter and top with banana slices." },
        { step: "Serve immediately." }
      ]}
    ]
  },

  /* --- MAIN MEALS (8) --- */
  {
    id: 23,
    title: "Quinoa Salad Bowl",
    image: "images/quinoasalad.jpg",
    readyInMinutes: 15,
    servings: 2,
    calories: 320,
    extendedIngredients: [
      "Quinoa - 80g",
      "Cherry tomatoes - 50g",
      "Cucumber - 50g",
      "Feta cheese - 30g",
      "Olive oil - 1 tsp",
      "Lemon juice - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Cook quinoa according to package instructions." },
        { step: "Chop vegetables and mix with feta." },
        { step: "Add quinoa, olive oil, and lemon juice. Toss well." },
        { step: "Serve chilled or warm." }
      ]}
    ]
  },
  {
    id: 24,
    title: "Zucchini Noodles with Pesto",
    image: "images/zucchininoodles.jpg",
    readyInMinutes: 15,
    servings: 2,
    calories: 280,
    extendedIngredients: [
      "Zucchini - 2",
      "Pesto sauce - 2 tbsp",
      "Cherry tomatoes - 50g",
      "Olive oil - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Spiralize zucchini into noodles." },
        { step: "Sauté tomatoes in olive oil for 2 min." },
        { step: "Add zucchini noodles and pesto, cook 3-4 min." },
        { step: "Serve warm." }
      ]}
    ]
  },
  {
    id: 25,
    title: "Baked Salmon with Veggies",
    image: "images/bakedsalmon.jpg",
    readyInMinutes: 20,
    servings: 2,
    calories: 350,
    extendedIngredients: [
      "Salmon fillets - 2",
      "Broccoli - 100g",
      "Carrots - 50g",
      "Lemon - 1",
      "Olive oil - 1 tsp",
      "Salt & Pepper - to taste"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Preheat oven to 180°C." },
        { step: "Place salmon and veggies on tray, drizzle olive oil and lemon." },
        { step: "Bake for 15 min until salmon is cooked." },
        { step: "Season and serve hot." }
      ]}
    ]
  },
  {
    id: 26,
    title: "Turkey Lettuce Wraps",
    image: "images/turkeylettucewrap.jpg",
    readyInMinutes: 15,
    servings: 2,
    calories: 300,
    extendedIngredients: [
      "Ground turkey - 150g",
      "Lettuce leaves - 4",
      "Carrot - 30g",
      "Soy sauce - 1 tbsp",
      "Garlic - 1 clove"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Cook turkey with garlic and soy sauce until browned." },
        { step: "Chop carrot and add to cooked turkey." },
        { step: "Scoop turkey mixture onto lettuce leaves." },
        { step: "Wrap and serve immediately." }
      ]}
    ]
  },
  {
    id: 27,
    title: "Stuffed Bell Peppers",
    image: "images/stuffedpeppers.jpg",
    readyInMinutes: 25,
    servings: 2,
    calories: 320,
    extendedIngredients: [
      "Bell peppers - 2",
      "Quinoa - 50g",
      "Black beans - 50g",
      "Tomato sauce - 2 tbsp",
      "Cheese - 20g"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Cook quinoa and mix with beans and tomato sauce." },
        { step: "Cut tops off peppers and remove seeds." },
        { step: "Stuff peppers with mixture and top with cheese." },
        { step: "Bake at 180°C for 15 min." }
      ]}
    ]
  },
  {
    id: 28,
    title: "Shrimp & Veggie Stir Fry",
    image: "images/shrimpstirfry.jpg",
    readyInMinutes: 15,
    servings: 2,
    calories: 280,
    extendedIngredients: [
      "Shrimp - 150g",
      "Mixed vegetables - 100g",
      "Garlic - 1 clove",
      "Soy sauce - 1 tbsp",
      "Olive oil - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Heat oil in pan and sauté garlic." },
        { step: "Add shrimp and cook until pink." },
        { step: "Add vegetables and soy sauce, stir fry 5 min." },
        { step: "Serve hot." }
      ]}
    ]
  },
  {
    id: 29,
    title: "Vegetable Frittata",
    image: "images/vegetablefrittata.jpg",
    readyInMinutes: 15,
    servings: 2,
    calories: 220,
    extendedIngredients: [
      "Eggs - 3",
      "Spinach - 50g",
      "Tomatoes - 50g",
      "Onion - 1/2",
      "Olive oil - 1 tsp",
      "Salt & Pepper - to taste"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Preheat oven to 180°C." },
        { step: "Sauté onion, spinach, and tomatoes in olive oil." },
        { step: "Beat eggs and pour over vegetables." },
        { step: "Bake for 10-12 min until eggs set." },
        { step: "Serve warm." }
      ]}
    ]
  },
  {
    id: 30,
    title: "Chicken & Quinoa Bowl",
    image: "images/chickenquinoabowl.jpg",
    readyInMinutes: 20,
    servings: 2,
    calories: 340,
    extendedIngredients: [
      "Chicken breast - 150g",
      "Quinoa - 70g",
      "Broccoli - 50g",
      "Carrot - 50g",
      "Soy sauce - 1 tbsp",
      "Olive oil - 1 tsp"
    ],
    analyzedInstructions: [
      { steps: [
        { step: "Cook quinoa according to instructions." },
        { step: "Sauté chicken in olive oil until cooked." },
        { step: "Steam broccoli and carrots for 3-4 min." },
        { step: "Mix all ingredients and drizzle soy sauce." },
        { step: "Serve warm." }
      ]}
    ]
  }
];

// --- Pagination ---
let currentPage = 1;
const recipesPerPage = 6;
let currentRecipes = [];
let currentKeywords = []; // <-- new global for search keywords

function displayPage(page) {
    const start = (page - 1) * recipesPerPage;
    const end = start + recipesPerPage;
    displayRecipes(currentRecipes.slice(start, end), currentKeywords); // pass keywords for badges
    renderPagination(currentRecipes.length, page);
}

function renderPagination(totalRecipes, page) {
    let paginationContainer = document.getElementById("paginationContainer");
    if(!paginationContainer){
        paginationContainer = document.createElement("div");
        paginationContainer.id = "paginationContainer";
        paginationContainer.style.textAlign = "center";
        paginationContainer.style.margin = "20px 0";
        recipeContainer.parentNode.insertBefore(paginationContainer, recipeContainer.nextSibling);
    }

    const totalPages = Math.ceil(totalRecipes / recipesPerPage);
    paginationContainer.innerHTML = "";

    if(totalPages <= 1) return;

    if(page > 1){
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Previous";
        prevBtn.className = "paginationBtn";
        prevBtn.onclick = () => { currentPage--; displayPage(currentPage); };
        paginationContainer.appendChild(prevBtn);
    }

    if(page < totalPages){
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.className = "paginationBtn";
        nextBtn.onclick = () => { currentPage++; displayPage(currentPage); };
        paginationContainer.appendChild(nextBtn);
    }
}

// --- Helper: Display recipes ---
function displayRecipes(recipes, keywords=[]) {
    recipeContainer.innerHTML = "";

    recipes.forEach((recipe, i) => {
        const card = document.createElement("div");
        card.className = "recipeCard";
        setTimeout(() => card.classList.add("show"), i * 100);

        const prepTime = recipe.readyInMinutes ? `${recipe.readyInMinutes} mins` : "N/A";
        const calories = recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || recipe.calories || "N/A";

        // Count keyword matches for badge
        let matchCount = 0;
        if(keywords.length) {
            const allText = [
                recipe.title.toLowerCase(),
                ...(recipe.extendedIngredients?.map(ing => typeof ing === "string" ? ing.toLowerCase() : ing.original?.toLowerCase() || "") || [])
            ].join(" ");
            matchCount = keywords.filter(k => allText.includes(k)).length;
        }

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipeInfo">
                <h3>${recipe.title} ${matchCount ? `<span class="badge">${matchCount}</span>` : ""}</h3>
                <p>Ready in ${prepTime} | Servings: ${recipe.servings || "N/A"} | Calories: ${calories}</p>
            </div>
        `;

        card.addEventListener("click", async () => {
            try {
                let details = recipe;
                if (!recipe.extendedIngredients || !recipe.analyzedInstructions) {
                    const res = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`);
                    if(res.ok) details = await res.json();
                }

                const modalCalories = details.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || details.calories || "N/A";

                modalTitle.textContent = details.title;
                modalInfo.textContent = `Ready in ${details.readyInMinutes || "N/A"} mins | Servings: ${details.servings || "N/A"} | Calories: ${modalCalories}`;

                // Ingredients
                modalIngredients.innerHTML = "";
                if (details.extendedIngredients) {
                    details.extendedIngredients.forEach(ing => {
                        const li = document.createElement("li");
                        li.textContent = ing.original ? ing.original : ing;
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

// --- Fetch recipes from API or fallback to local ---
async function fetchRecipes(query="") {
    const cachedRecipes = localStorage.getItem("savedRecipes");
    let useLocal = false;
    let recipes = [];

    const keywords = query.toLowerCase().split(",").map(k => k.trim()).filter(k => k);
    currentKeywords = keywords; // store keywords globally for badges

    if(cachedRecipes && !query){
        recipes = JSON.parse(cachedRecipes);
    } else if(keywords.length){
        // Filter and prioritize local recipes
        const matches = localRecipes.map(r => {
            const allText = [
                r.title.toLowerCase(),
                ...(r.extendedIngredients?.map(ing => typeof ing === "string" ? ing.toLowerCase() : ing.original?.toLowerCase() || "") || [])
            ].join(" ");
            const matchedKeywords = keywords.filter(k => allText.includes(k));
            return { recipe: r, matchCount: matchedKeywords.length, firstKeywordMatch: allText.includes(keywords[0]) };
        });

        // Sort by priority: all keywords first, then partial matches, then first keyword
        matches.sort((a, b) => {
            if(a.matchCount === keywords.length && b.matchCount !== keywords.length) return -1;
            if(b.matchCount === keywords.length && a.matchCount !== keywords.length) return 1;
            if(b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
            if(a.firstKeywordMatch && !b.firstKeywordMatch) return -1;
            if(!a.firstKeywordMatch && b.firstKeywordMatch) return 1;
            return 0;
        });

        recipes = matches.map(m => m.recipe);
        useLocal = true;
    }

    try {
        if(!useLocal){
            const formattedQuery = query ? query.split(",").map(k => k.trim()).join("+") : "";
            const url = query 
                ? `https://api.spoonacular.com/recipes/complexSearch?query=${formattedQuery}&addRecipeInformation=true&number=12&apiKey=${API_KEY}`
                : `https://api.spoonacular.com/recipes/random?number=12&apiKey=${API_KEY}`;

            const res = await fetch(url);
            if(!res.ok) throw new Error("API not available or quota reached");
            const data = await res.json();
            recipes = data.results || data.recipes || [];

            if(!query) localStorage.setItem("savedRecipes", JSON.stringify(recipes));
        }

        currentRecipes = recipes;
        currentPage = 1;
        displayPage(currentPage);
    } catch(err) {
        console.error("API failed, using local recipes:", err);
        if(!recipes.length) recipes = localRecipes;
        currentRecipes = recipes;
        currentPage = 1;
        displayPage(currentPage);
    }
}

// --- Event Listeners ---
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    fetchRecipes(query);
});

searchInput.addEventListener("keypress", e => {
    if(e.key === "Enter") {
        e.preventDefault();
        const query = searchInput.value.trim();
        fetchRecipes(query);
    }
});

randomBtn.addEventListener("click", () => {
    if(localRecipes.length){
        const randIndex = Math.floor(Math.random() * localRecipes.length);
        currentRecipes = [localRecipes[randIndex]];
        currentKeywords = []; // reset keywords for badge
        currentPage = 1;
        displayPage(currentPage);
    }
});

// --- Initial Load ---
fetchRecipes();
