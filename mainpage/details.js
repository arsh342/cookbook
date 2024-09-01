const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeBackBtn = document.getElementById('recipe-back-btn');

// event listeners
recipeBackBtn.addEventListener('click', () => {
    window.history.back();
});

// get recipe of the meal
function getMealRecipe() {
    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get('id');

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals[0]));
}

// create a modal
function mealRecipeModal(meal) {
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-ingredients">
            <h3>Ingredients:</h3>
            <ul>
                ${getIngredientsList(meal)}
            </ul>
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
}

// helper function to get ingredients list
function getIngredientsList(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientsList += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
}

// Call getMealRecipe when the page loads
document.addEventListener('DOMContentLoaded', getMealRecipe);