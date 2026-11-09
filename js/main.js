
/* =========================================
   PRISMA — MAIN JAVASCRIPT
   Favorites + Price Comparison + Product Details
   ========================================= */


/* 1. PRODUCT DATABASE */

const products = [
    {
        id: 1,
        name: "iPhone 16",
        category: "Smartphones",
        brand: "Apple",
        description: "Smartphone con pantalla Super Retina, chip A18 y sistema avanzado de cámaras.",
        image: "https://placehold.co/600x450/f3f1ec/202020?text=iPhone+16",
        offers: [
            { store: "Apple Store", price: 17499 },
            { store: "Amazon", price: 16499 },
            { store: "Liverpool", price: 16999 }
        ],
        specifications: [
            { label: "Pantalla", value: "6.1 pulgadas Super Retina XDR" },
            { label: "Procesador", value: "Apple A18" },
            { label: "Almacenamiento", value: "128 GB" },
            { label: "Cámara principal", value: "48 MP" },
            { label: "Sistema operativo", value: "iOS" },
            { label: "Conectividad", value: "5G, Wi-Fi y Bluetooth" }
        ],
        priceHistory: [18299, 17999, 17499, 17299, 16999, 16499]
    },
    {
        id: 2,
        name: "MacBook Air M4",
        category: "Laptops",
        brand: "Apple",
        description: "Laptop ligera con chip M4, diseñada para productividad, creatividad y movilidad.",
        image: "https://placehold.co/600x450/f3f1ec/202020?text=MacBook+Air",
        offers: [
            { store: "MacStore", price: 22999 },
            { store: "Amazon", price: 22499 },
            { store: "Liverpool", price: 23999 }
        ],
        specifications: [
            { label: "Pantalla", value: "13.6 pulgadas Liquid Retina" },
            { label: "Procesador", value: "Apple M4" },
            { label: "Memoria", value: "16 GB unificada" },
            { label: "Almacenamiento", value: "256 GB SSD" },
            { label: "Sistema operativo", value: "macOS" },
            { label: "Conectividad", value: "Wi-Fi y Bluetooth" }
        ],
        priceHistory: [24999, 24499, 23999, 23499, 22999, 22499]
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        category: "Audio",
        brand: "Sony",
        description: "Audífonos inalámbricos premium con cancelación de ruido y sonido de alta calidad.",
        image: "https://placehold.co/600x450/f3f1ec/202020?text=Sony+Headphones",
        offers: [
            { store: "Sony Store", price: 5499 },
            { store: "Amazon", price: 4999 },
            { store: "Liverpool", price: 5299 }
        ],
        specifications: [
            { label: "Tipo", value: "Audífonos inalámbricos over-ear" },
            { label: "Cancelación de ruido", value: "Activa" },
            { label: "Conectividad", value: "Bluetooth 5.2" },
            { label: "Autonomía", value: "Hasta 30 horas" },
            { label: "Carga", value: "USB-C" },
            { label: "Micrófonos", value: "Integrados" }
        ],
        priceHistory: [6299, 5999, 5799, 5499, 5299, 4999]
    },
    {
        id: 4,
        name: "PlayStation 5 Slim",
        category: "Gaming",
        brand: "Sony",
        description: "Consola de nueva generación con gráficos de alta calidad y almacenamiento SSD.",
        image: "https://placehold.co/600x450/f3f1ec/202020?text=PlayStation+5",
        offers: [
            { store: "PlayStation Store", price: 9499 },
            { store: "Amazon", price: 8999 },
            { store: "Liverpool", price: 9299 }
        ],
        specifications: [
            { label: "Tipo", value: "Consola de videojuegos" },
            { label: "Resolución", value: "Hasta 4K" },
            { label: "Almacenamiento", value: "SSD de 1 TB" },
            { label: "Unidad óptica", value: "Según versión" },
            { label: "Conectividad", value: "Wi-Fi, Bluetooth y HDMI" },
            { label: "Fabricante", value: "Sony" }
        ],
        priceHistory: [10499, 9999, 9799, 9599, 9299, 8999]
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


/* 4. LOAD FAVORITES */

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


/* 5. SAVE FAVORITES */

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

function getBestOffer(product) {
    return product.offers.reduce(function(bestOffer, currentOffer) {
        return currentOffer.price < bestOffer.price
            ? currentOffer
            : bestOffer;
    });
}

function getHighestOffer(product) {
    return product.offers.reduce(function(highestOffer, currentOffer) {
        return currentOffer.price > highestOffer.price
            ? currentOffer
            : highestOffer;
    });
}

function getPriceDifference(product) {
    return getHighestOffer(product).price - getBestOffer(product).price;
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
                        <span>${product.offers.length} tiendas comparadas</span>
                        <span>Ahorra hasta ${formatPrice(priceDifference)}</span>
                    </div>

                    <button
                        class="details-btn"
                        type="button"
                        data-details-id="${product.id}"
                    >
                        Ver ficha del producto
                        <span>↗</span>
                    </button>

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


/* 11. TOGGLE FAVORITES */

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


/* 12. CREATE COMPARISON MODAL */

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


/* 13. OPEN PRICE COMPARISON */

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
                            <span class="offer-store-number">0${index + 1}</span>
                            <div>
                                <strong>${offer.store}</strong>
                                ${isBestPrice
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


/* 14. CLOSE PRICE COMPARISON */

function closeComparison() {
    comparisonModal.classList.remove("is-visible");
    comparisonModal.setAttribute("aria-hidden", "true");

    if (!detailsModal.classList.contains("is-visible")) {
        document.body.classList.remove("modal-open");
    }
}

comparisonClose.addEventListener("click", closeComparison);

comparisonModal.addEventListener("click", function(event) {
    if (event.target === comparisonModal) {
        closeComparison();
    }
});


/* 15. CREATE PRODUCT DETAILS MODAL */

const detailsModal = document.createElement("div");

detailsModal.className = "details-modal";
detailsModal.id = "details-modal";
detailsModal.setAttribute("aria-hidden", "true");

detailsModal.innerHTML = `
    <div
        class="details-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
    >
        <button
            class="details-close"
            type="button"
            aria-label="Cerrar ficha del producto"
        >
            ×
        </button>

        <div id="details-content"></div>
    </div>
`;

document.body.appendChild(detailsModal);

const detailsContent = document.getElementById("details-content");
const detailsClose = detailsModal.querySelector(".details-close");


/* 16. GENERATE PRICE HISTORY */

function generatePriceHistory(product) {
    const history = product.priceHistory;
    const maximum = Math.max(...history);
    const minimum = Math.min(...history);
    const range = maximum - minimum || 1;

    const labels = [
        "Hace 5 meses",
        "Hace 4 meses",
        "Hace 3 meses",
        "Hace 2 meses",
        "Hace 1 mes",
        "Actual"
    ];

    return history.map(function(price, index) {
        const height = 25 + ((price - minimum) / range) * 75;

        return `
            <div class="history-column">
                <span class="history-price">${formatPrice(price)}</span>

                <div class="history-bar-container">
                    <div
                        class="history-bar ${index === history.length - 1 ? "current-bar" : ""}"
                        style="height: ${height}%"
                        title="${formatPrice(price)}"
                    ></div>
                </div>

                <span class="history-label">${labels[index]}</span>
            </div>
        `;
    }).join("");
}


/* 17. OPEN PRODUCT DETAILS */

function openProductDetails(productId) {
    const product = products.find(function(item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    const bestOffer = getBestOffer(product);
    const highestOffer = getHighestOffer(product);
    const priceDifference = getPriceDifference(product);

    const specificationsHTML = product.specifications.map(function(specification) {
        return `
            <div class="specification-row">
                <span>${specification.label}</span>
                <strong>${specification.value}</strong>
            </div>
        `;
    }).join("");

    const sortedOffers = [...product.offers].sort(function(a, b) {
        return a.price - b.price;
    });

    const offersHTML = sortedOffers.map(function(offer, index) {
        return `
            <div class="detail-offer ${index === 0 ? "detail-best-offer" : ""}">
                <div class="detail-store">
                    <strong>${offer.store}</strong>
                    ${index === 0
                        ? '<span class="best-offer-tag">MEJOR PRECIO</span>'
                        : ""
                    }
                </div>

                <strong class="detail-offer-price">
                    ${formatPrice(offer.price)}
                </strong>
            </div>
        `;
    }).join("");

    detailsContent.innerHTML = `
        <div class="details-breadcrumb">
            PRISMA / ${product.category.toUpperCase()} / ${product.brand.toUpperCase()}
        </div>

        <div class="details-hero">
            <div class="details-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="details-main-info">
                <span class="details-category">${product.category}</span>

                <h2 id="details-title">${product.name}<span>.</span></h2>

                <p class="details-description">
                    ${product.description}
                </p>

                <div class="details-best-price">
                    <span>MEJOR PRECIO DISPONIBLE</span>
                    <strong>${formatPrice(bestOffer.price)}</strong>
                    <p>En ${bestOffer.store}</p>
                </div>

                <button
                    class="details-compare-action"
                    type="button"
                    data-details-compare="${product.id}"
                >
                    Comparar todas las ofertas ↗
                </button>
            </div>
        </div>

        <section class="details-section">
            <div class="details-section-heading">
                <span>01 — INFORMACIÓN</span>
                <h3>Características técnicas<span>.</span></h3>
            </div>

            <div class="specifications-list">
                ${specificationsHTML}
            </div>
        </section>

        <section class="details-section">
            <div class="details-section-heading">
                <span>02 — COMPARACIÓN</span>
                <h3>Encuentra el mejor precio<span>.</span></h3>
            </div>

            <div class="details-offers">
                ${offersHTML}
            </div>

            <div class="details-savings">
                <span>Diferencia entre la oferta más alta y la más baja</span>
                <strong>${formatPrice(priceDifference)}</strong>
            </div>
        </section>

        <section class="details-section">
            <div class="details-section-heading">
                <span>03 — EVOLUCIÓN</span>
                <h3>Historial de precios<span>.</span></h3>
                <p>
                    Evolución ilustrativa del precio durante los últimos seis meses.
                </p>
            </div>

            <div class="price-history-chart">
                ${generatePriceHistory(product)}
            </div>

            <div class="history-summary">
                <div>
                    <span>Precio más alto</span>
                    <strong>${formatPrice(highestOffer.price)}</strong>
                </div>

                <div>
                    <span>Precio más bajo</span>
                    <strong>${formatPrice(bestOffer.price)}</strong>
                </div>
            </div>

            <p class="history-disclaimer">
                El historial utiliza datos de demostración y no representa
                registros reales de las tiendas.
            </p>
        </section>
    `;

    detailsModal.classList.add("is-visible");
    detailsModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    detailsClose.focus();
}


/* 18. CLOSE PRODUCT DETAILS */

function closeProductDetails() {
    detailsModal.classList.remove("is-visible");
    detailsModal.setAttribute("aria-hidden", "true");

    if (!comparisonModal.classList.contains("is-visible")) {
        document.body.classList.remove("modal-open");
    }
}

detailsClose.addEventListener("click", closeProductDetails);

detailsModal.addEventListener("click", function(event) {
    if (event.target === detailsModal) {
        closeProductDetails();
    }
});


/* 19. EVENT DELEGATION FOR PRODUCT CARDS */

productGrid.addEventListener("click", function(event) {
    const favoriteButton = event.target.closest("[data-favorite-id]");

    if (favoriteButton) {
        const productId = Number(favoriteButton.dataset.favoriteId);
        toggleFavorite(productId);
        return;
    }

    const compareButton = event.target.closest("[data-compare-id]");

    if (compareButton) {
        const productId = Number(compareButton.dataset.compareId);
        openComparison(productId);
        return;
    }

    const detailsButton = event.target.closest("[data-details-id]");

    if (detailsButton) {
        const productId = Number(detailsButton.dataset.detailsId);
        openProductDetails(productId);
    }
});


/* 20. COMPARE FROM PRODUCT DETAILS */

detailsContent.addEventListener("click", function(event) {
    const compareButton = event.target.closest("[data-details-compare]");

    if (!compareButton) {
        return;
    }

    const productId = Number(compareButton.dataset.detailsCompare);

    closeProductDetails();
    openComparison(productId);
});


/* 21. KEYBOARD ACCESSIBILITY */

document.addEventListener("keydown", function(event) {
    if (event.key !== "Escape") {
        return;
    }

    if (detailsModal.classList.contains("is-visible")) {
        closeProductDetails();
        return;
    }

    if (comparisonModal.classList.contains("is-visible")) {
        closeComparison();
    }
});


/* 22. SEARCH EVENT */

searchInput.addEventListener("input", displayProducts);


/* 23. CATEGORY FILTER EVENTS */

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


/* 24. FAVORITES FILTER EVENT */

favoritesToggle.addEventListener("click", function() {
    showFavoritesOnly = !showFavoritesOnly;
    displayProducts();
});


/* 25. SORT EVENT */

sortSelect.addEventListener("change", displayProducts);


/* 26. INITIALIZE APPLICATION */

displayProducts();

console.log("PRISMA: aplicación iniciada correctamente.");