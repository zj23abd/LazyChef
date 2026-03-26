// ============================================================
// DOM Elements
// ============================================================
const recipeContainer = document.getElementById("recipeContainer");
const searchInput     = document.getElementById("searchInput");
const searchBtn       = document.getElementById("searchBtn");
const randomBtn       = document.getElementById("randomBtn");

// Modal
const modal            = document.getElementById("recipeModal");
const modalTitle       = document.getElementById("modalTitle");
const modalInfo        = document.getElementById("modalInfo");
const modalIngredients = document.getElementById("modalIngredients");
const modalInstructions= document.getElementById("modalInstructions");
const closeBtn         = document.querySelector(".closeBtn");

closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

// Allergen panel
const allergenToggleBtn = document.getElementById("allergenToggleBtn");
const allergenPanel     = document.getElementById("allergenPanel");
const noAllergenCheck   = document.getElementById("noAllergenCheck");
const allergenCheckboxes= document.querySelectorAll("#allergenGrid input[type='checkbox']");

// Pantry panel
const pantryToggleBtn   = document.getElementById("pantryToggleBtn");
const pantryPanel       = document.getElementById("pantryPanel");
const pantryInput       = document.getElementById("pantryInput");
const pantryAddBtn      = document.getElementById("pantryAddBtn");
const pantryChipsEl     = document.getElementById("pantryChips");
const pantryOnlyToggle  = document.getElementById("pantryOnlyToggle");
const pantryToggleLabel = document.getElementById("pantryToggleLabel");
const activeFiltersBar  = document.getElementById("activeFiltersBar");

// Favourites
const favouritesBtn     = document.getElementById("favouritesBtn");
const favouritesModal   = document.getElementById("favouritesModal");
const favouritesGrid    = document.getElementById("favouritesGrid");
const closeFavBtn       = document.querySelector(".closeFavBtn");

// Prep time filter
const prepTimeFilter    = document.getElementById("prepTimeFilter");

// Loading spinner
const loadingSpinner    = document.getElementById("loadingSpinner");

// ============================================================
// API Key
// ============================================================
const API_KEY = "76463530ea3a4a8db2e20642f0ddb8d2";

// ============================================================
// Storage keys & size limit
// ============================================================
const CACHE_KEY          = "lazychef_allRecipes";    // master cache (all API recipes ever fetched)
const SEARCH_CACHE_KEY   = "lazychef_searchCache";   // per-query search cache
const MAX_CACHE_BYTES    = 4.5 * 1024 * 1024;        // ~4.5 MB (localStorage limit is ~5 MB per origin)

// ============================================================
// Pantry state (persisted in localStorage)
// ============================================================
let pantryItems = JSON.parse(localStorage.getItem("lazychef_pantry") || "[]");

function savePantry() {
    localStorage.setItem("lazychef_pantry", JSON.stringify(pantryItems));
}

// ============================================================
// Allergen persistence
// ============================================================
function saveAllergens() {
    const state = {
        noAllergen: noAllergenCheck.checked,
        checked: Array.from(allergenCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value)
    };
    localStorage.setItem("lazychef_allergens", JSON.stringify(state));
}

function loadAllergens() {
    try {
        const raw = localStorage.getItem("lazychef_allergens");
        if (!raw) return;
        const state = JSON.parse(raw);
        if (state.noAllergen) {
            noAllergenCheck.checked = true;
            allergenCheckboxes.forEach(cb => { cb.disabled = true; cb.checked = false; });
        } else {
            state.checked.forEach(val => {
                const cb = document.querySelector(`#allergenGrid input[value="${val}"]`);
                if (cb) cb.checked = true;
            });
        }
    } catch { /* silent */ }
}

// ============================================================
// Favourites state (persisted in localStorage)
// ============================================================
let favourites = JSON.parse(localStorage.getItem("lazychef_favourites") || "[]");

function saveFavourites() {
    localStorage.setItem("lazychef_favourites", JSON.stringify(favourites));
}

function isFavourited(id) {
    return favourites.some(f => f.id === id);
}

function toggleFavourite(recipe) {
    if (isFavourited(recipe.id)) {
        favourites = favourites.filter(f => f.id !== recipe.id);
    } else {
        // Store just what we need to show it in the favourites modal
        favourites.push({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes,
            servings: recipe.servings,
            calories: recipe.calories || null,
            extendedIngredients: recipe.extendedIngredients || [],
            analyzedInstructions: recipe.analyzedInstructions || []
        });
    }
    saveFavourites();
}

// ============================================================
// Loading spinner helpers
// ============================================================
function showSpinner() { loadingSpinner.style.display = "flex"; }
function hideSpinner() { loadingSpinner.style.display = "none"; }

