const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropdownMenu = document.querySelector('.dropdown_menu');
toggleBtn.onclick = function () {
    dropdownMenu.classList.toggle('open');
    const isOpen = dropdownMenu.classList.contains('open');
    toggleBtnIcon.classList = isOpen ? 'fas fa-times' : 'fas fa-bars';
}
let prevBtn = document.getElementById('prev');
let nextBtn = document.getElementById('next');
let carousel = document.querySelector('.carousel');
let items = carousel.querySelectorAll('.list .item');
let indicator = carousel.querySelector('.indicators');
let dots = indicator.querySelectorAll('.indicators ul li');

let active = 0;
let firstPosition = 0;
let lastPosition = items.length - 1;
let autoPlay;

const startAutoPlay = () => {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => {
        nextBtn.click();
    }, 5000);
}
startAutoPlay();

const setSlider = () => {
    let itemActiveOld = carousel.querySelector('.list .item.active');
    if (itemActiveOld) itemActiveOld.classList.remove('active');
    items[active].classList.add('active');

    let dotActiveOld = indicator.querySelector('.indicators ul li.active');
    if (dotActiveOld) dotActiveOld.classList.remove('active');
    dots[active].classList.add('active');

    indicator.querySelector('.number').innerText = '0' + (active + 1);
    startAutoPlay();
}
setSlider();

nextBtn.onclick = () => {
    active = active + 1 > lastPosition ? 0 : active + 1;
    carousel.style.setProperty('--calculation', 1);
    setSlider();
}
prev.onclick = () => {
    active = active - 1 < firstPosition ? lastPosition : active - 1;
    carousel.style.setProperty('--calculation', -1);
    setSlider();
    clearInterval(autoPlay);
    autoPlay = setInterval(() => {
        nextBtn.click();
    }, 5000);
}
dots.forEach((item, position) => {
    item.onclick = () => {
        active = position;
        setSlider();
    }
})

// Add this function to handle the "View Recipe" button clicks
function handleViewRecipeButtons() {
    const viewRecipeButtons = document.querySelectorAll('.carousel .more button');
    viewRecipeButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const recipes = [
          { id: '52920', name: 'Chicken Marengo' },
          { id: '52770', name: 'Spaghetti Bolognese' },
          { id: '52852', name: 'Tuna Nicoise' }
        ];
        const recipe = recipes[index];
        if (recipe) {
          // Redirect to the recipe page
          window.location.href = `meal-details.html?id=${recipe.id}`;
        } else {
          console.error('Recipe not found');
        }
      });
    });
  }
  
  // Call this function after the DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Existing carousel initialization code...
    
    // Initialize the view recipe buttons
    handleViewRecipeButtons();
  });