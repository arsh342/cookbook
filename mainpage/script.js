const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const resultTitle = document.getElementById('result-title');
const searchTypeSelect = document.getElementById('search-type');
const searchInput = document.getElementById('search-input');

// event listeners
searchBtn.addEventListener('click', performSearch);

// get initial meals
function getInitialMeals() {
    const numberOfMeals = 12; // You can adjust this number
    let meals = [];

    const fetchRandomMeal = () => {
        return fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => data.meals[0]);
    };

    Promise.all(Array(numberOfMeals).fill().map(() => fetchRandomMeal()))
        .then(randomMeals => {
            meals = randomMeals;
            displayMeals(meals, "Featured Recipes");
        })
        .catch(error => console.error('Error fetching meals:', error));
}

// perform search based on selected type
function performSearch() {
    const searchType = searchTypeSelect.value;
    const searchTerm = searchInput.value.trim();

    switch (searchType) {
        case 'ingredient':
            searchMealsByIngredient(searchTerm);
            break;
        case 'category':
            searchMealsByCategory(searchTerm);
            break;
        case 'name':
            searchMealsByName(searchTerm);
            break;
        case 'firstLetter':
            searchMealsByFirstLetter(searchTerm);
            break;
        case 'area':
            searchMealsByArea(searchTerm);
            break;
    }
}

// search meals by ingredient
function searchMealsByIngredient(ingredient) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals, `Recipes with ${ingredient}`);
        });
}

// search meals by category
function searchMealsByCategory(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals, `Recipes in ${category} category`);
        });
}

// search meals by name
function searchMealsByName(name) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals, `Recipes matching "${name}"`);
        });
}

// search meals by first letter
function searchMealsByFirstLetter(letter) {
    if (letter.length !== 1) {
        alert("Please enter a single letter for first letter search.");
        return;
    }
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals, `Recipes starting with "${letter}"`);
        });
}

// search meals by area
function searchMealsByArea(area) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals, `Recipes from ${area}`);
        });
}

// display meals
function displayMeals(meals, title) {
    resultTitle.textContent = title;
    let html = "";
    if (meals) {
        meals.forEach(meal => {
            // Truncate the meal instructions to create a brief description
            let description = meal.strInstructions ? meal.strInstructions.substring(0, 50) + '...' : 'No description available.';

            html += `
            <div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
                <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <p class="meal-description">${description}</p>
                    <a href="meal-details.html?id=${meal.idMeal}" class="recipe-btn">View Recipe</a>
                </div>
            </div>
            `;
        });
        mealList.classList.remove('notFound');
    } else {
        html = "Sorry, we didn't find any Recipe!";
        mealList.classList.add('notFound');
    }

    mealList.innerHTML = html;
}

// Call getInitialMeals when the page loads
document.addEventListener('DOMContentLoaded', getInitialMeals);