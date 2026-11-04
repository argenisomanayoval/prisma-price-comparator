
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
const filterButtons = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("sort-select");
const resultsCount = document.getElementById("results-count");


/* 3. APPLICATION STATE */

let selectedCategory = "all";


/* 4. FORMAT PRICES */

function formatPrice(price) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0
    }).format(price);
}


/* 5. FILTER, SEARCH AND SORT PRODUCTS */

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

        return matchesSearch && matchesCategory;
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


/* 6. DISPLAY PRODUCTS */

function displayProducts() {
    const filteredProducts = getFilteredProducts();

    resultsCount.textContent =
        `${filteredProducts.length} ${
            filteredProducts.length === 1 ? "producto" : "productos"
        }`;

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state">
                <h3>No encontramos resultados.</h3>
                <p>Intenta con otro nombre, marca o categoría.</p>
            </div>
        `;

        return;
    }

    productGrid.innerHTML = filteredProducts.map(function(product) {
        return `
            <article class="product-card">

                <div class="product-image">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >
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


/* 7. SEARCH EVENT */

searchInput.addEventListener("input", displayProducts);


/* 8. CATEGORY FILTER EVENTS */

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


/* 9. SORT EVENT */

sortSelect.addEventListener("change", displayProducts);


/* 10. INITIALIZE APPLICATION */

displayProducts();

console.log("PRISMA: aplicación iniciada correctamente.");