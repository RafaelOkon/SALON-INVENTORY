// ========================================
// PRODUCTS PAGE
// ========================================

let allProducts = [];


// ========================================
// DOM ELEMENTS
// ========================================

const productsTableBody =
    document.getElementById("productsTableBody");

const productCount =
    document.getElementById("productCount");

const productSearch =
    document.getElementById("productSearch");

const categoryFilter =
    document.getElementById("categoryFilter");

const supplierFilter =
    document.getElementById("supplierFilter");

const stockFilter =
    document.getElementById("stockFilter");

const resetFilters =
    document.getElementById("resetFilters");


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeProductsPage
);


async function initializeProductsPage() {

    console.log("Products page loaded");

    setupEvents();

    await loadProducts();

}


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

    showLoading();

    try {

        const response =
            await authenticatedRequest(
                "/products",
                {
                    method: "GET"
                }
            );

        console.log(
            "Products API response:",
            response
        );


        if (!response) {

            throw new Error(
                "No response received from server"
            );

        }


        if (!response.success) {

            throw new Error(
                response.data?.message ||
                "Failed to load products"
            );

        }


        // Backend response:
        //
        // {
        //     success: true,
        //     data: [...]
        // }

        let products = [];


        if (Array.isArray(response.data)) {

            products =
                response.data;

        } else if (
            Array.isArray(response.data?.data)
        ) {

            products =
                response.data.data;

        }


        allProducts =
            products;


        console.log(
            "Products loaded:",
            allProducts
        );


        displayProducts(
            allProducts
        );


        loadCategories(
            allProducts
        );


        loadSuppliers(
            allProducts
        );


    } catch (error) {

        console.error(
            "Load products error:",
            error
        );


        showError(
            error.message
        );

    }

}


// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayProducts(products) {

    if (!productsTableBody) {

        console.error(
            "ERROR: #productsTableBody not found"
        );

        return;

    }


    productsTableBody.innerHTML = "";


    if (
        !Array.isArray(products) ||
        products.length === 0
    ) {

        productsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center text-muted py-4"
                >

                    <i
                        class="bi bi-box-seam fs-3 d-block mb-2"
                    ></i>

                    No products found.

                </td>

            </tr>

        `;


        updateProductCount(0);

        return;

    }


    products.forEach(
        (product, index) => {

            const quantity =
                Number(
                    product.quantity ?? 0
                );


            const minimumStock =
                Number(
                    product.minimum_stock_level ??
                    product.reorder_level ??
                    0
                );


            const status =
                getStockStatus(
                    quantity,
                    minimumStock
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>

                    <strong>
                        ${escapeHtml(
                            product.name || "-"
                        )}
                    </strong>

                    ${
                        product.sku
                            ? `
                                <small class="d-block text-muted">
                                    SKU:
                                    ${escapeHtml(
                                        product.sku
                                    )}
                                </small>
                            `
                            : ""
                    }

                </td>

                <td>
                    ${escapeHtml(
                        product.category_name ||
                        product.category ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        product.supplier_name ||
                        product.supplier ||
                        "-"
                    )}
                </td>

                <td>
                    ₦${formatNumber(
                        product.price
                    )}
                </td>

                <td>
                    ${quantity}
                </td>

                <td>

                    <span
                        class="badge ${status.className}"
                    >
                        ${status.label}
                    </span>

                </td>

                <td class="text-end">

                    <button
                        type="button"
                        class="btn btn-sm btn-outline-primary edit-product-btn"
                        data-product-id="${product.id}"
                        title="Edit product"
                    >

                        <i class="bi bi-pencil"></i>

                    </button>

                    <button
                        type="button"
                        class="btn btn-sm btn-outline-danger delete-product-btn"
                        data-product-id="${product.id}"
                        title="Delete product"
                    >

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            `;


            productsTableBody.appendChild(
                row
            );

        }
    );


    updateProductCount(
        products.length
    );

}


// ========================================
// STOCK STATUS
// ========================================

function getStockStatus(
    quantity,
    minimumStock
) {

    if (quantity === 0) {

        return {

            label: "Out of Stock",

            className:
                "text-bg-danger"

        };

    }


    if (
        minimumStock > 0 &&
        quantity <= minimumStock
    ) {

        return {

            label: "Low Stock",

            className:
                "text-bg-warning"

        };

    }


    return {

        label: "In Stock",

        className:
            "text-bg-success"

    };

}


// ========================================
// LOAD CATEGORIES
// ========================================

function loadCategories(products) {

    if (!categoryFilter) {

        console.warn(
            "#categoryFilter not found"
        );

        return;

    }


    const categories =
        new Map();


    products.forEach(
        product => {

            const id =
                product.category_id;


            const name =
                product.category_name ||
                product.category;


            if (id && name) {

                categories.set(
                    id,
                    name
                );

            }

        }
    );


    categoryFilter.innerHTML = `

        <option value="">
            All Categories
        </option>

    `;


    categories.forEach(
        (name, id) => {

            const option =
                document.createElement("option");


            option.value =
                id;


            option.textContent =
                name;


            categoryFilter.appendChild(
                option
            );

        }
    );

}


