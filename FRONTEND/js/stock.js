// ========================================
// STOCK MANAGEMENT
// ========================================

let allProducts = [];


// ========================================
// DOM ELEMENTS
// ========================================

const stockTableBody =
    document.querySelector("#stockTable tbody");

const stockSearch =
    document.getElementById("stockSearch");

const stockStatusFilter =
    document.getElementById("stockStatusFilter");

const resetStockFilters =
    document.getElementById("resetStockFilters");

const stockCount =
    document.getElementById("stockCount");


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadStockProducts() {

    try {

        const response =
            await authenticatedRequest("/products");

        allProducts = response.data.data;

        displayStockProducts(allProducts);

        updateStockSummary(allProducts);

        populateProductSelects(allProducts);

    } catch (error) {

        console.error(
            "Load stock products error:",
            error
        );

        stockTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-danger py-4">
                    Failed to load stock data.
                </td>
            </tr>
        `;

    }

}


// ========================================
// DISPLAY STOCK PRODUCTS
// ========================================

function displayStockProducts(products) {

    stockTableBody.innerHTML = "";

    stockCount.textContent =
        `${products.length} Products`;


    if (products.length === 0) {

        stockTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    No products found.
                </td>
            </tr>
        `;

        return;

    }


    products.forEach((product, index) => {

        const status =
            getStockStatus(
                product.quantity,
                product.minimum_stock_level
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                <strong>
                    ${escapeHtml(product.name)}
                </strong>

                <br>

                <small class="text-muted">
                    ${escapeHtml(product.sku)}
                </small>
            </td>

            <td>
                ${escapeHtml(
                    product.category_name || "—"
                )}
            </td>

            <td>
                ${escapeHtml(
                    product.supplier_name || "—"
                )}
            </td>

            <td>
                <strong>
                    ${product.quantity}
                </strong>
            </td>

            <td>
                ${product.minimum_stock_level}
            </td>

            <td>
                ${status.badge}
            </td>

            <td class="text-end">

                <button
                    class="btn btn-sm btn-outline-success stock-in-btn"
                    data-product-id="${product.id}"
                    title="Stock in"
                >
                    <i class="bi bi-plus-lg"></i>
                </button>

                <button
                    class="btn btn-sm btn-outline-danger stock-out-btn"
                    data-product-id="${product.id}"
                    title="Stock out"
                >
                    <i class="bi bi-dash-lg"></i>
                </button>

            </td>

        `;


        stockTableBody.appendChild(row);

    });


    attachStockActionButtons();

}


// ========================================
// STOCK STATUS
// ========================================

function getStockStatus(
    quantity,
    minimumStockLevel
) {

    if (Number(quantity) === 0) {

        return {

            name: "out-of-stock",

            badge: `
                <span class="badge text-bg-danger">
                    Out of Stock
                </span>
            `

        };

    }


    if (
        Number(quantity) <=
        Number(minimumStockLevel)
    ) {

        return {

            name: "low-stock",

            badge: `
                <span class="badge text-bg-warning">
                    Low Stock
                </span>
            `

        };

    }


    return {

        name: "in-stock",

        badge: `
            <span class="badge text-bg-success">
                In Stock
            </span>
        `

    };

}


// ========================================
// UPDATE STOCK SUMMARY
// ========================================

function updateStockSummary(products) {

    const totalProducts =
        products.length;


    const totalStock =
        products.reduce(
            (total, product) =>
                total + Number(product.quantity || 0),
            0
        );


    const lowStock =
        products.filter(product =>
            Number(product.quantity) > 0 &&
            Number(product.quantity) <=
            Number(product.minimum_stock_level)
        ).length;


    const outOfStock =
        products.filter(product =>
            Number(product.quantity) === 0
        ).length;


    const summaryCards =
        document.querySelectorAll(
            ".stock-summary-icon"
        );


    if (summaryCards.length >= 4) {

        summaryCards[0]
            .closest(".card")
            .querySelector("h3")
            .textContent = totalProducts;


        summaryCards[1]
            .closest(".card")
            .querySelector("h3")
            .textContent = totalStock;


        summaryCards[2]
            .closest(".card")
            .querySelector("h3")
            .textContent = lowStock;


        summaryCards[3]
            .closest(".card")
            .querySelector("h3")
            .textContent = outOfStock;

    }

}


// ========================================
// POPULATE PRODUCT SELECTS
// ========================================

function populateProductSelects(products) {

    const stockInProduct =
        document.getElementById(
            "stockInProduct"
        );

    const stockOutProduct =
        document.getElementById(
            "stockOutProduct"
        );


    if (!stockInProduct || !stockOutProduct) {
        return;
    }


    stockInProduct.innerHTML = `
        <option value="">
            Select Product
        </option>
    `;


    stockOutProduct.innerHTML = `
        <option value="">
            Select Product
        </option>
    `;


    products.forEach(product => {

        const optionIn =
            document.createElement("option");

        optionIn.value = product.id;

        optionIn.textContent =
            `${product.name} (${product.sku})`;


        const optionOut =
            document.createElement("option");

        optionOut.value = product.id;

        optionOut.textContent =
            `${product.name} (${product.sku})`;


        stockInProduct.appendChild(
            optionIn
        );

        stockOutProduct.appendChild(
            optionOut
        );

    });

}


// ========================================
// SEARCH AND FILTER
// ========================================

function filterStockProducts() {

    const searchTerm =
        stockSearch.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        stockStatusFilter.value;


    const filteredProducts =
        allProducts.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchTerm) ||

                product.sku
                    .toLowerCase()
                    .includes(searchTerm);


            const status =
                getStockStatus(
                    product.quantity,
                    product.minimum_stock_level
                );


            const matchesStatus =
                !selectedStatus ||
                status.name === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    displayStockProducts(
        filteredProducts
    );

}


// ========================================
// RESET FILTERS
// ========================================

function resetFilters() {

    stockSearch.value = "";

    stockStatusFilter.value = "";

    displayStockProducts(
        allProducts
    );

}


// ========================================
// STOCK ACTION BUTTONS
// ========================================

function attachStockActionButtons() {

    document
        .querySelectorAll(".stock-in-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const productId =
                        button.dataset.productId;

                    openStockInModal(
                        productId
                    );

                }
            );

        });


    document
        .querySelectorAll(".stock-out-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const productId =
                        button.dataset.productId;

                    openStockOutModal(
                        productId
                    );

                }
            );

        });

}


// ========================================
// OPEN STOCK IN MODAL
// ========================================

function openStockInModal(productId) {

    const select =
        document.getElementById(
            "stockInProduct"
        );


    select.value = productId;


    const modalElement =
        document.getElementById(
            "stockInModal"
        );


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


// ========================================
// OPEN STOCK OUT MODAL
// ========================================

function openStockOutModal(productId) {

    const select =
        document.getElementById(
            "stockOutProduct"
        );


    select.value = productId;


    const modalElement =
        document.getElementById(
            "stockOutModal"
        );


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


// ========================================
// EVENT LISTENERS
// ========================================

if (stockSearch) {

    stockSearch.addEventListener(
        "input",
        filterStockProducts
    );

}


if (stockStatusFilter) {

    stockStatusFilter.addEventListener(
        "change",
        filterStockProducts
    );

}


if (resetStockFilters) {

    resetStockFilters.addEventListener(
        "click",
        resetFilters
    );

}


// ========================================
// INITIALIZE STOCK PAGE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadStockProducts();

    }
);

