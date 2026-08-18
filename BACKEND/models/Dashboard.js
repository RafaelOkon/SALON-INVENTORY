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
    // LOW STOCK PRODUCTS
    // ========================================

    const [lowStockRows] = await pool.query(`
        SELECT COUNT(*) AS low_stock_products
        FROM inventory
        WHERE quantity > 0
        AND quantity <= reorder_level
    `);


    // ========================================
    // OUT OF STOCK PRODUCTS
    // ========================================

    const [outOfStockRows] = await pool.query(`
        SELECT COUNT(*) AS out_of_stock_products
        FROM inventory
        WHERE quantity = 0
    `);


    return {

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

    };

};


module.exports = {
    getDashboardStatistics
};

