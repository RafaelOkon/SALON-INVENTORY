// ========================================
// STOCK MANAGEMENT
// ======================================
let allProducts = [];

let stockInSubmitting = false;
let stockOutSubmitting = false;

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

const transactionTableBody =
    document.getElementById("transactionTableBody");

const transactionCount =
    document.getElementById("transactionCount");


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadStockProducts() {

    try {

        const response =
            await authenticatedRequest("/products");

        allProducts =
            response.data.data || [];

        displayStockProducts(allProducts);

        updateStockSummary(allProducts);

        populateProductSelects(allProducts);

    } catch (error) {

        console.error(
            "Load stock products error:",
            error
        );

        if (stockTableBody) {

            stockTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        class="text-center text-danger py-4"
                    >
                        Failed to load stock data.
                    </td>
                </tr>
            `;

        }

    }

}


// ========================================
// DISPLAY STOCK PRODUCTS
// ========================================

function displayStockProducts(products) {

    if (!stockTableBody) {
        return;
    }

    stockTableBody.innerHTML = "";

    if (stockCount) {

        stockCount.textContent =
            `${products.length} Products`;

    }


    if (products.length === 0) {

        stockTableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="text-center text-muted py-4"
                >
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

                <button
                    class="btn btn-sm btn-outline-primary stock-history-btn"
                    data-product-id="${product.id}"
                    title="View stock history"
                >
                    <i class="bi bi-clock-history"></i>
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

        optionIn.value =
            product.id;

        optionIn.textContent =
            `${product.name} (${product.sku})`;


        const optionOut =
            document.createElement("option");

        optionOut.value =
            product.id;

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

    // STOCK IN BUTTONS

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


    // STOCK OUT BUTTONS

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


    // STOCK HISTORY BUTTONS

    document
        .querySelectorAll(".stock-history-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const productId =
                        button.dataset.productId;

                    viewProductStockHistory(
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


    if (!select) {
        return;
    }


    select.value =
        productId;


    const modalElement =
        document.getElementById(
            "stockInModal"
        );


    if (!modalElement) {
        return;
    }


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


    if (!select) {
        return;
    }


    select.value =
        productId;


    updateAvailableStockDisplay(
        productId
    );


    const modalElement =
        document.getElementById(
            "stockOutModal"
        );


    if (!modalElement) {
        return;
    }


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


// ========================================
// SHOW AVAILABLE STOCK
// ========================================

function updateAvailableStockDisplay(productId) {

    const quantityInput =
        document.getElementById(
            "stockOutQuantity"
        );


    if (!quantityInput) {
        return;
    }


    let stockInfo =
        document.getElementById(
            "stockOutAvailableStock"
        );


    if (!stockInfo) {

        stockInfo =
            document.createElement("div");

        stockInfo.id =
            "stockOutAvailableStock";

        stockInfo.className =
            "form-text fw-semibold text-primary";


        quantityInput.parentElement
            .appendChild(stockInfo);

    }


    const product =
        allProducts.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (product) {

        stockInfo.textContent =
            `Available stock: ${Number(
                product.quantity
            )}`;

    } else {

        stockInfo.textContent = "";

    }

}


// ========================================
// SUBMIT STOCK IN
// ========================================

async function submitStockIn(event) {

        if (stockInSubmitting) {
            return;
        }

        stockInSubmitting = true;

    event.preventDefault();


    const form =
        event.target;


    const productId =
        document.getElementById(
            "stockInProduct"
        ).value;


    const quantity =
        document.getElementById(
            "stockInQuantity"
        ).value;

    const reason =
        document.getElementById(
            "stockInReason"
        ).value;

    const note =
        document.getElementById(
            "stockInNote"
        ).value.trim();


    // ========================================
    // VALIDATE PRODUCT
    // ========================================

    if (!productId) {

        alert(
            "Please select a product."
        );

        return;

    }


    // ========================================
    // VALIDATE QUANTITY
    // ========================================

    const parsedQuantity =
        Number(quantity);


    if (
        quantity === "" ||
        !Number.isInteger(parsedQuantity) ||
        parsedQuantity <= 0
    ) {

        alert(
            "Please enter a valid positive whole number."
        );

        return;

    }


    try {

        const response =
            await authenticatedRequest(
                "/stock-transactions",
            {
                method: "POST",

                body: JSON.stringify({
                    product_id: Number(productId),

                    transaction_type: "STOCK_IN",

                    quantity: parsedQuantity,

                    notes: reason
                        ? `${reason}${note ? " - " + note : ""}`
                        : (note || null)
                })
            }
            );


        alert(
            response.data.message ||
            `Stock In successful!\n\nQuantity added: ${parsedQuantity}`
        );


        // ========================================
        // CLOSE MODAL
        // ========================================

        const modalElement =
            document.getElementById(
                "stockInModal"
            );


        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );


        if (modal) {
            modal.hide();
        }


        // ========================================
        // RESET FORM
        // ========================================

        form.reset();


        // ========================================
        // REFRESH DATA
        // ========================================

        await loadStockProducts();

        await loadStockTransactions();

    } catch (error) {

        console.error(
            "Stock In error:",
            error
        );


        alert(
            error.message ||
            "Failed to add stock."
        );
    } finally {
        stockInSubmitting = false;
    }
}


// ========================================
// SUBMIT STOCK OUT
// ========================================

async function submitStockOut(event) {

    if (stockOutSubmitting) {
        return;
    }

    stockOutSubmitting = true;

    event.preventDefault();


    const form =
        event.target;


    const productId =
        document.getElementById(
            "stockOutProduct"
        ).value;


    const quantity =
        document.getElementById(
            "stockOutQuantity"
        ).value;

        const reason =
         document.getElementById(
            "stockOutReason"
        ).value;


    const note =
        document.getElementById(
            "stockOutNote"
        ).value.trim();


    // ========================================
    // VALIDATE PRODUCT
    // ========================================

    if (!productId) {

        alert(
            "Please select a product."
        );

        return;

    }


    // ========================================
    // VALIDATE QUANTITY
    // ========================================

    const parsedQuantity =
        Number(quantity);


    if (
        quantity === "" ||
        !Number.isInteger(parsedQuantity) ||
        parsedQuantity <= 0
    ) {

        alert(
            "Please enter a valid positive whole number."
        );

        return;

    }


    try {

        const response =
            await authenticatedRequest(
                "/stock-transactions",
             {
                method: "POST",

                body: JSON.stringify({
                    product_id: Number(productId),

                    transaction_type: "STOCK_OUT",

                    quantity: parsedQuantity,

                    notes: reason
                        ? `${reason}${note ? " - " + note : ""}`
                        : (note || null)
                })
            }
            );


        alert(
            response.data.message ||
            `Stock Out successful!\n\nQuantity removed: ${parsedQuantity}`
        );


        // ========================================
        // CLOSE MODAL
        // ========================================

        const modalElement =
            document.getElementById(
                "stockOutModal"
            );


        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );


        if (modal) {
            modal.hide();
        }


        // ========================================
        // RESET FORM
        // ========================================

        form.reset();


        // ========================================
        // REFRESH DATA
        // ========================================

        await loadStockProducts();

        await loadStockTransactions();

    } catch (error) {

        console.error(
            "Stock Out error:",
            error
        );


        if (
            error.message &&
            error.message
                .toLowerCase()
                .includes("insufficient stock")
        ) {

            alert(
                "Insufficient stock. " +
                "The available stock cannot cover this quantity."
            );

            return;

        }


        alert(
            error.message ||
            "Failed to process stock out."
        );

    } finally {
        stockOutSubmitting = false;
    }
}

// ========================================
// LOAD STOCK TRANSACTIONS
// ========================================

async function loadStockTransactions() {

    try {

        const response =
            await authenticatedRequest(
                "/stock-transactions"
            );


        const transactions =
            response.data.data || [];


        displayStockTransactions(
            transactions
        );

    } catch (error) {

        console.error(
            "Load stock transactions error:",
            error
        );


        if (transactionTableBody) {

            transactionTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        class="text-center text-danger py-4"
                    >

                        Failed to load transaction history.

                    </td>

                </tr>

            `;

        }

    }

}


