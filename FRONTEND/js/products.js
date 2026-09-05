// ========================================
// PRODUCTS PAGE
// ========================================

let allProducts = [];
let allCategories = [];
let allSuppliers = [];


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

const addProductForm =
    document.getElementById("addProductForm");

const saveProductButton =
    document.getElementById("saveProductButton");

const productFormMessage =
    document.getElementById("productFormMessage");


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeProductsPage
);


async function initializeProductsPage() {

    console.log("================================");
    console.log("Products page initialized");
    console.log("================================");

    setupEvents();

    await loadInitialData();

}


// ========================================
// LOAD ALL INITIAL DATA
// ========================================

async function loadInitialData() {

    showLoading();

    try {

        /*
         * Load products, categories and suppliers.
         *
         * Categories are now loaded DIRECTLY
         * from the categories API.
         */

        await Promise.all([
            loadProducts(),
            loadCategories(),
            loadSuppliers()
        ]);

        filterProducts();

    } catch (error) {

        console.error(
            "Initial products page error:",
            error
        );

        showError(
            error.message ||
            "Unable to load products"
        );

    }

}


// ========================================
// LOAD PRODUCTS
// ========================================

async function loadProducts() {

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
                response.message ||
                "Failed to load products"
            );

        }


        let products = [];


        /*
         * Expected backend response:
         *
         * {
         *     success: true,
         *     data: [...]
         * }
         */


        if (Array.isArray(response.data)) {

            products =
                response.data;

        }

        else if (
            Array.isArray(
                response.data?.data
            )
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


    } catch (error) {

        console.error(
            "Load products error:",
            error
        );

        throw error;

    }

}


// ========================================
// LOAD CATEGORIES
// ========================================

async function loadCategories() {

    try {

        console.log(
            "Loading categories..."
        );


        const response =
            await authenticatedRequest(
                "/categories",
                {
                    method: "GET"
                }
            );


        console.log(
            "Categories API response:",
            response
        );


        if (!response) {

            throw new Error(
                "No response received while loading categories"
            );

        }


        if (!response.success) {

            throw new Error(
                response.data?.message ||
                response.message ||
                "Failed to load categories"
            );

        }


        let categories = [];


        /*
         * Your backend controller returns:
         *
         * {
         *     success: true,
         *     count: 2,
         *     data: [...]
         * }
         */


        if (Array.isArray(response.data)) {

            categories =
                response.data;

        }

        else if (
            Array.isArray(
                response.data?.data
            )
        ) {

            categories =
                response.data.data;

        }


        allCategories =
            categories;


        console.log(
            "Categories loaded:",
            allCategories
        );


        populateCategoryDropdowns();


    } catch (error) {

        console.error(
            "Load categories error:",
            error
        );


        /*
         * Keep the dropdown usable even
         * when the API fails.
         */

        showCategoryError();

    }

}


// ========================================
// POPULATE CATEGORY DROPDOWNS
// ========================================

function populateCategoryDropdowns() {

    /*
     * Category filter
     */

    if (categoryFilter) {

        categoryFilter.innerHTML = `
            <option value="">
                All Categories
            </option>
        `;


        allCategories.forEach(
            category => {

                const option =
                    document.createElement("option");


                option.value =
                    category.id;


                option.textContent =
                    category.name;


                categoryFilter.appendChild(
                    option
                );

            }
        );

    }


    /*
     * Category field inside
     * Add Product modal.
     */

    const productCategory =
        document.getElementById(
            "productCategory"
        );


    if (productCategory) {

        productCategory.innerHTML = `
            <option value="">
                Select Category
            </option>
        `;


        allCategories.forEach(
            category => {

                const option =
                    document.createElement("option");


                option.value =
                    category.id;


                option.textContent =
                    category.name;


                productCategory.appendChild(
                    option
                );

            }
        );

    }


    console.log(
        "Category dropdowns populated:",
        allCategories.length
    );

}


// ========================================
// CATEGORY LOAD ERROR
// ========================================

function showCategoryError() {

    const productCategory =
        document.getElementById(
            "productCategory"
        );


    if (productCategory) {

        productCategory.innerHTML = `
            <option value="">
                Unable to load categories
            </option>
        `;

    }


    if (categoryFilter) {

        categoryFilter.innerHTML = `
            <option value="">
                Unable to load categories
            </option>
        `;

    }

}


// ========================================
// LOAD SUPPLIERS
// ========================================