// ============================================================
// Local fallback recipes (unchanged)
// ============================================================
const localRecipes = [
  {
    id: 1, title: "Spaghetti Carbonara",
    image: "images/carbonara.jpg",
    readyInMinutes: 20, servings: 2, calories: 520,
    extendedIngredients: ["Spaghetti - 200g","Eggs - 2","Parmesan cheese - 50g","Bacon - 100g","Black pepper - to taste"],
    analyzedInstructions: [{steps:[
      {step:"Cook spaghetti in boiling water until al dente."},
      {step:"Fry bacon until crisp."},
      {step:"Mix eggs and cheese in a bowl."},
      {step:"Combine spaghetti, bacon, and egg mixture off heat."},
      {step:"Season with black pepper and serve."}
    ]}]
  },
  {
    id: 2, title: "Chicken Stir Fry",
    image: "images/stirfry.jpg",
    readyInMinutes: 15, servings: 2, calories: 400,
    extendedIngredients: ["Chicken breast - 200g","Mixed vegetables - 150g","Soy sauce - 2 tbsp","Garlic - 1 clove","Olive oil - 1 tbsp"],
    analyzedInstructions: [{steps:[
      {step:"Cut chicken into small strips and vegetables into pieces."},
      {step:"Heat oil in a pan and sauté garlic for 1 min."},
      {step:"Add chicken and cook until lightly browned."},
      {step:"Add vegetables and soy sauce, stir fry 5-7 min."},
      {step:"Serve hot."}
    ]}]
  },
  {
    id: 3, title: "Omelette",
    image: "images/omelette.jpg",
    readyInMinutes: 10, servings: 1, calories: 250,
    extendedIngredients: ["Eggs - 2","Milk - 2 tbsp","Cheese - 30g","Salt & Pepper - to taste"],
    analyzedInstructions: [{steps:[
      {step:"Beat eggs with milk, salt, and pepper."},
      {step:"Heat a non-stick pan and pour in egg mixture."},
      {step:"Cook for 2-3 min, sprinkle cheese, fold omelette."},
      {step:"Serve immediately."}
    ]}]
  },
  {
    id: 4, title: "Grilled Cheese Sandwich",
    image: "images/grilledcheese.jpg",
    readyInMinutes: 8, servings: 1, calories: 320,
    extendedIngredients: ["Bread slices - 2","Cheddar cheese - 2 slices","Butter - 1 tbsp"],
    analyzedInstructions: [{steps:[
      {step:"Butter the bread slices."},
      {step:"Place cheese between slices."},
      {step:"Grill on pan until golden brown on both sides."},
      {step:"Serve hot."}
    ]}]
  },
  {
    id: 5, title: "Banana Smoothie",
    image: "images/bananasmoothie.jpg",
    readyInMinutes: 5, servings: 1, calories: 180,
    extendedIngredients: ["Banana - 1","Milk - 200ml","Honey - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Peel banana and cut into pieces."},
      {step:"Add banana, milk, and honey to blender."},
      {step:"Blend until smooth and creamy."},
      {step:"Serve chilled."}
    ]}]
  },
  {
    id: 6, title: "Chicken Wrap",
    image: "images/chickenwrap.jpg",
    readyInMinutes: 15, servings: 1, calories: 350,
    extendedIngredients: ["Tortilla wrap - 1","Cooked chicken - 100g","Lettuce - 30g","Tomato - 1","Mayonnaise - 1 tbsp"],
    analyzedInstructions: [{steps:[
      {step:"Lay tortilla flat and spread mayonnaise."},
      {step:"Add chicken, lettuce, and tomato."},
      {step:"Roll wrap tightly and cut in half."},
      {step:"Serve immediately."}
    ]}]
  },
  {
    id: 7, title: "Fruit Salad",
    image: "images/fruitsalad.jpg",
    readyInMinutes: 10, servings: 2, calories: 150,
    extendedIngredients: ["Apple - 1","Orange - 1","Banana - 1","Grapes - 50g","Honey - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Chop all fruits into bite-sized pieces."},
      {step:"Mix fruits in a bowl, drizzle with honey."},
      {step:"Serve fresh."}
    ]}]
  },
  {
    id: 8, title: "Pancakes",
    image: "images/pancakes.jpg",
    readyInMinutes: 15, servings: 2, calories: 300,
    extendedIngredients: ["Flour - 100g","Milk - 100ml","Egg - 1","Baking powder - 1 tsp","Sugar - 1 tbsp"],
    analyzedInstructions: [{steps:[
      {step:"Mix flour, milk, egg, baking powder, and sugar."},
      {step:"Heat a pan and pour batter to form pancakes."},
      {step:"Cook until bubbles form, flip and cook other side."},
      {step:"Serve with syrup or fruit."}
    ]}]
  },
  {
    id: 9, title: "Tomato Soup",
    image: "images/tomatosoup.jpg",
    readyInMinutes: 20, servings: 2, calories: 180,
    extendedIngredients: ["Tomatoes - 400g","Onion - 1","Garlic - 1 clove","Vegetable broth - 300ml","Salt & Pepper - to taste"],
    analyzedInstructions: [{steps:[
      {step:"Chop tomatoes, onion, and garlic."},
      {step:"Sauté onion and garlic in a pot for 2 min."},
      {step:"Add tomatoes and broth, simmer 10 min."},
      {step:"Blend until smooth, season and serve."}
    ]}]
  },
  {
    id: 10, title: "Chocolate Mug Cake",
    image: "images/mugcake.jpg",
    readyInMinutes: 5, servings: 1, calories: 350,
    extendedIngredients: ["Flour - 4 tbsp","Sugar - 3 tbsp","Cocoa powder - 2 tbsp","Milk - 3 tbsp","Butter - 1 tbsp","Egg - 1"],
    analyzedInstructions: [{steps:[
      {step:"Mix all ingredients in a mug."},
      {step:"Microwave for 90 seconds."},
      {step:"Let cool slightly and serve."}
    ]}]
  },
  {
    id: 11, title: "Avocado Toast",
    image: "images/avocadotoast.jpg",
    readyInMinutes: 5, servings: 1, calories: 220,
    extendedIngredients: ["Bread slice - 1","Avocado - 1/2","Salt & Pepper - to taste","Lemon juice - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Toast the bread slice."},
      {step:"Mash avocado and mix with salt, pepper, and lemon juice."},
      {step:"Spread on toast and serve."}
    ]}]
  },
  {
    id: 12, title: "Yogurt Parfait",
    image: "images/yogurtparfait.jpg",
    readyInMinutes: 5, servings: 1, calories: 200,
    extendedIngredients: ["Yogurt - 150g","Granola - 30g","Berries - 50g","Honey - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Layer yogurt, granola, and berries in a cup."},
      {step:"Drizzle honey on top and serve."}
    ]}]
  },
  {
    id: 13, title: "Berry Chia Pudding",
    image: "images/berrychiapudding.jpg",
    readyInMinutes: 5, servings: 1, calories: 180,
    extendedIngredients: ["Chia seeds - 3 tbsp","Almond milk - 200ml","Mixed berries - 50g","Honey - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Mix chia seeds with almond milk in a bowl."},
      {step:"Let it sit for 5 min to thicken."},
      {step:"Top with mixed berries and drizzle honey."},
      {step:"Serve chilled."}
    ]}]
  },
  {
    id: 14, title: "Frozen Yogurt Bites",
    image: "images/frozenyogurtbites.jpg",
    readyInMinutes: 10, servings: 2, calories: 120,
    extendedIngredients: ["Yogurt - 100g","Strawberries - 5","Honey - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Slice strawberries in halves."},
      {step:"Dip each half in yogurt and place on tray."},
      {step:"Drizzle honey over the top."},
      {step:"Freeze for 5-10 minutes and serve."}
    ]}]
  },
  {
    id: 15, title: "Apple Cinnamon Cups",
    image: "images/applecinnamon.jpg",
    readyInMinutes: 15, servings: 2, calories: 150,
    extendedIngredients: ["Apple - 1","Cinnamon - 1 tsp","Oats - 20g","Honey - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Core apple and cut into thick rings."},
      {step:"Sprinkle cinnamon and oats over rings."},
      {step:"Drizzle honey and bake at 180°C for 10 min."},
      {step:"Serve warm."}
    ]}]
  },
  {
    id: 16, title: "Banana Ice Cream",
    image: "images/bananaicecream.jpg",
    readyInMinutes: 5, servings: 1, calories: 120,
    extendedIngredients: ["Banana - 1","Vanilla extract - 1/4 tsp","Almond milk - 1 tbsp"],
    analyzedInstructions: [{steps:[
      {step:"Slice banana and freeze for 1 hour."},
      {step:"Blend frozen banana with almond milk and vanilla until creamy."},
      {step:"Serve immediately."}
    ]}]
  },
  {
    id: 17, title: "Cocoa Energy Balls",
    image: "images/cocoaenergyballs.jpg",
    readyInMinutes: 10, servings: 4, calories: 90,
    extendedIngredients: ["Oats - 30g","Cocoa powder - 1 tbsp","Peanut butter - 1 tbsp","Honey - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Mix all ingredients in a bowl."},
      {step:"Roll mixture into small balls."},
      {step:"Chill in fridge for 5 min before serving."}
    ]}]
  },
  {
    id: 18, title: "Mango Yogurt Parfait",
    image: "images/mangoyogurtparfait.jpg",
    readyInMinutes: 5, servings: 1, calories: 180,
    extendedIngredients: ["Yogurt - 100g","Mango - 50g","Granola - 20g","Honey - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Layer yogurt and diced mango in a cup."},
      {step:"Sprinkle granola and drizzle honey on top."},
      {step:"Serve immediately."}
    ]}]
  },
  {
    id: 19, title: "Veggie Sticks with Hummus",
    image: "images/veggiesticks.jpg",
    readyInMinutes: 5, servings: 1, calories: 120,
    extendedIngredients: ["Carrot sticks - 50g","Cucumber sticks - 50g","Hummus - 2 tbsp"],
    analyzedInstructions: [{steps:[
      {step:"Wash and cut vegetables into sticks."},
      {step:"Serve with hummus for dipping."}
    ]}]
  },
  {
    id: 20, title: "Avocado Rice Cakes",
    image: "images/avocadoricecake.jpg",
    readyInMinutes: 5, servings: 1, calories: 150,
    extendedIngredients: ["Rice cakes - 2","Avocado - 1/2","Salt & Pepper - to taste","Lemon juice - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Mash avocado with salt, pepper, and lemon juice."},
      {step:"Spread over rice cakes and serve."}
    ]}]
  },
  {
    id: 21, title: "Mini Caprese Skewers",
    image: "images/capreseskewers.jpg",
    readyInMinutes: 10, servings: 2, calories: 130,
    extendedIngredients: ["Cherry tomatoes - 6","Mozzarella balls - 6","Basil leaves - 6","Balsamic glaze - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Skewer tomato, basil, and mozzarella alternately."},
      {step:"Drizzle balsamic glaze and serve."}
    ]}]
  },
  {
    id: 22, title: "Peanut Butter Banana Toast",
    image: "images/peanutbutterbanana.jpg",
    readyInMinutes: 5, servings: 1, calories: 200,
    extendedIngredients: ["Bread slice - 1","Peanut butter - 1 tbsp","Banana - 1/2"],
    analyzedInstructions: [{steps:[
      {step:"Toast bread slice lightly."},
      {step:"Spread peanut butter and top with banana slices."},
      {step:"Serve immediately."}
    ]}]
  },
  {
    id: 23, title: "Quinoa Salad Bowl",
    image: "images/quinoasalad.jpg",
    readyInMinutes: 15, servings: 2, calories: 320,
    extendedIngredients: ["Quinoa - 80g","Cherry tomatoes - 50g","Cucumber - 50g","Feta cheese - 30g","Olive oil - 1 tsp","Lemon juice - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Cook quinoa according to package instructions."},
      {step:"Chop vegetables and mix with feta."},
      {step:"Add quinoa, olive oil, and lemon juice. Toss well."},
      {step:"Serve chilled or warm."}
    ]}]
  },
  {
    id: 24, title: "Zucchini Noodles with Pesto",
    image: "images/zucchininoodles.jpg",
    readyInMinutes: 15, servings: 2, calories: 280,
    extendedIngredients: ["Zucchini - 2","Pesto sauce - 2 tbsp","Cherry tomatoes - 50g","Olive oil - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Spiralize zucchini into noodles."},
      {step:"Sauté tomatoes in olive oil for 2 min."},
      {step:"Add zucchini noodles and pesto, cook 3-4 min."},
      {step:"Serve warm."}
    ]}]
  },
  {
    id: 25, title: "Baked Salmon with Veggies",
    image: "images/bakedsalmon.jpg",
    readyInMinutes: 20, servings: 2, calories: 350,
    extendedIngredients: ["Salmon fillets - 2","Broccoli - 100g","Carrots - 50g","Lemon - 1","Olive oil - 1 tsp","Salt & Pepper - to taste"],
    analyzedInstructions: [{steps:[
      {step:"Preheat oven to 180°C."},
      {step:"Place salmon and veggies on tray, drizzle olive oil and lemon."},
      {step:"Bake for 15 min until salmon is cooked."},
      {step:"Season and serve hot."}
    ]}]
  },
  {
    id: 26, title: "Turkey Lettuce Wraps",
    image: "images/turkeylettucewrap.jpg",
    readyInMinutes: 15, servings: 2, calories: 300,
    extendedIngredients: ["Ground turkey - 150g","Lettuce leaves - 4","Carrot - 30g","Soy sauce - 1 tbsp","Garlic - 1 clove"],
    analyzedInstructions: [{steps:[
      {step:"Cook turkey with garlic and soy sauce until browned."},
      {step:"Chop carrot and add to cooked turkey."},
      {step:"Scoop turkey mixture onto lettuce leaves."},
      {step:"Wrap and serve immediately."}
    ]}]
  },
  {
    id: 27, title: "Stuffed Bell Peppers",
    image: "images/stuffedpeppers.jpg",
    readyInMinutes: 25, servings: 2, calories: 320,
    extendedIngredients: ["Bell peppers - 2","Quinoa - 50g","Black beans - 50g","Tomato sauce - 2 tbsp","Cheese - 20g"],
    analyzedInstructions: [{steps:[
      {step:"Cook quinoa and mix with beans and tomato sauce."},
      {step:"Cut tops off peppers and remove seeds."},
      {step:"Stuff peppers with mixture and top with cheese."},
      {step:"Bake at 180°C for 15 min."}
    ]}]
  },
  {
    id: 28, title: "Shrimp & Veggie Stir Fry",
    image: "images/shrimpstirfry.jpg",
    readyInMinutes: 15, servings: 2, calories: 280,
    extendedIngredients: ["Shrimp - 150g","Mixed vegetables - 100g","Garlic - 1 clove","Soy sauce - 1 tbsp","Olive oil - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Heat oil in pan and sauté garlic."},
      {step:"Add shrimp and cook until pink."},
      {step:"Add vegetables and soy sauce, stir fry 5 min."},
      {step:"Serve hot."}
    ]}]
  },
  {
    id: 29, title: "Vegetable Frittata",
    image: "images/vegetablefrittata.jpg",
    readyInMinutes: 15, servings: 2, calories: 220,
    extendedIngredients: ["Eggs - 3","Spinach - 50g","Tomatoes - 50g","Onion - 1/2","Olive oil - 1 tsp","Salt & Pepper - to taste"],
    analyzedInstructions: [{steps:[
      {step:"Preheat oven to 180°C."},
      {step:"Sauté onion, spinach, and tomatoes in olive oil."},
      {step:"Beat eggs and pour over vegetables."},
      {step:"Bake for 10-12 min until eggs set."},
      {step:"Serve warm."}
    ]}]
  },
  {
    id: 30, title: "Chicken & Quinoa Bowl",
    image: "images/chickenquinoabowl.jpg",
    readyInMinutes: 20, servings: 2, calories: 340,
    extendedIngredients: ["Chicken breast - 150g","Quinoa - 70g","Broccoli - 50g","Carrot - 50g","Soy sauce - 1 tbsp","Olive oil - 1 tsp"],
    analyzedInstructions: [{steps:[
      {step:"Cook quinoa according to instructions."},
      {step:"Sauté chicken in olive oil until cooked."},
      {step:"Steam broccoli and carrots for 3-4 min."},
      {step:"Mix all ingredients and drizzle soy sauce."},
      {step:"Serve warm."}
    ]}]
  }
];

