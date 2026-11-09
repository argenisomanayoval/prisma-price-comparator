/* =========================================
   PRISMA — MAIN JAVASCRIPT
   Favorites + Price Comparison
   ========================================= */


/* 1. PRODUCT DATABASE */

const products = [
    {
        id: 1,
        name: "iPhone 16",
        category: "Smartphones",
        brand: "Apple",
        description: "Smartphone con pantalla Super Retina.",
        image: "https://placehold.co/400x300/f3f1ec/202020?text=iPhone+16",
        offers: [
            { store: "Apple Store", price: 17499 },
            { store: "Amazon", price: 16499 },
            { store: "Liverpool", price: 16999 }
        ]
    },
    {
        id: 2,
        name: "MacBook Air M4",
        category: "Laptops",
        brand: "Apple",
        description: "Laptop ligera y potente para trabajar.",
        image: "https://placehold.co/400x300/f3f1ec/202020?text=MacBook+Air",
        offers: [
            { store: "MacStore", price: 22999 },
            { store: "Amazon", price: 22499 },
            { store: "Liverpool", price: 23999 }
        ]
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        category: "Audio",
        brand: "Sony",
        description: "Audífonos inalámbricos con cancelación de ruido.",
        image: "https://placehold.co/400x300/f3f1ec/202020?text=Sony+Headphones",
        offers: [
            { store: "Sony Store", price: 5499 },
            { store: "Amazon", price: 4999 },
            { store: "Liverpool", price: 5299 }
        ]
    },
    {
        id: 4,
        name: "PlayStation 5 Slim",
        category: "Gaming",
        brand: "Sony",
        description: "Consola de videojuegos de nueva generación.",
        image: "https://placehold.co/400x300/f3f1ec/202020?text=PlayStation+5",
        offers: [
            { store: "PlayStation Store", price: 9499 },
            { store: "Amazon", price: 8999 },
            { store: "Liverpool", price: 9299 }
        ]
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


/* 7. PRICE COMPARISON FUNCTIONS */

// Returns the cheapest offer for a product.
function getBestOffer(product) {
    return product.offers.reduce(function(bestOffer, currentOffer) {
        return currentOffer.price < bestOffer.price
            ? currentOffer
            : bestOffer;
    });
}

// Returns the highest offer for a product.
function getHighestOffer(product) {
    return product.offers.reduce(function(highestOffer, currentOffer) {
        return currentOffer.price > highestOffer.price
            ? currentOffer
            : highestOffer;
    });
}

// Calculates the difference between the highest and lowest price.
function getPriceDifference(product) {
    const bestOffer = getBestOffer(product);
    const highestOffer = getHighestOffer(product);

    return highestOffer.price - bestOffer.price;
}


/* 8. UPDATE FAVORITES COUNTER */

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


/* 9. FILTER, SEARCH AND SORT PRODUCTS */

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
            return getBestOffer(a).price - getBestOffer(b).price;
        });
    }

    if (sortValue === "price-desc") {
        filteredProducts.sort(function(a, b) {
            return getBestOffer(b).price - getBestOffer(a).price;
        });
    }

    if (sortValue === "name-asc") {
        filteredProducts.sort(function(a, b) {
            return a.name.localeCompare(b.name, "es");
        });
    }

    return filteredProducts;
}


/* 10. DISPLAY PRODUCTS */

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
        const bestOffer = getBestOffer(product);
        const priceDifference = getPriceDifference(product);

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

                    <span class="best-price-label">
                        MEJOR PRECIO
                    </span>

                    <p class="product-price">
                        ${formatPrice(bestOffer.price)}
                    </p>

                    <p class="product-store">
                        En ${bestOffer.store}
                    </p>

                    <div class="comparison-summary">
                        <span>
                            ${product.offers.length} tiendas comparadas
                        </span>

                        <span>
                            Ahorra hasta ${formatPrice(priceDifference)}
                        </span>
                    </div>

                    <button
                        class="compare-btn"
                        type="button"
                        data-compare-id="${product.id}"
                    >
                        Comparar precios
                        <span>↗</span>
                    </button>

                </div>

            </article>
        `;
    }).join("");
}


/* 11. TOGGLE PRODUCT FAVORITES */

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


/* 12. FAVORITE BUTTON EVENTS */

productGrid.addEventListener("click", function(event) {
    const favoriteButton = event.target.closest("[data-favorite-id]");

    if (!favoriteButton) {
        return;
    }

    const productId = Number(favoriteButton.dataset.favoriteId);

    toggleFavorite(productId);
});


/* 13. PRICE COMPARISON MODAL */

// Create the comparison window dynamically.
const comparisonModal = document.createElement("div");

comparisonModal.className = "comparison-modal";
comparisonModal.id = "comparison-modal";

comparisonModal.setAttribute("aria-hidden", "true");

comparisonModal.innerHTML = `
    <div
        class="comparison-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="comparison-title"
    >
        <button
            class="comparison-close"
            type="button"
            aria-label="Cerrar comparación"
        >
            ×
        </button>

        <div id="comparison-content"></div>
    </div>