// ========================================
// LOAD SUPPLIERS
// ========================================

function loadSuppliers(products) {

    if (!supplierFilter) {

        console.warn(
            "#supplierFilter not found - skipping supplier filter"
        );

        return;

    }


    const suppliers =
        new Map();


    products.forEach(
        product => {

            const id =
                product.supplier_id;


            const name =
                product.supplier_name ||
                product.supplier;


            if (id && name) {

                suppliers.set(
                    id,
                    name
                );

            }

        }
    );


    supplierFilter.innerHTML = `

        <option value="">
            All Suppliers
        </option>

    `;


    suppliers.forEach(
        (name, id) => {

            const option =
                document.createElement("option");


            option.value =
                id;


            option.textContent =
                name;


            supplierFilter.appendChild(
                option
            );

        }
    );

}


// ========================================
// FILTER PRODUCTS
// ========================================

function filterProducts() {

    const search =
        productSearch?.value
            .trim()
            .toLowerCase() || "";


    const category =
        categoryFilter?.value || "";


    const supplier =
        supplierFilter?.value || "";


    const stock =
        stockFilter?.value || "";


    const filteredProducts =
        allProducts.filter(
            product => {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const sku =
                    String(
                        product.sku || ""
                    ).toLowerCase();


                const description =
                    String(
                        product.description || ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    name.includes(search) ||
                    sku.includes(search) ||
                    description.includes(search);


                const matchesCategory =
                    !category ||
                    String(
                        product.category_id ?? ""
                    ) === String(category);


                const matchesSupplier =
                    !supplier ||
                    String(
                        product.supplier_id ?? ""
                    ) === String(supplier);


                const quantity =
                    Number(
                        product.quantity ?? 0
                    );


                const minimumStock =
                    Number(
                        product.minimum_stock_level ??
                        product.reorder_level ??
                        0
                    );


                let matchesStock = true;


                if (
                    stock === "in-stock"
                ) {

                    matchesStock =
                        quantity > minimumStock;

                }


                if (
                    stock === "low-stock"
                ) {

                    matchesStock =
                        quantity > 0 &&
                        quantity <= minimumStock;

                }


                if (
                    stock === "out-of-stock"
                ) {

                    matchesStock =
                        quantity === 0;

                }


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesSupplier &&
                    matchesStock
                );

            }
        );


    displayProducts(
        filteredProducts
    );

}


// ========================================
// EVENTS
// ========================================