// ============================================================
// LOCAL STORAGE CACHE HELPERS
// Stores ALL recipes ever fetched from the API in one big array.
// Capped at MAX_CACHE_BYTES so we don't blow up localStorage.
// ============================================================

/** Load master cache (all API recipes ever saved) */
function loadMasterCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

/** Save master cache — trims oldest if over byte limit */
function saveMasterCache(recipes) {
    // De-duplicate by id
    const seen = new Set();
    const deduped = recipes.filter(r => {
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
    });

    // Trim from the front if too large
    let payload = JSON.stringify(deduped);
    let arr = deduped;
    while (payload.length > MAX_CACHE_BYTES && arr.length > 0) {
        arr = arr.slice(Math.ceil(arr.length * 0.1)); // remove 10% oldest
        payload = JSON.stringify(arr);
    }

    try {
        localStorage.setItem(CACHE_KEY, payload);
    } catch (e) {
        // If still too large (e.g. quota exceeded), try trimming harder
        try {
            const half = arr.slice(Math.floor(arr.length / 2));
            localStorage.setItem(CACHE_KEY, JSON.stringify(half));
        } catch { /* silent fail — cache just won't save */ }
    }
}

/** Merge new API results into master cache */
function mergeIntoMasterCache(newRecipes) {
    const existing = loadMasterCache();
    saveMasterCache([...existing, ...newRecipes]);
}