async function loadSuppliers() {

    try {

        console.log(
            "Loading suppliers..."
        );


        /*
         * Try loading suppliers directly
         * from the backend.
         */

        const response =
            await authenticatedRequest(
                "/suppliers",
                {
                    method: "GET"
                }
            );


        console.log(
            "Suppliers API response:",
            response
        );


        if (
            response &&
            response.success
        ) {

            let suppliers = [];


            if (
                Array.isArray(
                    response.data
                )
            ) {

                suppliers =
                    response.data;

            }

            else if (
                Array.isArray(
                    response.data?.data
                )
            ) {

                suppliers =
                    response.data.data;

            }


            allSuppliers =
                suppliers;


            populateSupplierDropdowns();


            return;

        }


        /*
         * If supplier endpoint is not
         * available, build suppliers from
         * the products already loaded.
         */

        buildSuppliersFromProducts();


    } catch (error) {

        console.warn(
            "Supplier API unavailable. Building suppliers from products.",
            error
        );


        buildSuppliersFromProducts();

    }

}


// ========================================
// BUILD SUPPLIERS FROM PRODUCTS
// ========================================

function buildSuppliersFromProducts() {

    const suppliersMap =
        new Map();


    allProducts.forEach(
        product => {

            const id =
                product.supplier_id;


            const name =
                product.supplier_name ||
                product.supplier;


            if (
                id !== null &&
                id !== undefined &&
                name
            ) {

                suppliersMap.set(
                    String(id),
                    {
                        id: id,
                        name: name
                    }
                );

            }

        }
    );


    allSuppliers =
        Array.from(
            suppliersMap.values()
        );


    populateSupplierDropdowns();

}


// ========================================
// POPULATE SUPPLIER DROPDOWNS
// ========================================

function populateSupplierDropdowns() {

    /*
     * Supplier filter
     */

    if (supplierFilter) {

        supplierFilter.innerHTML = `
            <option value="">
                All Suppliers
            </option>
        `;


        allSuppliers.forEach(
            supplier => {

                const option =
                    document.createElement("option");


                option.value =
                    supplier.id;


                option.textContent =
                    supplier.name;


                supplierFilter.appendChild(
                    option
                );

            }
        );

    }


    /*
     * Supplier field inside
     * Add Product modal.
     */

    const productSupplier =
        document.getElementById(
            "productSupplier"
        );


    if (productSupplier) {

        productSupplier.innerHTML = `
            <option value="">
                Select Supplier
            </option>
        `;


        allSuppliers.forEach(
            supplier => {

                const option =
                    document.createElement("option");


                option.value =
                    supplier.id;


                option.textContent =
                    supplier.name;


                productSupplier.appendChild(
                    option
                );

            }
        );

    }

}


// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayProducts(products) {

    if (!productsTableBody) {

        console.error(
            "#productsTableBody not found"
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
                        getCategoryName(
                            product.category_id
                        ) ||
                        "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        product.supplier_name ||
                        product.supplier ||
                        getSupplierName(
                            product.supplier_id
                        ) ||
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
// GET CATEGORY NAME
// ========================================

function getCategoryName(categoryId) {

    if (
        categoryId === null ||
        categoryId === undefined
    ) {

        return "";

    }


    const category =
        allCategories.find(
            item =>
                String(item.id) ===
                String(categoryId)
        );


    return category
        ? category.name
        : "";

}


// ========================================
// GET SUPPLIER NAME
// ========================================

function getSupplierName(supplierId) {

    if (
        supplierId === null ||
        supplierId === undefined
    ) {

        return "";

    }


    const supplier =
        allSuppliers.find(
            item =>
                String(item.id) ===
                String(supplierId)
        );


    return supplier
        ? supplier.name
        : "";

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


    // CATEGORY FILTER

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    // SUPPLIER FILTER

    if (supplierFilter) {

        supplierFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    // STOCK FILTER

    if (stockFilter) {

        stockFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    // RESET FILTERS

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


    // ADD PRODUCT

    if (addProductForm) {

        addProductForm.addEventListener(
            "submit",
            handleAddProduct
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
// EDIT / DELETE
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


        alert(
            "Edit product feature will be implemented next."
        );


        return;

    }


    if (deleteButton) {

        const productId =
            deleteButton.dataset.productId;


        console.log(
            "Delete product:",
            productId
        );


        alert(
            "Delete product feature will be implemented next."
        );

    }

}


// ========================================
// ADD PRODUCT
// ========================================

async function handleAddProduct(event) {

    event.preventDefault();


    if (!addProductForm) {

        return;

    }


    clearFormMessage();


    const name =
        document.getElementById(
            "productName"
        );

    const sku =
        document.getElementById(
            "productSku"
        );

    const categoryId =
        document.getElementById(
            "productCategory"
        );

    const supplierId =
        document.getElementById(
            "productSupplier"
        );

    const price =
        document.getElementById(
            "productPrice"
        );

    const quantity =
        document.getElementById(
            "productQuantity"
        );

    const minimumStockLevel =
        document.getElementById(
            "minimumStockLevel"
        );

    const description =
        document.getElementById(
            "productDescription"
        );


    // ========================================
    // VALIDATION
    // ========================================

    let isValid = true;


    const fields = [
        name,
        sku,
        categoryId,
        price,
        quantity,
        minimumStockLevel
    ];


    fields.forEach(
        field => {

            if (field) {

                field.classList.remove(
                    "is-invalid"
                );

            }

        }
    );


    if (
        !name ||
        !name.value.trim()
    ) {

        name?.classList.add(
            "is-invalid"
        );

        isValid = false;

    }


    if (
        !sku ||
        !sku.value.trim()
    ) {

        sku?.classList.add(
            "is-invalid"
        );

        isValid = false;

    }


    if (
        !categoryId ||
        !categoryId.value
    ) {

        categoryId?.classList.add(
            "is-invalid"
        );

        isValid = false;

    }


    if (
        !price ||
        price.value === "" ||
        !Number.isFinite(Number(price.value)) ||
        Number(price.value) < 0
    ) {

        price?.classList.add(
            "is-invalid"
        );

        isValid = false;

    }


    if (
        !quantity ||
        quantity.value === "" ||
        !Number.isInteger(Number(quantity.value)) ||
        Number(quantity.value) < 0
    ) {

        quantity?.classList.add(
            "is-invalid"
        );

        isValid = false;

    }


    if (
        !minimumStockLevel ||
        minimumStockLevel.value === "" ||
        !Number.isInteger(Number(minimumStockLevel.value)) ||
        Number(minimumStockLevel.value) < 0
    ) {

        minimumStockLevel?.classList.add(
            "is-invalid"
        );

        isValid = false;

    }


    if (!isValid) {

        showFormMessage(
            "Please complete all required fields.",
            "danger"
        );

        return;

    }


    // ========================================
    // DISABLE BUTTON
    // ========================================

    if (saveProductButton) {

        saveProductButton.disabled = true;

        saveProductButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm me-1"
                role="status"
            ></span>
            Adding...
        `;

    }


    try {

        // ========================================
        // CREATE PRODUCT
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
                            description?.value.trim() ||
                            null,

                        categoryId:
                            Number(
                                categoryId.value
                            ),

                        supplierId:
                            supplierId?.value
                                ? Number(
                                    supplierId.value
                                )
                                : null,

                        price:
                            Number(
                                price.value
                            ),

                        quantity:
                            Number(
                                quantity.value
                            ),

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


        if (!response) {

            throw new Error(
                "No response received from server"
            );

        }


        if (!response.success) {

            throw new Error(
                response.data?.message ||
                response.message ||
                "Failed to create product"
            );

        }


        // ========================================
        // SUCCESS
        // ========================================

        showFormMessage(
            "Product created successfully.",
            "success"
        );


        console.log(
            "Product created successfully."
        );


        // Reset form

        addProductForm.reset();


        // Remove validation

        addProductForm
            .querySelectorAll(
                ".is-invalid"
            )
            .forEach(
                field => {

                    field.classList.remove(
                        "is-invalid"
                    );

                }
            );


        /*
         * Re-populate category and supplier
         * dropdowns after reset.
         */

        populateCategoryDropdowns();

        populateSupplierDropdowns();


        // Reload products

        await loadProducts();


        filterProducts();


        // ========================================
        // CLOSE MODAL
        // ========================================

        setTimeout(
            () => {

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

            },
            800
        );


    } catch (error) {

        console.error(
            "Create product error:",
            error
        );


        showFormMessage(
            error.message ||
            "Unable to create product.",
            "danger"
        );

    } finally {

        if (saveProductButton) {

            saveProductButton.disabled = false;

            saveProductButton.innerHTML = `
                <i class="bi bi-plus-circle me-1"></i>
                Add Product
            `;

        }

    }

}


// ========================================
// FORM MESSAGE
// ========================================

function showFormMessage(
    message,
    type
) {

    if (!productFormMessage) {

        return;

    }


    productFormMessage.className =
        `alert alert-${type}`;


    productFormMessage.textContent =
        message;

}


function clearFormMessage() {

    if (!productFormMessage) {

        return;

    }


    productFormMessage.className =
        "alert d-none";


    productFormMessage.textContent =
        "";

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