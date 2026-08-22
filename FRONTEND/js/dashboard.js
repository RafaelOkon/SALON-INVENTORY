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
// LOAD DASHBOARD
// ========================================

const loadDashboard = async () => {

    try {

        const result =
            await authenticatedRequest(
                "/dashboard"
            );


        // ========================================
        // CHECK AUTHENTICATION
        // ========================================

        if (
            result.status === 401
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
                result.data.message
            );

            return;

        }


        // ========================================
        // GET SUMMARY DASHBOARD DATA
        // ========================================

        const summary =
            result.data.data.summary;

            const lowStockItems =
    result.data.data.lowStockItems;


const recentTransactions =
    result.data.data.recentTransactions;


        // ========================================
        // UPDATE DASHBOARD CARDS
        // ========================================

        totalProductsElement.textContent =
            summary.totalProducts;


        totalCategoriesElement.textContent =
            summary.totalCategories;


        totalSuppliersElement.textContent =
            summary.totalSuppliers;


        totalStockElement.textContent =
            summary.totalStock;


        lowStockProductsElement.textContent =
            summary.lowStockProducts;


        outOfStockProductsElement.textContent =
            summary.outOfStockProducts;

    
    } catch (error) {

        console.error(
            "Unable to load dashboard:",
            error
        );

    }

};

// ========================================
// UPDATE TABLES
// ========================================

displayLowStockProducts(
    lowStockItems
);


displayRecentTransactions(
    recentTransactions
);

// ========================================
// RUN DASHBOARD
// ========================================

loadDashboard();

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


    badge.textContent =
        products.length;


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


    tableBody.innerHTML =
        products.map(
            (product, index) => {

                let statusClass =
                    "bg-success";

                let statusText =
                    "IN STOCK";


                if (
                    product.stock_status ===
                    "LOW_STOCK"
                ) {

                    statusClass =
                        "bg-warning text-dark";

                    statusText =
                        "LOW STOCK";

                }


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
                            ${product.product_name}
                        </td>

                        <td>
                            ${product.sku}
                        </td>

                        <td>
                            ${product.quantity}
                        </td>

                        <td>
                            ${product.reorder_level}
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


    tableBody.index.innerHTML =
        transactions.map(
            (transaction, index) => {

                const isStockIn =
                    transaction.transaction_type ===
                    "STOCK_IN";


                const badgeClass =
                    isStockIn
                        ? "bg-success"
                        : "bg-danger";


                const typeText =
                    isStockIn
                        ? "STOCK IN"
                        : "STOCK OUT";


                const date =
                    new Date(
                        transaction.created_at
                    );


                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${transaction.product_name}
                        </td>

                        <td>

                            <span
                                class="badge ${badgeClass}"
                            >
                                ${typeText}
                            </span>

                        </td>

                        <td>
                            ${transaction.quantity}
                        </td>

                        <td>
                            ${transaction.user_name}
                        </td>

                        <td>
                            ${date.toLocaleString()}
                        </td>

                    </tr>

                `;

            }
        ).join("");

};