/** Load per-query search cache */
function loadSearchCache() {
    try {
        const raw = localStorage.getItem(SEARCH_CACHE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}

/** Save per-query search cache entry */
function saveSearchCacheEntry(query, recipes) {
    const cache = loadSearchCache();
    cache[query] = recipes;
    try {
        localStorage.setItem(SEARCH_CACHE_KEY, JSON.stringify(cache));
    } catch { /* quota — silently ignore */ }
}

// ============================================================
// ALLERGEN HELPERS
// ============================================================

/** Returns the active allergen list (empty array = no filter) */
function getActiveAllergens() {
    if (noAllergenCheck.checked) return [];
    return Array.from(allergenCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value.toLowerCase());
}

// ============================================================
// ALLERGEN → INGREDIENT KEYWORD MAP
// Each allergen label maps to every real ingredient word it covers.
// A recipe is blocked if ANY of its ingredients contains ANY of
// these keywords for a selected allergen.
// ============================================================
const ALLERGEN_MAP = {
    "gluten":    ["gluten","wheat","bread","flour","pasta","spaghetti","noodle","tortilla","wrap","couscous","barley","rye","semolina","bulgur","farro","spelt","biscuit","cracker","breadcrumb","pita","croissant","muffin","bagel","roll","sourdough","panko","batter"],
    "wheat":     ["wheat","bread","flour","pasta","spaghetti","noodle","tortilla","wrap","couscous","semolina","bulgur","farro","spelt","biscuit","cracker","breadcrumb","pita","panko","batter","cereal"],
    "dairy":     ["dairy","milk","cheese","butter","cream","yogurt","yoghurt","mozzarella","cheddar","parmesan","brie","feta","ricotta","gouda","ghee","whey","lactose","custard","sour cream","crème","mascarpone","halloumi","kefir"],
    "milk":      ["milk","dairy","butter","cream","yogurt","yoghurt","cheese","mozzarella","cheddar","parmesan","brie","feta","ricotta","gouda","ghee","whey","lactose","custard","sour cream","mascarpone","halloumi","kefir"],
    "egg":       ["egg","eggs","omelette","mayonnaise","mayo","meringue","custard","quiche","frittata","hollandaise","albumen"],
    "nut":       ["nut","nuts","peanut","almond","cashew","walnut","pecan","hazelnut","pistachio","macadamia","pine nut","brazil nut","chestnut","praline","marzipan","nougat"],
    "peanut":    ["peanut","peanut butter","groundnut","satay","arachis"],
    "tree nut":  ["almond","cashew","walnut","pecan","hazelnut","pistachio","macadamia","pine nut","brazil nut","chestnut","praline","marzipan","nougat","coconut"],
    "soy":       ["soy","soya","tofu","tempeh","edamame","miso","tamari","soy sauce","soybean","soymilk"],
    "fish":      ["fish","salmon","tuna","cod","haddock","tilapia","halibut","mackerel","sardine","anchovy","anchovies","bass","trout","snapper","swordfish","mahi","catfish","pollock","herring","fish sauce","worcestershire"],
    "shellfish": ["shellfish","shrimp","prawn","crab","lobster","crayfish","scallop","clam","mussel","oyster","squid","octopus","abalone","barnacle","langoustine"],
    "shrimp":    ["shrimp","prawn","tiger prawn","king prawn"],
    "sesame":    ["sesame","tahini","sesame oil","sesame seed","hummus"],
    "mustard":   ["mustard","mustard seed","mustard oil","mustard powder","dijon"],
    "celery":    ["celery","celeriac","celery seed","celery salt"],
    "lupin":     ["lupin","lupine","lupin flour","lupin bean"],
    "molluscs":  ["mollusc","mollusk","squid","octopus","clam","mussel","oyster","scallop","snail","abalone","cuttlefish","whelk","periwinkle"],
    "sulphite":  ["sulphite","sulfite","sulphur dioxide","sulfur dioxide","wine","dried fruit","vinegar"],
    "corn":      ["corn","maize","cornstarch","cornflour","cornmeal","polenta","hominy","corn syrup","high fructose","popcorn"],
    "latex":     ["banana","avocado","kiwi","chestnut","papaya","fig","peach","nectarine","cherry","melon","pineapple","passion fruit","mango"]
};

/** Returns true if recipe is safe for the user (passes allergen filter) */
function recipePassesAllergens(recipe, allergens) {
    if (!allergens.length) return true;

    const allText = getAllIngredientText(recipe);

    return !allergens.some(allergen => {
        const keywords = ALLERGEN_MAP[allergen] || [allergen];
        return keywords.some(kw => allText.includes(kw));
    });
}

// ============================================================
// PANTRY HELPERS
// ============================================================

function getAllIngredientText(recipe) {
    return [
        recipe.title.toLowerCase(),
        ...(recipe.extendedIngredients?.map(ing =>
            typeof ing === "string" ? ing.toLowerCase() : (ing.original || ing.name || "").toLowerCase()
        ) || [])
    ].join(" ");
}

/**
 * Returns true if recipe can be made (mostly) from pantry items.
 * Requires that EVERY ingredient in the recipe matches at least
 * one pantry item (fuzzy substring match).
 */
function recipeMatchesPantry(recipe, pantry) {
    if (!pantry.length) return false;

    const ingredients = recipe.extendedIngredients || [];
    if (!ingredients.length) return false;

    return ingredients.every(ing => {
        const ingText = (typeof ing === "string" ? ing : (ing.original || ing.name || "")).toLowerCase();
        return pantry.some(p => ingText.includes(p) || p.includes(ingText.split(" ")[0]));
    });
}

// ============================================================
// ACTIVE FILTERS BAR
// ============================================================
function renderActiveFilters() {
    activeFiltersBar.innerHTML = "";
    const allergens = getActiveAllergens();
    const pantryOnly = pantryOnlyToggle.checked && pantryItems.length > 0;
    const maxTime    = parseInt(prepTimeFilter.value) || 0;

    allergens.forEach(a => {
        const tag = document.createElement("span");
        tag.className = "filterTag allergenTag";
        tag.textContent = `🚫 No ${a}`;
        activeFiltersBar.appendChild(tag);
    });

    if (pantryOnly) {
        const tag = document.createElement("span");
        tag.className = "filterTag pantryTag";
        tag.textContent = `🧺 Pantry only (${pantryItems.length} items)`;
        activeFiltersBar.appendChild(tag);
    }

    if (maxTime > 0) {
        const tag = document.createElement("span");
        tag.className = "filterTag";
        tag.style.cssText = "background:#fff3e0;color:#e65100;border:1.5px solid #ffcc80;";
        tag.textContent = `⏱ Under ${maxTime} mins`;
        activeFiltersBar.appendChild(tag);
    }
}

// ============================================================
// PANTRY UI
// ============================================================
function renderPantryChips() {
    pantryChipsEl.innerHTML = "";
    pantryItems.forEach((item, idx) => {
        const chip = document.createElement("span");
        chip.className = "pantryChip";
        chip.innerHTML = `${item} <button class="removeChip" data-idx="${idx}">&times;</button>`;
        pantryChipsEl.appendChild(chip);
    });
    pantryToggleLabel.style.color = pantryOnlyToggle.checked ? "#ff6f61" : "#555";
}

function addPantryItem(raw) {
    raw.split(",").map(s => s.trim().toLowerCase()).filter(s => s).forEach(item => {
        if (!pantryItems.includes(item)) pantryItems.push(item);
    });
    savePantry();
    renderPantryChips();
    renderActiveFilters();
}

pantryChipsEl.addEventListener("click", e => {
    const btn = e.target.closest(".removeChip");
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx);
    pantryItems.splice(idx, 1);
    savePantry();
    renderPantryChips();
    renderActiveFilters();
});

pantryAddBtn.addEventListener("click", () => {
    if (pantryInput.value.trim()) {
        addPantryItem(pantryInput.value.trim());
        pantryInput.value = "";
    }
});

pantryInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        if (pantryInput.value.trim()) {
            addPantryItem(pantryInput.value.trim());
            pantryInput.value = "";
        }
    }
});

