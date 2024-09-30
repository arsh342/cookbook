const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const resultTitle = document.getElementById('result-title');
const searchTypeSelect = document.getElementById('search-type');
const searchInput = document.getElementById('search-input');

// Debounce function to limit search request frequency
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

// Event listener with debounce for click
searchBtn.addEventListener('click', debounce(performSearch, 300));

// Event listener for Enter key press
searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission if within a form
        debounce(performSearch, 300)();
    }
});

// Get initial meals with unique fetch requests to avoid cache issues
function getInitialMeals() {
    console.log('Fetching initial meals...');
    const numberOfMeals = 6; // Number of random meals to fetch

    // Helper function to fetch a random meal with a unique timestamp
    const fetchRandomMeal = () => {
        const uniqueParam = `?_=${new Date().getTime()}`; // Unique parameter to avoid caching
        return fetch(`https://www.themealdb.com/api/json/v1/1/random.php${uniqueParam}`, {
            cache: "no-store" // Explicitly tell fetch to avoid caching
        })
            .then(response => response.json())
            .then(data => data.meals[0])
            .catch(error => console.error('Error fetching meal:', error));
    };

    // Create an array of promises to fetch multiple random meals
    const mealPromises = Array.from({ length: numberOfMeals }, fetchRandomMeal);

    // Resolve all promises and display the meals
    Promise.all(mealPromises)
        .then(randomMeals => {
            // Filter out any undefined responses due to fetch errors
            const uniqueMeals = randomMeals.filter(meal => meal);
            // Display unique meals fetched
            displayMeals(uniqueMeals, "Featured Recipes");
        })
        .catch(error => console.error('Error fetching meals:', error));
}

// Perform search based on selected type
function performSearch() {
    const searchType = searchTypeSelect.value;
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) return; // Skip search if input is empty

    switch (searchType) {
        case 'ingredient':
            searchMealsByIngredient(searchTerm);
            break;
        case 'multiIngredient':
            searchMealsByMultiIngredient(searchTerm);
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

// Search meals by ingredient
function searchMealsByIngredient(ingredient) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals, `Recipes with ${ingredient}`);
        })
        .catch(error => console.error('Error fetching ingredient meals:', error));
}

// Search meals by multi-ingredient
function searchMealsByMultiIngredient(ingredients) {
    const ingredientList = ingredients.split(',').map(i => i.trim());
    const promises = ingredientList.map(ingredient =>
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
            .then(response => response.json())
            .then(data => data.meals || [])
    );

    Promise.all(promises)
        .then(results => {
            // Find meals that contain all ingredients
            const commonMeals = results.reduce((acc, meals) =>
                acc.filter(accMeal => meals.some(meal => meal.idMeal === accMeal.idMeal))
            );
            displayMeals(commonMeals, `Recipes with ${ingredientList.join(', ')}`);
        })
        .catch(error => console.error('Error fetching multi-ingredient meals:', error));
}

// Search meals by category
function searchMealsByCategory(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals, `Recipes in ${category} category`);
        })
        .catch(error => console.error('Error fetching category meals:', error));
}

// Search meals by name
function searchMealsByName(name) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals, `Recipes matching "${name}"`);
        })
        .catch(error => console.error('Error fetching named meals:', error));
}

// Search meals by first letter
function searchMealsByFirstLetter(letter) {
    if (letter.length !== 1) {
        alert("Please enter a single letter for first letter search.");
        return;
    }
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals, `Recipes starting with "${letter}"`);
        })
        .catch(error => console.error('Error fetching first letter meals:', error));
}

// Search meals by area
function searchMealsByArea(area) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals, `Recipes from ${area}`);
        })
        .catch(error => console.error('Error fetching area meals:', error));
}

// Display meals
function displayMeals(meals, title) {
    console.log('Displaying meals...');
    resultTitle.textContent = title;
    let html = "";
    if (meals && meals.length > 0) {
        meals.forEach(meal => {
            let description = meal.strInstructions ? meal.strInstructions.substring(0, 50) + '...' : 'No description available.';
            let category = meal.strCategory ? meal.strCategory : 'Unknown Category';
            let rating = meal.rating || Math.floor(Math.random() * 5) + 1; // Use meal.rating if available, otherwise generate a random rating between 1-5

            html += `
            <div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
                <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <p class="meal-category"><strong>Category:</strong> ${category}</p>
                    <p class="meal-description">${description}</p>
                    <!-- Star Rating -->
                    <div class="star-rating">
                        ${generateStarRating(rating)}
                    </div>
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

    // Add event listeners for the star ratings
    addStarRatingListeners();
}

// Function to generate star rating HTML based on a given rating value
function generateStarRating(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="star ${i <= rating ? 'selected' : ''}" data-value="${i}">&#9733;</span>`;
    }
    return starsHtml;
}

// Function to add event listeners for star ratings
function addStarRatingListeners() {
    const starContainers = document.querySelectorAll('.star-rating');
    starContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.getAttribute('data-value');
                updateStarRating(container, value);
                // Here you would typically send this rating to your backend
                console.log(`Rated ${value} stars`);
            });
        });
    });
}

// Function to update star rating visually
function updateStarRating(container, rating) {
    const stars = container.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

// Call getInitialMeals when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded');
    mealList.innerHTML = ''; // Clear existing content before loading initial meals
    getInitialMeals();
});

// Fetch new meals when navigating back from the details page
window.addEventListener('pageshow', (event) => {
    if (event.persisted) { // Triggered when coming back from the cache
        console.log('Page is back from cache');
        mealList.innerHTML = ''; // Clear existing meals
        getInitialMeals(); // Fetch new meals to ensure different recipes
    }
});