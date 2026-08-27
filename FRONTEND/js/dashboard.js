// ========================================
// DASHBOARD ELEMENTS
// ========================================

const totalProductsElement =
    document.getElementById(
        "totalProducts"
    );

const totalCategoriesElement =
    document.getElementById(
        "totalCategories"
    );

const totalSuppliersElement =
    document.getElementById(
        "totalSuppliers"
    );

const totalStockElement =
    document.getElementById(
        "totalStock"
    );

const lowStockProductsElement =
    document.getElementById(
        "lowStockProducts"
    );

const outOfStockProductsElement =
    document.getElementById(
        "outOfStockProducts"
    );


// ========================================
// DISPLAY LOW STOCK PRODUCTS
// ========================================

const displayLowStockProducts = (
    products
) => {

    const tableBody =
        document.getElementById(
            "lowStockTableBody"
        );

    const badge =
        document.getElementById(
            "lowStockBadge"
        );


    // ========================================
    // CHECK ELEMENTS
    // ========================================

    if (!tableBody) {

        console.error(
            "Element #lowStockTableBody was not found."
        );

        return;

    }


    // ========================================
    // MAKE SURE PRODUCTS IS AN ARRAY
    // ========================================

    if (!Array.isArray(products)) {

        products = [];

    }


    // ========================================
    // UPDATE LOW STOCK BADGE
    // ========================================

    if (badge) {

        badge.textContent =
            products.length;

    }


    // ========================================
    // NO LOW STOCK PRODUCTS
    // ========================================

    if (products.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center text-success"
                >

                    No low-stock products.

                </td>

            </tr>

        `;

        return;

    }


    // ========================================
    // DISPLAY LOW STOCK PRODUCTS
    // ========================================

    tableBody.innerHTML =
        products.map(
            (product, index) => {

                let statusClass =
                    "bg-success";

                let statusText =
                    "IN STOCK";


                // ========================================
                // LOW STOCK
                // ========================================

                if (
                    product.stock_status ===
                    "LOW_STOCK"
                ) {

                    statusClass =
                        "bg-warning text-dark";

                    statusText =
                        "LOW STOCK";

                }


                // ========================================
                // OUT OF STOCK
                // ========================================

                if (
                    product.stock_status ===
                    "OUT_OF_STOCK"
                ) {

                    statusClass =
                        "bg-danger";

                    statusText =
                        "OUT OF STOCK";

                }


                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${product.product_name || "N/A"}
                        </td>

                        <td>
                            ${product.sku || "N/A"}
                        </td>

                        <td>
                            ${product.quantity ?? 0}
                        </td>

                        <td>
                            ${product.reorder_level ?? 0}
                        </td>

                        <td>

                            <span
                                class="badge ${statusClass}"
                            >

                                ${statusText}

                            </span>

                        </td>

                    </tr>

                `;

            }
        ).join("");

};


// ========================================
// DISPLAY RECENT TRANSACTIONS
// ========================================

const displayRecentTransactions = (
    transactions
) => {

    const tableBody =
        document.getElementById(
            "recentTransactionsTableBody"
        );


    // ========================================
    // CHECK ELEMENT
    // ========================================

    if (!tableBody) {

        console.error(
            "Element #recentTransactionsTableBody was not found."
        );

        return;

    }


    // ========================================
    // MAKE SURE TRANSACTIONS IS AN ARRAY
    // ========================================

    if (!Array.isArray(transactions)) {

        transactions = [];

    }


    // ========================================
    // NO TRANSACTIONS
    // ========================================

    if (transactions.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center"
                >

                    No stock transactions found.

                </td>

            </tr>

        `;

        return;

    }


    // ========================================
    // DISPLAY TRANSACTIONS
    // ========================================

    tableBody.innerHTML =
        transactions.map(
            (transaction, index) => {

                // ========================================
                // CHECK TRANSACTION TYPE
                // ========================================

                const isStockIn =
                    transaction.transaction_type ===
                    "STOCK_IN";


                // ========================================
                // BADGE CLASS
                // ========================================

                const badgeClass =
                    isStockIn
                        ? "bg-success"
                        : "bg-danger";


                // ========================================
                // TRANSACTION TEXT
                // ========================================

                const typeText =
                    isStockIn
                        ? "STOCK IN"
                        : "STOCK OUT";


                // ========================================
                // TRANSACTION DATE
                // ========================================

                const date =
                    transaction.created_at
                        ? new Date(
                            transaction.created_at
                        ).toLocaleString()
                        : "N/A";


                // ========================================
                // RETURN TABLE ROW
                // ========================================

                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${transaction.product_name || "N/A"}
                        </td>

                        <td>

                            <span
                                class="badge ${badgeClass}"
                            >

                                ${typeText}

                            </span>

                        </td>

                        <td>
                            ${transaction.quantity ?? 0}
                        </td>

                        <td>
                            ${transaction.user_name || "N/A"}
                        </td>

                        <td>
                            ${date}
                        </td>

                    </tr>

                `;

            }
        ).join("");

};