pantryOnlyToggle.addEventListener("change", () => {
    pantryToggleLabel.style.color = pantryOnlyToggle.checked ? "#ff6f61" : "#555";
    renderActiveFilters();
});

// ============================================================
// PANEL TOGGLE BUTTONS
// ============================================================
allergenToggleBtn.addEventListener("click", () => {
    const isOpen = allergenPanel.classList.toggle("open");
    allergenToggleBtn.classList.toggle("active", isOpen);
    if (isOpen && pantryPanel.classList.contains("open")) {
        pantryPanel.classList.remove("open");
        pantryToggleBtn.classList.remove("active");
    }
});

pantryToggleBtn.addEventListener("click", () => {
    const isOpen = pantryPanel.classList.toggle("open");
    pantryToggleBtn.classList.toggle("active", isOpen);
    if (isOpen && allergenPanel.classList.contains("open")) {
        allergenPanel.classList.remove("open");
        allergenToggleBtn.classList.remove("active");
    }
});

// ============================================================
// FAVOURITES MODAL
// ============================================================
function renderFavouritesModal() {
    favouritesGrid.innerHTML = "";

    if (!favourites.length) {
        favouritesGrid.innerHTML = `<div class="noFavs"><span>💔</span>No favourites yet — heart a recipe to save it here!</div>`;
        return;
    }

    favourites.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "favCard";

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <p>${recipe.title}</p>
            <button class="favRemoveBtn" title="Remove">✕</button>
        `;

        // Click card to open recipe modal
        card.addEventListener("click", e => {
            if (e.target.classList.contains("favRemoveBtn")) return;
            favouritesModal.style.display = "none";
            openRecipeModal(recipe);
        });

        // Remove from favourites
        card.querySelector(".favRemoveBtn").addEventListener("click", e => {
            e.stopPropagation();
            favourites = favourites.filter(f => f.id !== recipe.id);
            saveFavourites();
            renderFavouritesModal();
            // Update heart on any visible cards
            const heartBtn = document.querySelector(`.favBtn[data-id="${recipe.id}"]`);
            if (heartBtn) heartBtn.textContent = "🤍";
        });

        favouritesGrid.appendChild(card);
    });
}

favouritesBtn.addEventListener("click", () => {
    renderFavouritesModal();
    favouritesModal.style.display = "block";
});

closeFavBtn.addEventListener("click", () => favouritesModal.style.display = "none");
window.addEventListener("click", e => {
    if (e.target === favouritesModal) favouritesModal.style.display = "none";
});

// "No Allergens" disables all other checkboxes
noAllergenCheck.addEventListener("change", () => {
    allergenCheckboxes.forEach(cb => {
        cb.disabled = noAllergenCheck.checked;
        if (noAllergenCheck.checked) cb.checked = false;
    });
    saveAllergens();
    renderActiveFilters();
});

allergenCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
        if (cb.checked) noAllergenCheck.checked = false;
        saveAllergens();
        renderActiveFilters();
    });
});

// ============================================================
// OPEN RECIPE MODAL (shared by cards + favourites)
// ============================================================
async function openRecipeModal(recipe) {
    try {
        let details = recipe;
        if (!recipe.extendedIngredients || !recipe.analyzedInstructions) {
            const cached = loadMasterCache().find(r => r.id === recipe.id);
            if (cached && cached.extendedIngredients) {
                details = cached;
            } else {
                const res = await fetch(
                    `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`
                );
                if (res.ok) {
                    details = await res.json();
                    mergeIntoMasterCache([details]);
                }
            }
        }

        const modalCalories = details.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount
                           || details.calories || "N/A";

        modalTitle.textContent = details.title;
        modalInfo.textContent  = `Ready in ${details.readyInMinutes || "N/A"} mins | Servings: ${details.servings || "N/A"} | Calories: ${modalCalories}`;

        modalIngredients.innerHTML = "";
        if (details.extendedIngredients) {
            details.extendedIngredients.forEach(ing => {
                const li = document.createElement("li");
                li.textContent = ing.original ? ing.original : ing;
                modalIngredients.appendChild(li);
            });
        }

        modalInstructions.innerHTML = "";
        if (details.analyzedInstructions?.length > 0) {
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
}

// ============================================================
// PAGINATION
// ============================================================
let currentPage    = 1;
const recipesPerPage = 6;
let currentRecipes   = [];
let currentKeywords  = [];

function displayPage(page) {
    const start = (page - 1) * recipesPerPage;
    const end   = start + recipesPerPage;
    displayRecipes(currentRecipes.slice(start, end), currentKeywords);
    renderPagination(currentRecipes.length, page);
}

function renderPagination(totalRecipes, page) {
    let paginationContainer = document.getElementById("paginationContainer");
    if (!paginationContainer) {
        paginationContainer = document.createElement("div");
        paginationContainer.id = "paginationContainer";
        paginationContainer.style.cssText = "text-align:center;margin:20px 0;display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap;";
        recipeContainer.parentNode.insertBefore(paginationContainer, recipeContainer.nextSibling);
    }

    const totalPages = Math.ceil(totalRecipes / recipesPerPage);
    paginationContainer.innerHTML = "";
    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← Prev";
    prevBtn.className   = "paginationBtn";
    prevBtn.disabled    = page <= 1;
    prevBtn.style.opacity = page <= 1 ? "0.4" : "1";
    prevBtn.style.cursor  = page <= 1 ? "default" : "pointer";
    prevBtn.onclick = () => {
        if (currentPage > 1) { currentPage--; displayPage(currentPage); }
    };
    paginationContainer.appendChild(prevBtn);

    // Page input + total label
    const pageLabel = document.createElement("span");
    pageLabel.style.cssText = "display:flex;align-items:center;gap:6px;font-weight:600;color:#555;font-size:0.95rem;";

    const pageInput = document.createElement("input");
    pageInput.type  = "number";
    pageInput.value = page;
    pageInput.min   = 1;
    pageInput.max   = totalPages;
    pageInput.style.cssText = "width:52px;padding:6px 8px;border:2px solid #ff6f61;border-radius:10px;font-size:0.95rem;font-weight:700;color:#ff6f61;text-align:center;outline:none;background:#fff8f2;";

    pageInput.addEventListener("keypress", e => {
        if (e.key === "Enter") goToPage(parseInt(pageInput.value), totalPages);
    });
    pageInput.addEventListener("blur", () => {
        goToPage(parseInt(pageInput.value), totalPages);
    });

    const ofLabel = document.createElement("span");
    ofLabel.textContent = `of ${totalPages}`;

    pageLabel.appendChild(pageInput);
    pageLabel.appendChild(ofLabel);
    paginationContainer.appendChild(pageLabel);

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next →";
    nextBtn.className   = "paginationBtn";
    nextBtn.disabled    = page >= totalPages;
    nextBtn.style.opacity = page >= totalPages ? "0.4" : "1";
    nextBtn.style.cursor  = page >= totalPages ? "default" : "pointer";
    nextBtn.onclick = () => {
        if (currentPage < totalPages) { currentPage++; displayPage(currentPage); }
    };
    paginationContainer.appendChild(nextBtn);
}

function goToPage(num, totalPages) {
    if (isNaN(num)) return;
    const clamped = Math.max(1, Math.min(num, totalPages));
    if (clamped !== currentPage) {
        currentPage = clamped;
        displayPage(currentPage);
    }
}

// ============================================================
// DISPLAY RECIPES
// ============================================================
function displayRecipes(recipes, keywords = []) {
    recipeContainer.innerHTML = "";

    if (!recipes.length) {
        recipeContainer.innerHTML = `
            <div class="noResults">
                <span>🍽️</span>
                No recipes found matching your filters.<br>
                Try adjusting your allergens, pantry, or search terms.
            </div>`;
        return;
    }

    recipes.forEach((recipe, i) => {
        const card = document.createElement("div");
        card.className = "recipeCard";
        setTimeout(() => card.classList.add("show"), i * 100);

        const prepTime = recipe.readyInMinutes ? `${recipe.readyInMinutes} mins` : "N/A";
        const calories = recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount
                      || recipe.calories || "N/A";

        let matchCount = 0;
        if (keywords.length) {
            const allText = getAllIngredientText(recipe);
            matchCount = keywords.filter(k => allText.includes(k)).length;
        }

        const hearted = isFavourited(recipe.id);

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <button class="favBtn${hearted ? " active" : ""}" data-id="${recipe.id}" title="Save to favourites">${hearted ? "❤️" : "🤍"}</button>
            <div class="recipeInfo">
                <h3>${recipe.title} ${matchCount ? `<span class="badge">${matchCount}</span>` : ""}</h3>
                <p>Ready in ${prepTime} | Servings: ${recipe.servings || "N/A"} | Calories: ${calories}</p>
            </div>
        `;

        // Heart button — toggle favourite without opening modal
        card.querySelector(".favBtn").addEventListener("click", e => {
            e.stopPropagation();
            toggleFavourite(recipe);
            const btn = e.currentTarget;
            const nowFav = isFavourited(recipe.id);
            btn.textContent = nowFav ? "❤️" : "🤍";
            if (nowFav) btn.classList.add("active");
            else btn.classList.remove("active");
        });

        // Click card body → open modal
        card.addEventListener("click", () => openRecipeModal(recipe));

        recipeContainer.appendChild(card);
    });
}

