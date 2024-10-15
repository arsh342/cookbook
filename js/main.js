const menuIcon = document.querySelector(".menu-icon");
const closeIcon = document.querySelector(".close-icon");
const mobileMenuItems = document.querySelector(".mobile-menu-items");
const allMobileMenuLinks = document.querySelectorAll(".mobile-menu-items a");

const searchContainer = document.querySelector(".search-container");
const searchIcons = document.querySelectorAll(".search-icon");
const searchInput = document.querySelector(
  ".search-input-container input[type='text']"
);
const searchInputContainer = document.querySelector(".search-input-container");

if (menuIcon) {
    menuIcon.addEventListener("click", () => {
        mobileMenuItems.classList.add("active");
    });
}

if (closeIcon) {
    closeIcon.addEventListener("click", () => {
        mobileMenuItems.classList.remove("active");
    });
}

allMobileMenuLinks.forEach((l) => {
    l.addEventListener("click", () => {
        mobileMenuItems.classList.remove("active");
    });
});

// Search icon
if (searchIcons) {
    searchIcons.forEach((searchIcon) => {
        searchIcon.addEventListener("click", () => {
            searchContainer.classList.add("active");
            searchInput.focus();
        });
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        searchContainer.classList.remove("active");
        searchInput.value = "";
    }
});

document.addEventListener("click", (e) => {
    if (
        e.target.closest(".search-input-container") ||
        e.target.closest(".search-icon")
    )
        return;

    searchContainer.classList.remove("active");
    searchInput.value = "";
});