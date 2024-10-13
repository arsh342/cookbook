const wishlistMealsContainer = document.getElementById('wishlist-meals');

function displayWishlistMeals() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlist.length === 0) {
        wishlistMealsContainer.innerHTML = '<p class="empty-wishlist">Your wishlist is empty.</p>';
        return;
    }

    let html = '<div class="wishlist-items">';
    const fetchPromises = wishlist.map(mealId => 
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => data.meals[0])
    );

    Promise.all(fetchPromises)
        .then(meals => {
            meals.forEach(meal => {
                if (meal) {
                    html += `
                    <div class="wishlist-item" data-id="${meal.idMeal}">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="wishlist-item-img">
                        <div class="wishlist-item-content">
                            <h3 class="wishlist-item-title">${meal.strMeal}</h3>
                            <p class="wishlist-item-category">${meal.strCategory}</p>
                            <div class="wishlist-item-buttons">
                                <a href="meal-details.html?id=${meal.idMeal}" class="wishlist-view-btn">View Recipe</a>
                                <button class="wishlist-remove-btn" onclick="removeFromWishlist('${meal.idMeal}')">Remove</button>
                            </div>
                        </div>
                    </div>
                    `;
                }
            });
            html += '</div>';
            wishlistMealsContainer.innerHTML = html;
        })
        .catch(error => console.error('Error fetching wishlist meals:', error));
}

function removeFromWishlist(mealId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(id => id !== mealId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    displayWishlistMeals();
}

document.addEventListener('DOMContentLoaded', displayWishlistMeals);