// ============================================================
// FILTER PIPELINE
// Applies allergen + pantry filters to a recipe list
// ============================================================
function applyFilters(recipes, keywords = []) {
    const allergens  = getActiveAllergens();
    const pantryOnly = pantryOnlyToggle.checked && pantryItems.length > 0;
    const maxTime    = parseInt(prepTimeFilter.value) || 0;

    let filtered = recipes;

    // 1. Allergen filter
    if (allergens.length) {
        filtered = filtered.filter(r => recipePassesAllergens(r, allergens));
    }

    // 2. Prep time filter
    if (maxTime > 0) {
        filtered = filtered.filter(r => r.readyInMinutes && r.readyInMinutes <= maxTime);
    }

    // 3. Pantry filter
    if (pantryOnly) {
        filtered = filtered.filter(r => recipeMatchesPantry(r, pantryItems));
    } else if (keywords.length) {
        filtered = filtered.map(r => {
            const allText = getAllIngredientText(r);
            const matchedCount = keywords.filter(k => allText.includes(k)).length;
            return { recipe: r, matchedCount };
        })
        .filter(({ matchedCount }) => matchedCount > 0)
        .sort((a, b) => b.matchedCount - a.matchedCount)
        .map(({ recipe }) => recipe);

        if (!filtered.length) {
            filtered = allergens.length
                ? recipes.filter(r => recipePassesAllergens(r, allergens))
                : recipes;
            if (maxTime > 0) {
                filtered = filtered.filter(r => r.readyInMinutes && r.readyInMinutes <= maxTime);
            }
        }
    }

    return filtered;
}

