document.addEventListener('DOMContentLoaded', function() {
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

    if (allMobileMenuLinks) {
        allMobileMenuLinks.forEach((l) => {
            l.addEventListener("click", () => {
                mobileMenuItems.classList.remove("active");
            });
        });
    }

    // Search icon
    if (searchIcons) {
        searchIcons.forEach((searchIcon) => {
            searchIcon.addEventListener("click", () => {
                if (searchContainer) {
                    searchContainer.classList.add("active");
                    if (searchInput) {
                        searchInput.focus();
                    }
                }
            });
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && searchContainer) {
            searchContainer.classList.remove("active");
            if (searchInput) {
                searchInput.value = "";
            }
        }
    });

    document.addEventListener("click", (e) => {
        if (
            searchContainer &&
            !e.target.closest(".search-input-container") &&
            !e.target.closest(".search-icon")
        ) {
            searchContainer.classList.remove("active");
            if (searchInput) {
                searchInput.value = "";
            }
        }
    });
});