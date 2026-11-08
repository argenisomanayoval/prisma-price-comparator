
/* =========================================
   PRISMA — MAIN JAVASCRIPT
   ========================================= */

/* 1. PRODUCT DATABASE */

const products = [
    {
        id: 1,
        name: "iPhone 16",
        category: "Smartphones",
        brand: "Apple",
        description: "Smartphone con pantalla Super Retina.",
        price: 17499,
        store: "Apple Store",
        image: "https://placehold.co/400x300/f3f1ec/202020?text=iPhone+16"
    },
    {
        id: 2,
        name: "MacBook Air M4",
        category: "Laptops",
        brand: "Apple",
        description: "Laptop ligera y potente para trabajar.",
        price: 22999,
        store: "MacStore",
        image: "https://placehold.co/400x300/f3f1ec/202020?text=MacBook+Air"
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        category: "Audio",
        brand: "Sony",
        description: "Audífonos inalámbricos con cancelación de ruido.",
        price: 5499,
        store: "Sony Store",
        image: "https://placehold.co/400x300/f3f1ec/202020?text=Sony+Headphones"
    },
    {
        id: 4,
        name: "PlayStation 5 Slim",
        category: "Gaming",
        brand: "Sony",
        description: "Consola de videojuegos de nueva generación.",
        price: 9499,
        store: "PlayStation Store",
        image: "https://placehold.co/400x300/f3f1ec/202020?text=PlayStation+5"
    }
];


/* 2. SELECT HTML ELEMENTS */

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn[data-category]");
const sortSelect = document.getElementById("sort-select");
const resultsCount = document.getElementById("results-count");
const favoritesToggle = document.getElementById("favorites-toggle");
const favoritesCount = document.getElementById("favorites-count");


/* 3. APPLICATION STATE */

let selectedCategory = "all";
let showFavoritesOnly = false;


/* 4. LOAD FAVORITES FROM LOCAL STORAGE */

function loadFavorites() {
    try {
        const savedFavorites = JSON.parse(
            localStorage.getItem("prisma-favorites")
        );

        if (!Array.isArray(savedFavorites)) {
            return [];
        }

        return savedFavorites.filter(function(id) {
            return products.some(function(product) {
                return product.id === id;
            });
        });

    } catch (error) {
        console.error("Error al recuperar los favoritos:", error);
        return [];
    }
}

let favoriteProducts = loadFavorites();


/* 5. SAVE FAVORITES IN LOCAL STORAGE */

function saveFavorites() {
    try {
        localStorage.setItem(
            "prisma-favorites",
            JSON.stringify(favoriteProducts)
        );
    } catch (error) {
        console.error("No fue posible guardar los favoritos:", error);
    }
}


/* 6. FORMAT PRICES */

function formatPrice(price) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0
    }).format(price);
}


/* 7. UPDATE FAVORITES COUNTER */

function updateFavoritesCount() {
    favoritesCount.textContent = favoriteProducts.length;

    favoritesToggle.classList.toggle(
        "active",
        showFavoritesOnly
    );

    favoritesToggle.setAttribute(
        "aria-pressed",
        String(showFavoritesOnly)
    );
}


/* 8. FILTER, SEARCH AND SORT PRODUCTS */

function getFilteredProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    let filteredProducts = products.filter(function(product) {

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const matchesFavorites =
            !showFavoritesOnly ||
            favoriteProducts.includes(product.id);

        return matchesSearch && matchesCategory && matchesFavorites;
    });

    const sortValue = sortSelect.value;

    if (sortValue === "price-asc") {
        filteredProducts.sort(function(a, b) {
            return a.price - b.price;
        });
    }

    if (sortValue === "price-desc") {
        filteredProducts.sort(function(a, b) {
            return b.price - a.price;
        });
    }

    if (sortValue === "name-asc") {
        filteredProducts.sort(function(a, b) {
            return a.name.localeCompare(b.name, "es");
        });
    }

    return filteredProducts;
}


/* 9. DISPLAY PRODUCTS */

function displayProducts() {
    const filteredProducts = getFilteredProducts();

    updateFavoritesCount();

    resultsCount.textContent =
        `${filteredProducts.length} ${
            filteredProducts.length === 1 ? "producto" : "productos"
        }`;

    if (filteredProducts.length === 0) {
        const emptyMessage = showFavoritesOnly
            ? "Todavía no tienes favoritos."
            : "No encontramos resultados.";

        const emptyDescription = showFavoritesOnly
            ? "Marca el corazón de un producto para guardarlo aquí."
            : "Intenta con otro nombre, marca o categoría.";

        productGrid.innerHTML = `
            <div class="empty-state">
                <h3>${emptyMessage}</h3>
                <p>${emptyDescription}</p>
            </div>
        `;

        return;
    }

    productGrid.innerHTML = filteredProducts.map(function(product) {

        const isFavorite = favoriteProducts.includes(product.id);

        return `
            <article class="product-card">

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                    <button
                        class="favorite-btn ${isFavorite ? "is-favorite" : ""}"
                        type="button"
                        data-favorite-id="${product.id}"
                        aria-label="${isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}: ${product.name}"
                        aria-pressed="${isFavorite}"
                        title="${isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}"
                    >
                        ♥
                    </button>

                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>

                    <p class="product-description">
                        ${product.description}
                    </p>

                    <p class="product-price">
                        ${formatPrice(product.price)}
                    </p>

                    <p class="product-store">
                        Disponible en ${product.store}
                    </p>

                </div>

            </article>
        `;
    }).join("");
}


/* 10. TOGGLE PRODUCT FAVORITES */

function toggleFavorite(productId) {
    const isFavorite = favoriteProducts.includes(productId);

    if (isFavorite) {
        favoriteProducts = favoriteProducts.filter(function(id) {
            return id !== productId;
        });
    } else {
        favoriteProducts.push(productId);
    }

    saveFavorites();
    displayProducts();
}


/* 11. FAVORITE BUTTON EVENTS */

productGrid.addEventListener("click", function(event) {
    const favoriteButton = event.target.closest("[data-favorite-id]");

    if (!favoriteButton) {
        return;
    }

    const productId = Number(favoriteButton.dataset.favoriteId);

    toggleFavorite(productId);
});


/* 12. SEARCH EVENT */

searchInput.addEventListener("input", displayProducts);


/* 13. CATEGORY FILTER EVENTS */

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        selectedCategory = button.dataset.category;

        filterButtons.forEach(function(filterButton) {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");

        displayProducts();
    });

});


/* 14. FAVORITES FILTER EVENT */

favoritesToggle.addEventListener("click", function() {
    showFavoritesOnly = !showFavoritesOnly;
    displayProducts();
});


/* 15. SORT EVENT */

sortSelect.addEventListener("change", displayProducts);


/* 16. INITIALIZE APPLICATION */

displayProducts();

console.log("PRISMA: aplicación iniciada correctamente.");