// ============================================================
// FETCH & CACHE RECIPES
// ============================================================
async function fetchRecipes(query = "") {
    showSpinner();
    const keywords = query.toLowerCase().split(",").map(k => k.trim()).filter(k => k);
    currentKeywords = keywords;

    const allergens  = getActiveAllergens();
    const pantryOnly = pantryOnlyToggle.checked && pantryItems.length > 0;

    let recipes = [];
    let useLocal = false;

    // ---- CASE 1: Pantry-only mode — search across local + master cache ----
    if (pantryOnly) {
        const masterCache = loadMasterCache();
        const pool = [...localRecipes, ...masterCache];
        recipes  = applyFilters(pool, keywords);
        useLocal = true;
    }

    // ---- CASE 2: Keyword search ----
    else if (keywords.length) {
        // Check search cache first
        const searchCache = loadSearchCache();
        const cacheKey    = keywords.join(",");

        if (searchCache[cacheKey]) {
            recipes  = applyFilters(searchCache[cacheKey], keywords);
            useLocal = true;
        } else {
            // Try local + master cache for keyword matches
            const masterCache = loadMasterCache();
            const pool = [...localRecipes, ...masterCache];
            const localMatches = applyFilters(pool, keywords);

            if (localMatches.length >= 6) {
                // Enough results from cache — no API call needed
                recipes  = localMatches;
                useLocal = true;
            } else {
                // Not enough locally, try the API
                try {
                    const formattedQuery = keywords.join("+");
                    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${formattedQuery}&addRecipeInformation=true&number=100&apiKey=${API_KEY}`;
                    const res = await fetch(url);
                    if (!res.ok) throw new Error("API quota or network issue");

                    const data = await res.json();
                    const apiRecipes = data.results || [];

                    // Save ALL results to master cache for future offline use
                    mergeIntoMasterCache(apiRecipes);
                    saveSearchCacheEntry(cacheKey, apiRecipes);

                    // Merge API results with local, then filter
                    const combined = [...localRecipes, ...apiRecipes];
                    recipes  = applyFilters(combined, keywords);
                    useLocal = true;
                } catch (err) {
                    console.warn("API failed, falling back to local cache:", err);
                    recipes  = localMatches.length ? localMatches : applyFilters(localRecipes, keywords);
                    useLocal = true;
                }
            }
        }
    }

    // ---- CASE 3: Initial load / no query ----
    else {
        // Try master cache first (already-fetched API recipes)
        const masterCache = loadMasterCache();
        if (masterCache.length) {
            recipes  = applyFilters([...localRecipes, ...masterCache], keywords);
            useLocal = true;
        } else {
            // Fetch a large initial batch from the API
            try {
                const url = `https://api.spoonacular.com/recipes/random?number=100&apiKey=${API_KEY}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error("API quota or network issue");

                const data = await res.json();
                const apiRecipes = data.recipes || [];
                mergeIntoMasterCache(apiRecipes);

                recipes  = applyFilters([...localRecipes, ...apiRecipes], keywords);
                useLocal = true;
            } catch (err) {
                console.warn("API failed on initial load, using local only:", err);
                recipes  = applyFilters(localRecipes, keywords);
                useLocal = true;
            }
        }
    }

    currentRecipes = recipes;
    currentPage    = 1;
    hideSpinner();
    displayPage(currentPage);
}

// ============================================================
// EVENT LISTENERS
// ============================================================
searchBtn.addEventListener("click", () => {
    fetchRecipes(searchInput.value.trim());
});

searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        fetchRecipes(searchInput.value.trim());
    }
});

randomBtn.addEventListener("click", () => {
    // Pull from both local + master cache for a richer random pool
    const masterCache = loadMasterCache();
    const pool = [...localRecipes, ...masterCache];
    const allergens = getActiveAllergens();
    const safePool  = allergens.length ? pool.filter(r => recipePassesAllergens(r, allergens)) : pool;

    if (safePool.length) {
        const randIndex = Math.floor(Math.random() * safePool.length);
        currentRecipes  = [safePool[randIndex]];
        currentKeywords = [];
        currentPage     = 1;
        displayPage(currentPage);
    }
});

prepTimeFilter.addEventListener("change", () => {
    renderActiveFilters();
    fetchRecipes(searchInput.value.trim());
});

// ============================================================
// INIT
// ============================================================
loadAllergens();
renderPantryChips();
renderActiveFilters();
fetchRecipes();