// ========================================
// LOAD DASHBOARD
// ========================================

const loadDashboard = async () => {

    try {

        // ========================================
        // REQUEST DASHBOARD DATA
        // ========================================

        const result =
            await authenticatedRequest(
                "/dashboard"
            );


        // ========================================
        // CHECK AUTHENTICATION
        // ========================================

        if (
            result.status ===
            401
        ) {

            removeToken();

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "login.html";

            return;

        }


        // ========================================
        // CHECK RESPONSE
        // ========================================

        if (!result.success) {

            console.error(
                "Dashboard error:",
                result.data?.message ||
                "Unable to load dashboard."
            );

            return;

        }


        // ========================================
        // GET DASHBOARD DATA
        // ========================================

        const dashboardData =
            result.data?.data;


        if (!dashboardData) {

            console.error(
                "Dashboard data is missing."
            );

            return;

        }


        // ========================================
        // GET SUMMARY
        // ========================================

        const summary =
            dashboardData.summary || {};


        // ========================================
        // GET LOW STOCK ITEMS
        // ========================================

        const lowStockItems =
            dashboardData.lowStockItems || [];


        // ========================================
        // GET RECENT TRANSACTIONS
        // ========================================

        const recentTransactions =
            dashboardData.recentTransactions || [];


        // ========================================
        // UPDATE TOTAL PRODUCTS
        // ========================================

        if (totalProductsElement) {

            totalProductsElement.textContent =
                summary.totalProducts ?? 0;

        }


        // ========================================
        // UPDATE TOTAL CATEGORIES
        // ========================================

        if (totalCategoriesElement) {

            totalCategoriesElement.textContent =
                summary.totalCategories ?? 0;

        }


        // ========================================
        // UPDATE TOTAL SUPPLIERS
        // ========================================

        if (totalSuppliersElement) {

            totalSuppliersElement.textContent =
                summary.totalSuppliers ?? 0;

        }


        // ========================================
        // UPDATE TOTAL STOCK
        // ========================================

        if (totalStockElement) {

            totalStockElement.textContent =
                summary.totalStock ?? 0;

        }


        // ========================================
        // UPDATE LOW STOCK COUNT
        // ========================================

        if (lowStockProductsElement) {

            lowStockProductsElement.textContent =
                summary.lowStockProducts ?? 0;

        }


        // ========================================
        // UPDATE OUT OF STOCK COUNT
        // ========================================

        if (outOfStockProductsElement) {

            outOfStockProductsElement.textContent =
                summary.outOfStockProducts ?? 0;

        }


        // ========================================
        // DISPLAY LOW STOCK PRODUCTS
        // ========================================

        displayLowStockProducts(
            lowStockItems
        );


        // ========================================
        // DISPLAY RECENT TRANSACTIONS
        // ========================================

        displayRecentTransactions(
            recentTransactions
        );


        // ========================================
        // SUCCESS MESSAGE
        // ========================================

        console.log(
            "Dashboard loaded successfully."
        );


    } catch (error) {

        // ========================================
        // HANDLE ERROR
        // ========================================

        console.error(
            "Unable to load dashboard:",
            error
        );

    }

};


// ========================================
// INITIALIZE DASHBOARD
// ========================================

loadDashboard();
displayLowStockProducts([]);