// ========================================
// DISPLAY STOCK TRANSACTIONS
// ========================================

function displayStockTransactions(
    transactions
) {

    if (!transactionTableBody) {
        return;
    }


    if (transactionCount) {

        transactionCount.textContent =
            `${transactions.length} Transactions`;

    }


    if (transactions.length === 0) {

        transactionTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center text-muted py-4"
                >

                    No stock transactions found.

                </td>

            </tr>

        `;

        return;

    }


    transactionTableBody.innerHTML =
        transactions
            .map(
                (transaction, index) => {

                    const isStockIn =
                        transaction.transaction_type ===
                        "STOCK_IN";


                    const typeBadge =
                        isStockIn

                            ? `
                                <span
                                    class="badge text-bg-success"
                                >
                                    STOCK IN
                                </span>
                              `

                            : `
                                <span
                                    class="badge text-bg-danger"
                                >
                                    STOCK OUT
                                </span>
                              `;


                    return `

                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                ${escapeHtml(
                                    transaction.product_name ||
                                    "—"
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    transaction.sku ||
                                    "—"
                                )}
                            </td>

                            <td>
                                ${typeBadge}
                            </td>

                            <td class="fw-bold">
                                ${transaction.quantity}
                            </td>

                            <td>
                                ${escapeHtml(
                                    transaction.user_name ||
                                    "—"
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    transaction.notes ||
                                    "—"
                                )}
                            </td>

                            <td>
                                ${
                                    transaction.created_at
                                        ? new Date(
                                            transaction.created_at
                                          ).toLocaleString()
                                        : "—"
                                }
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


// ========================================
// VIEW PRODUCT STOCK HISTORY
// ========================================

async function viewProductStockHistory(
    productId
) {

    const modalElement =
        document.getElementById(
            "stockHistoryModal"
        );


    const loadingElement =
        document.getElementById(
            "stockHistoryLoading"
        );


    const emptyElement =
        document.getElementById(
            "stockHistoryEmpty"
        );


    const tableContainer =
        document.getElementById(
            "stockHistoryTableContainer"
        );


    const tableBody =
        document.getElementById(
            "stockHistoryTableBody"
        );


    if (!modalElement) {
        return;
    }


    // ========================================
    // RESET MODAL
    // ========================================

    loadingElement.classList.remove(
        "d-none"
    );

    emptyElement.classList.add(
        "d-none"
    );

    tableContainer.classList.add(
        "d-none"
    );

    tableBody.innerHTML = "";


    // ========================================
    // SHOW MODAL
    // ========================================

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();


    try {

        const response =
            await authenticatedRequest(
                `/stock-transactions/product/${productId}`
            );


        const transactions =
            response.data.data || [];


        // ========================================
        // HIDE LOADING
        // ========================================

        loadingElement.classList.add(
            "d-none"
        );


        // ========================================
        // EMPTY STATE
        // ========================================

        if (transactions.length === 0) {

            emptyElement.classList.remove(
                "d-none"
            );

            return;

        }


        // ========================================
        // DISPLAY HISTORY
        // ========================================

        tableBody.innerHTML =
            transactions
                .map(
                    transaction => {

                        const isStockIn =
                            transaction.transaction_type ===
                            "STOCK_IN";


                        const badge =
                            isStockIn

                                ? `
                                    <span
                                        class="badge text-bg-success"
                                    >
                                        STOCK IN
                                    </span>
                                  `

                                : `
                                    <span
                                        class="badge text-bg-danger"
                                    >
                                        STOCK OUT
                                    </span>
                                  `;


                        const date =
                            transaction.created_at
                                ? new Date(
                                    transaction.created_at
                                  ).toLocaleString()
                                : "—";


                        return `

                            <tr>

                                <td>
                                    ${escapeHtml(date)}
                                </td>

                                <td>
                                    ${badge}
                                </td>

                                <td class="fw-bold">
                                    ${transaction.quantity}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        transaction.user_name ||
                                        "—"
                                    )}
                                </td>

                                <td>
                                    ${escapeHtml(
                                        transaction.notes ||
                                        "—"
                                    )}
                                </td>

                            </tr>

                        `;

                    }
                )
                .join("");


        tableContainer.classList.remove(
            "d-none"
        );


    } catch (error) {

        console.error(
            "Product stock history error:",
            error
        );


        loadingElement.classList.add(
            "d-none"
        );

        emptyElement.classList.remove(
            "d-none"
        );


        emptyElement.innerHTML = `

            <i
                class="bi bi-exclamation-triangle
                       fs-1 d-block mb-2 text-danger"
            ></i>

            <span class="text-danger">
                Failed to load transaction history.
            </span>

        `;

    }

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
// UPDATE AVAILABLE STOCK WHEN PRODUCT CHANGES
// ========================================

const stockOutProduct =
    document.getElementById(
        "stockOutProduct"
    );


if (stockOutProduct) {

    stockOutProduct.addEventListener(
        "change",
        () => {

            updateAvailableStockDisplay(
                stockOutProduct.value
            );

        }
    );

}


// ========================================
// SEARCH EVENT
// ========================================

if (stockSearch) {

    stockSearch.addEventListener(
        "input",
        filterStockProducts
    );

}


// ========================================
// STATUS FILTER EVENT
// ========================================

if (stockStatusFilter) {

    stockStatusFilter.addEventListener(
        "change",
        filterStockProducts
    );

}


// ========================================
// RESET FILTER EVENT
// ========================================

if (resetStockFilters) {

    resetStockFilters.addEventListener(
        "click",
        resetFilters
    );

}


// ========================================
// STOCK FORM LISTENERS
// ========================================

const stockInForm =
    document.getElementById(
        "stockInForm"
    );


const stockOutForm =
    document.getElementById(
        "stockOutForm"
    );


if (stockInForm) {

    stockInForm.addEventListener(
        "submit",
        submitStockIn
    );

}


if (stockOutForm) {

    stockOutForm.addEventListener(
        "submit",
        submitStockOut
    );

}


// ========================================
// INITIALIZE STOCK PAGE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadStockProducts();

        loadStockTransactions();

    }
);