`;

document.body.appendChild(comparisonModal);

const comparisonContent = document.getElementById("comparison-content");
const comparisonClose = comparisonModal.querySelector(".comparison-close");


// Open the comparison window.
function openComparison(productId) {
    const product = products.find(function(item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    const bestOffer = getBestOffer(product);
    const highestOffer = getHighestOffer(product);
    const priceDifference = getPriceDifference(product);

    // Sort offers from lowest to highest price.
    const sortedOffers = [...product.offers].sort(function(a, b) {
        return a.price - b.price;
    });

    comparisonContent.innerHTML = `
        <span class="comparison-eyebrow">
            PRISMA PRICE COMPARISON
        </span>

        <h2 id="comparison-title">
            ${product.name}<span>.</span>
        </h2>

        <p class="comparison-description">
            Compara las ofertas disponibles y encuentra el mejor precio.
        </p>

        <div class="comparison-best">
            <span>MEJOR PRECIO ENCONTRADO</span>

            <strong>${formatPrice(bestOffer.price)}</strong>

            <p>Disponible en ${bestOffer.store}</p>
        </div>

        <div class="comparison-offers">

            <div class="comparison-offers-heading">
                <h3>Precios por tienda</h3>
                <span>${sortedOffers.length} ofertas</span>
            </div>

            ${sortedOffers.map(function(offer, index) {
                const isBestPrice = index === 0;

                return `
                    <div class="comparison-offer ${isBestPrice ? "best-offer" : ""}">

                        <div class="offer-store">
                            <span class="offer-store-number">
                                0${index + 1}
                            </span>

                            <div>
                                <strong>${offer.store}</strong>

                                ${
                                    isBestPrice
                                        ? '<span class="best-offer-tag">MEJOR PRECIO</span>'
                                        : ""
                                }
                            </div>
                        </div>

                        <strong class="offer-price">
                            ${formatPrice(offer.price)}
                        </strong>

                    </div>
                `;
            }).join("")}

        </div>

        <div class="comparison-savings">
            <div>
                <span>Mayor precio</span>
                <strong>${formatPrice(highestOffer.price)}</strong>
            </div>

            <div>
                <span>Podrías ahorrar</span>
                <strong>${formatPrice(priceDifference)}</strong>
            </div>
        </div>

        <p class="comparison-disclaimer">
            Precios de demostración para el proyecto PRISMA.
            Pueden no coincidir con los precios reales de las tiendas.
        </p>
    `;

    comparisonModal.classList.add("is-visible");
    comparisonModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    comparisonClose.focus();
}


// Close the comparison window.
function closeComparison() {
    comparisonModal.classList.remove("is-visible");
    comparisonModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}


// Listen for clicks on comparison buttons.
productGrid.addEventListener("click", function(event) {
    const compareButton = event.target.closest("[data-compare-id]");

    if (!compareButton) {
        return;
    }

    const productId = Number(compareButton.dataset.compareId);

    openComparison(productId);
});


// Close using the close button.
comparisonClose.addEventListener("click", closeComparison);


// Close when clicking outside the modal content.
comparisonModal.addEventListener("click", function(event) {
    if (event.target === comparisonModal) {
        closeComparison();
    }
});


// Close with the Escape key.
document.addEventListener("keydown", function(event) {
    if (
        event.key === "Escape" &&
        comparisonModal.classList.contains("is-visible")
    ) {
        closeComparison();
    }
});


/* 14. SEARCH EVENT */

searchInput.addEventListener("input", displayProducts);


/* 15. CATEGORY FILTER EVENTS */

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


/* 16. FAVORITES FILTER EVENT */

favoritesToggle.addEventListener("click", function() {
    showFavoritesOnly = !showFavoritesOnly;

    displayProducts();
});


/* 17. SORT EVENT */

sortSelect.addEventListener("change", displayProducts);


/* 18. INITIALIZE APPLICATION */

displayProducts();

console.log("PRISMA: aplicación iniciada correctamente.");