function setupEvents() {

    // SEARCH

    if (productSearch) {

        productSearch.addEventListener(
            "input",
            filterProducts
        );

    }


    // CATEGORY

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    // SUPPLIER

    if (supplierFilter) {

        supplierFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    // STOCK

    if (stockFilter) {

        stockFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    // RESET

    if (resetFilters) {

        resetFilters.addEventListener(
            "click",
            resetProductFilters
        );

    }


    // EDIT / DELETE

    if (productsTableBody) {

        productsTableBody.addEventListener(
            "click",
            handleProductTableClick
        );

    }

}


// ========================================
// RESET FILTERS
// ========================================

function resetProductFilters() {

    if (productSearch) {

        productSearch.value = "";

    }


    if (categoryFilter) {

        categoryFilter.value = "";

    }


    if (supplierFilter) {

        supplierFilter.value = "";

    }


    if (stockFilter) {

        stockFilter.value = "";

    }


    displayProducts(
        allProducts
    );

}


// ========================================
// EDIT / DELETE BUTTONS
// ========================================

function handleProductTableClick(event) {

    const editButton =
        event.target.closest(
            ".edit-product-btn"
        );


    const deleteButton =
        event.target.closest(
            ".delete-product-btn"
        );


    if (editButton) {

        const productId =
            editButton.dataset.productId;


        console.log(
            "Edit product:",
            productId
        );

        // Edit feature will be added next.

        return;

    }


    if (deleteButton) {

        const productId =
            deleteButton.dataset.productId;


        console.log(
            "Delete product:",
            productId
        );

        // Delete feature will be added next.

    }

}


// ========================================
// PRODUCT COUNT
// ========================================

function updateProductCount(count) {

    if (!productCount) {

        return;

    }


    productCount.textContent =
        `${count} Product${count === 1 ? "" : "s"}`;

}


// ========================================
// LOADING
// ========================================

function showLoading() {

    if (!productsTableBody) {

        return;

    }


    productsTableBody.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="text-center py-4"
            >

                <div
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                ></div>

                Loading products...

            </td>

        </tr>

    `;

}


// ========================================
// ERROR
// ========================================

function showError(message) {

    if (!productsTableBody) {

        return;

    }


    productsTableBody.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="text-center text-danger py-4"
            >

                <i
                    class="bi bi-exclamation-triangle fs-3 d-block mb-2"
                ></i>

                ${escapeHtml(
                    message ||
                    "Unable to load products"
                )}

            </td>

        </tr>

    `;


    updateProductCount(0);

}


// ========================================
// FORMAT NUMBER
// ========================================

function formatNumber(value) {

    const number =
        Number(value ?? 0);


    return number.toLocaleString(
        "en-NG",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ========================================
// ADD PRODUCT
// ========================================

const addProductForm =
    document.getElementById("addProductForm");

const saveProductButton =
    document.getElementById("saveProductButton");

const productFormMessage =
    document.getElementById("productFormMessage");


if (addProductForm) {

    addProductForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Clear previous message

            if (productFormMessage) {

                productFormMessage.className =
                    "alert d-none";

                productFormMessage.textContent = "";

            }


            // Get form fields

            const name =
                document.getElementById("productName");

            const sku =
                document.getElementById("productSku");

            const categoryId =
                document.getElementById("productCategory");

            const supplierId =
                document.getElementById("productSupplier");

            const price =
                document.getElementById("productPrice");

            const quantity =
                document.getElementById("productQuantity");

            const minimumStockLevel =
                document.getElementById("minimumStockLevel");

            const description =
                document.getElementById("productDescription");


            // ========================================
            // VALIDATION
            // ========================================

            let isValid = true;


            [
                name,
                sku,
                categoryId,
                price,
                quantity,
                minimumStockLevel
            ].forEach(field => {

                if (!field) {
                    return;
                }

                field.classList.remove("is-invalid");

            });


            if (!name.value.trim()) {

                name.classList.add("is-invalid");

                isValid = false;

            }


            if (!sku.value.trim()) {

                sku.classList.add("is-invalid");

                isValid = false;

            }


            if (!categoryId.value) {

                categoryId.classList.add("is-invalid");

                isValid = false;

            }


            if (
                price.value === "" ||
                Number(price.value) < 0
            ) {

                price.classList.add("is-invalid");

                isValid = false;

            }


            if (
                quantity.value === "" ||
                Number(quantity.value) < 0
            ) {

                quantity.classList.add("is-invalid");

                isValid = false;

            }


            if (
                minimumStockLevel.value === "" ||
                Number(minimumStockLevel.value) < 0
            ) {

                minimumStockLevel.classList.add("is-invalid");

                isValid = false;

            }


            if (!isValid) {

                return;

            }


            // ========================================
            // DISABLE BUTTON
            // ========================================

            saveProductButton.disabled = true;

            saveProductButton.innerHTML = `
                <span
                    class="spinner-border spinner-border-sm me-1"
                    role="status"
                ></span>
                Saving...
            `;


            try {

                // ========================================
                // SEND PRODUCT TO BACKEND
                // ========================================

                const response =
                    await authenticatedRequest(
                        "/products",
                        {

                            method: "POST",

                            body: JSON.stringify({

                                name:
                                    name.value.trim(),

                                sku:
                                    sku.value.trim(),

                                description:
                                    description.value.trim() || null,

                                categoryId:
                                    Number(categoryId.value),

                                supplierId:
                                    supplierId.value
                                        ? Number(supplierId.value)
                                        : null,

                                price:
                                    Number(price.value),

                                quantity:
                                    Number(quantity.value),

                                minimumStockLevel:
                                    Number(
                                        minimumStockLevel.value
                                    )

                            })

                        }
                    );


                console.log(
                    "Create product response:",
                    response
                );


                // ========================================
                // HANDLE ERROR
                // ========================================

                if (!response.success) {

                    throw new Error(
                        response.data?.message ||
                        "Failed to create product"
                    );

                }


                // ========================================
                // SUCCESS
                // ========================================

                if (productFormMessage) {

                    productFormMessage.className =
                        "alert alert-success";

                    productFormMessage.textContent =
                        "Product created successfully.";

                }


                // Reset form

                addProductForm.reset();


                // Remove validation states

                addProductForm
                    .querySelectorAll(".is-valid")
                    .forEach(field => {

                        field.classList.remove(
                            "is-valid"
                        );

                    });


                // Reload products

                await loadProducts();


                // Close modal after short delay

                setTimeout(() => {

                    const modalElement =
                        document.getElementById(
                            "addProductModal"
                        );

                    if (modalElement) {

                        const modal =
                            bootstrap.Modal.getInstance(
                                modalElement
                            );

                        if (modal) {

                            modal.hide();

                        }

                    }

                }, 800);


            } catch (error) {

                console.error(
                    "Create product error:",
                    error
                );


                if (productFormMessage) {

                    productFormMessage.className =
                        "alert alert-danger";

                    productFormMessage.textContent =
                        error.message ||
                        "Unable to create product.";

                }

            } finally {

                saveProductButton.disabled = false;

                saveProductButton.innerHTML = `
                    <i class="bi bi-plus-circle me-1"></i>
                    Add Product
                `;

            }

        }
    );

}