const pool = require("../config/database");


// ========================================
// GET DASHBOARD STATISTICS
// ========================================

const getDashboardStatistics = async () => {

    // ========================================
    // TOTAL PRODUCTS
    // ========================================

    const [productRows] = await pool.query(`
        SELECT COUNT(*) AS total_products
        FROM products
    `);


    // ========================================
    // TOTAL CATEGORIES
    // ========================================

    const [categoryRows] = await pool.query(`
        SELECT COUNT(*) AS total_categories
        FROM categories
    `);


    // ========================================
    // TOTAL SUPPLIERS
    // ========================================

    const [supplierRows] = await pool.query(`
        SELECT COUNT(*) AS total_suppliers
        FROM suppliers
    `);


    // ========================================
    // TOTAL STOCK
    // ========================================

    const [stockRows] = await pool.query(`
        SELECT
            COALESCE(SUM(quantity), 0) AS total_stock
        FROM inventory
    `);
// ========================================
// OUT OF STOCK COUNT
// ========================================

const [outOfStockRows] = await pool.query(`
    SELECT COUNT(*) AS out_of_stock_products
    FROM inventory
    WHERE quantity = 0
`);

    // ========================================
    // LOW STOCK COUNT
    // ========================================

    const [lowStockRows] = await pool.query(`
        SELECT COUNT(*) AS low_stock_products
        FROM inventory
        WHERE quantity > 0
        AND quantity <= reorder_level
    `);

// ========================================
// LOW STOCK PRODUCTS
// ========================================

const [lowStockProducts] = await pool.query(`
    SELECT

        i.id,

        i.product_id,

        p.name AS product_name,

        p.sku,

        i.quantity,

        i.reorder_level,

        CASE

            WHEN i.quantity = 0
                THEN 'OUT_OF_STOCK'

            WHEN i.quantity <= i.reorder_level
                THEN 'LOW_STOCK'

            ELSE 'IN_STOCK'

        END AS stock_status

    FROM inventory i

    INNER JOIN products p
        ON i.product_id = p.id

    WHERE i.quantity > 0
    AND i.quantity <= i.reorder_level

    ORDER BY i.quantity ASC

    LIMIT 10
`);



// ========================================
// RECENT STOCK TRANSACTIONS
// ========================================

const [recentTransactions] = await pool.query(`
    SELECT

        st.id,

        st.product_id,

        p.name AS product_name,

        p.sku,

        st.user_id,

        u.full_name AS user_name,

        st.transaction_type,

        st.quantity,

        st.notes,

        st.created_at

    FROM stock_transactions st

    INNER JOIN products p
        ON st.product_id = p.id

    INNER JOIN users u
        ON st.user_id = u.id

    ORDER BY st.created_at DESC

    LIMIT 10
`);

    // ========================================
    // RETURN DASHBOARD DATA
    // ========================================

    return {

        summary: {

            totalProducts:
                productRows[0].total_products,

            totalCategories:
                categoryRows[0].total_categories,

            totalSuppliers:
                supplierRows[0].total_suppliers,

            totalStock:
                stockRows[0].total_stock,

            lowStockProducts:
                lowStockRows[0].low_stock_products,

            outOfStockProducts:
                outOfStockRows[0].out_of_stock_products

        },


        lowStockItems:
            lowStockProducts,


        recentTransactions:
            recentTransactions

    };

};


module.exports = {
    getDashboardStatistics
};

